import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from 'react-modal';
import { API_URL_VENUES } from '../../common/common';

Modal.setAppElement('#root');

export const ViewBooking = ({ venueId }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [bookings, setBookings] = useState([]);

	const dateFormatter = (dateTimeString) => {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		};
		const dateTime = new Date(dateTimeString).toLocaleDateString(undefined, options);
		return dateTime;
	};

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const res = await axios.get(`${API_URL_VENUES}/${venueId}?_bookings=true`);
				const data = res.data.bookings;
				setBookings(data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchBookings();
	}, [venueId]);

	return (
		<>
			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				onClick={() => setModalIsOpen(true)}
			>
				View Bookings
			</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				contentLabel='Bookings Modal'
				className='bg-white p-4 rounded-lg shadow-lg outline-none container mx-auto max-w-3xl h-3/4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto'
			>
				<button
					className='float-right bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
					onClick={() => setModalIsOpen(false)}
				>
					X
				</button>
				<h2 className='text-2xl font-bold mb-4'>Bookings for Venue</h2>
				{bookings.length > 0 ? (
					<table className='min-w-full bg-white'>
						<thead>
							<tr>
								<th className='py-2 px-4 bg-gray-200'>Date From</th>
								<th className='py-2 px-4 bg-gray-200'>Date To</th>
								<th className='py-2 px-4 bg-gray-200'>Guests</th>
								<th className='py-2 px-4 bg-gray-200'>Created</th>
								<th className='py-2 px-4 bg-gray-200'>Updated</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map((booking) => (
								<tr key={booking.id}>
									<td className='py-2 px-4'>{dateFormatter(booking.dateFrom)}</td>
									<td className='py-2 px-4'>{dateFormatter(booking.dateTo)}</td>
									<td className='py-2 px-4'>{booking.guests}</td>
									<td className='py-2 px-4'>{dateFormatter(booking.created)}</td>
									<td className='py-2 px-4'>{dateFormatter(booking.updated)}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p className='text-gray-700'>No bookings available for this venue.</p>
				)}
			</Modal>
		</>
	);
};

ViewBooking.propTypes = {
	venueId: PropTypes.string.isRequired,
};
