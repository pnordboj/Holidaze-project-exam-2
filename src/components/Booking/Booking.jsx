import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL_BOOKINGS, API_URL_VENUES } from '../../common/common';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

export const Booking = ({ venueId, isLoggedIn }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [guests, setGuests] = useState(1);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [venue, setVenue] = useState([]);
	const [bookedDates, setBookedDates] = useState([]);
	const [completedBooking, setCompletedBooking] = useState(false);

	const fetchVenue = () => {
		axios.get(`${API_URL_VENUES}/${venueId}?_bookings=true`).then((res) => {
			const { bookings } = res.data;
			setVenue(res.data);
			setBookedDates(getBookedDates(bookings));
		});
	};

	const getBookedDates = (bookings) => {
		return bookings.map((booking) => {
			const startDate = new Date(booking.dateFrom);
			const endDate = new Date(booking.dateTo);
			return { startDate, endDate };
		});
	};

	const isBooked = (date) => {
		return bookedDates.some((bookedDate) => {
			return date.getTime() >= bookedDate.startDate.getTime() && date.getTime() <= bookedDate.endDate.getTime();
		});
	};

	const formatDate = (date) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return date.toLocaleDateString(undefined, options);
	};

	const renderBookedDates = ({ day, isDateSelected, isDateHovered }) => {
		const isBooked = isBooked(day);
		const isHighlighted = isDateSelected || isDateHovered || isBooked;

		return <div className={`react-datepicker-day-custom ${isHighlighted ? 'highlighted' : ''}`}>{day.getDate()}</div>;
	};

	const submitBooking = () => {
		const booking = {
			dateFrom: startDate.toISOString(),
			dateTo: endDate.toISOString(),
			guests: parseInt(guests),
			venueId: venueId,
		};
		axios
			.post(API_URL_BOOKINGS, booking, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				if (res.status === 201) {
					setCompletedBooking(true);
				}
			});
	};
	return (
		<div>
			{isLoggedIn ? (
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => {
						setModalIsOpen(true);
						fetchVenue();
					}}
				>
					Book Venue
				</button>
			) : (
				<Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' to='/login'>
					Login to Book
				</Link>
			)}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				contentLabel='Booking Modal'
				className='bg-white p-4 rounded-lg shadow-lg outline-none container mx-auto w-1/2 h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
			>
				<button
					className='float-right bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
					onClick={() => setModalIsOpen(false)}
				>
					X
				</button>
				<h2 className='text-2xl font-bold mb-4'>Book Venue</h2>
				<div className='mb-3'>
					<label className='font-bold mb-1 block'>Guests:</label>
					<input
						type='number'
						value={guests}
						min='1'
						max={venue?.maxGuests}
						onChange={(e) => setGuests(e.target.value)}
						className='border rounded p-2 w-full'
					/>
					{guests > venue?.maxGuests && <p className='text-red-500'>Too many guests</p>}
					{guests < 1 && <p className='text-red-500'>Too few guests</p>}
				</div>
				<div className='mb-3'>
					<label className='font-bold mb-1 block'>From Date:</label>
					<DatePicker
						selected={startDate}
						onChange={(date) => setStartDate(date)}
						selectsStart
						startDate={startDate}
						endDate={endDate}
						filterDate={(date) => date.getDay() !== 0 && !isBooked(date) && date > new Date()}
						renderCustomDay={renderBookedDates}
						className='border rounded p-2 w-full'
					/>
				</div>
				<div className='mb-3'>
					<label className='font-bold mb-1 block'>To Date:</label>
					<DatePicker
						selected={endDate}
						onChange={(date) => setEndDate(date)}
						selectsEnd
						startDate={startDate}
						endDate={endDate}
						minDate={startDate}
						filterDate={(date) => date.getDay() !== 0 && !isBooked(date)}
						renderCustomDay={renderBookedDates}
						className='border rounded p-2 w-full'
					/>
				</div>
				<button
					className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full'
					onClick={submitBooking}
					disabled={isBooked(startDate) || isBooked(endDate)}
				>
					Confirm Booking
				</button>
			</Modal>
			<Modal
				isOpen={completedBooking}
				onRequestClose={() => setCompletedBooking(false)}
				contentLabel='Booking Modal'
				className='bg-white p-4 rounded-lg shadow-lg outline-none container mx-auto w-1/2 h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
			>
				<div>
					<h2 className='text-2xl font-bold mb-4'>Booking Complete</h2>
					<p className='mb-4'>Your booking has been confirmed.</p>
					<p className='mb-4'>
						You have booked {venue?.name} from {formatDate(startDate)} to {formatDate(endDate)} for {guests} guests.
					</p>
					<p className='mb-4'>You will be contacted by the venue to confirm your booking.</p>
					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
						onClick={() => {
							setModalIsOpen(false);
							setCompletedBooking(false);
						}}
					>
						Close
					</button>
				</div>
			</Modal>
		</div>
	);
};

Booking.propTypes = {
	venueId: PropTypes.string.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};
