import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import { API_URL_VENUES } from '../../common/common';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditBooking = ({ booking, bookingId, venueId, updateBooking }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalUserBooking, setModalUserBooking] = useState(false);
	const [guests, setGuests] = useState(booking.maxGuests);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [bookedDates, setBookedDates] = useState([]);
	const [maxGuests, setMaxGuests] = useState(0);

	useEffect(() => {
		fetchBookedDates();
	}, []);

	const fetchBookedDates = () => {
		let id = bookingId.map((booking) => booking.id);
		axios
			.get(`${API_URL_VENUES}/${venueId}?_bookings=true`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				const bookings = res.data;
				setBookedDates(getBookedDates(bookings, id));
				setMaxGuests(bookings.maxGuests);
			});
	};

	const getBookedDates = (bookings, bookingId) => {
		return bookings.bookings
			.filter((booking) => bookingId.includes(booking.id))
			.map((booking) => {
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

	const renderBookedDates = ({ day, isDateSelected, isDateHovered }) => {
		const isBooked = isBooked(day);
		const isHighlighted = isDateSelected || isDateHovered || isBooked;

		return <div className={`react-datepicker-day-custom ${isHighlighted ? 'highlighted' : ''}`}>{day.getDate()}</div>;
	};

	const formatDateFrom = (dateFrom) => {
		const date = new Date(dateFrom);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDateFrom = date.toLocaleDateString('en-GB', options);
		return `${formattedDateFrom}`;
	};

	const formatDateTo = (dateTo) => {
		const date = new Date(dateTo);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDateTo = date.toLocaleDateString('en-GB', options);
		return `${formattedDateTo}`;
	};

	const submitBooking = () => {
		const updatedBooking = {
			guests: parseInt(guests),
			dateFrom: startDate,
			dateTo: endDate,
		};
		updateBooking(updatedBooking);
		setModalIsOpen(false);
	};

	return (
		<div className='space-x-4'>
			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				onClick={() => setModalUserBooking(true)}
			>
				View Booking
			</button>
			<Modal
				isOpen={modalUserBooking}
				onRequestClose={() => setModalUserBooking(false)}
				contentLabel='User Booking Modal'
				className='bg-white p-4 rounded-lg border border-blue-500 shadow-lg outline-none container mx-auto w-fit h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
			>
				<button
					className='float-right bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
					onClick={() => setModalUserBooking(false)}
				>
					X
				</button>
				<h2 className='text-2xl font-bold mb-4'>Booking Details</h2>
				<div className='mb-3'>
					<label className='font-bold mb-1 block'>From:</label>
					<label className='font-bold mb-1 block'>{formatDateFrom(booking.dateFrom)}</label>
					<label className='font-bold mb-1 block'>To:</label>
					<label className='font-bold mb-1 block'>{formatDateTo(booking.dateTo)}</label>
					<label className='font-bold mb-1 block'>Guests:</label>
					<label className='font-bold mb-1 block'>{booking.guests}</label>
				</div>
			</Modal>
			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				onClick={() => setModalIsOpen(true)}
			>
				Edit Booking
			</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				contentLabel='Edit Booking Modal'
				className='bg-white p-4 rounded-lg shadow-lg outline-none container mx-auto w-1/2 h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
			>
				<button
					className='float-right bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
					onClick={() => setModalIsOpen(false)}
				>
					X
				</button>
				<h2 className='text-2xl font-bold mb-4'>Edit Booking</h2>
				<div className='mb-3'>
					<label className='font-bold mb-1 block'>Guests:</label>
					<input
						type='number'
						value={guests}
						min='1'
						max={maxGuests}
						onChange={(e) => setGuests(e.target.value)}
						className='border rounded p-2 w-full'
					/>
					{guests > maxGuests && <p className='text-red-500'>Too many guests</p>}
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
						filterDate={(date) => date.getDay() !== 0 && !isBooked(date) && date > new Date()}
						renderCustomDay={renderBookedDates}
						className='border rounded p-2 w-full'
					/>
				</div>
				<button
					className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full'
					onClick={submitBooking}
					disabled={guests > booking.maxGuests || guests < 1}
				>
					Update Booking
				</button>
			</Modal>
		</div>
	);
};

EditBooking.propTypes = {
	booking: PropTypes.object.isRequired,
	bookingId: PropTypes.array.isRequired,
	venueId: PropTypes.string.isRequired,
	updateBooking: PropTypes.func.isRequired,
};

export default EditBooking;
