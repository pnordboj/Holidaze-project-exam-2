/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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

	const fetchVenue = () => {
		axios.get(`${API_URL_VENUES}/${venueId}`).then((res) => {
			setVenue(res.data);
			console.log(res.data);
		});
	};

	const submitBooking = () => {
		const booking = {
			dateFrom: startDate,
			dateTo: endDate,
			guests: guests,
			venueId: venueId,
		};
		axios
			.post(
				API_URL_BOOKINGS,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				},
				booking,
			)
			.then((res) => {
				console.log(res);
			});
	};

	return (
		<div>
			{isLoggedIn ? (
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => setModalIsOpen(true) && fetchVenue}
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
						max={venue.maxGuests}
						onChange={(e) => setGuests(e.target.value)}
						className='border rounded p-2 w-full'
					/>
					{guests > venue.maxGuests && <p className='text-red-500'>Too many guests</p>}
				</div>
				<div className='mb-3'>
					<label className='font-bold mb-1 block'>From Date:</label>
					<DatePicker
						selected={startDate}
						onChange={(date) => setStartDate(date)}
						selectsStart
						startDate={startDate}
						endDate={endDate}
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
						className='border rounded p-2 w-full'
					/>
				</div>
				<button
					className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full'
					onClick={submitBooking}
				>
					Confirm Booking
				</button>
			</Modal>
		</div>
	);
};
