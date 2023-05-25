import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaWifi, FaParking, FaDog, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import { MdFoodBank, MdFullscreenExit, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Modal from 'react-modal';
import { API_URL_VENUES } from '../../common/common';
import { Booking } from '../../components/Booking/Booking';
import { ViewBooking } from '../../components/Booking/ViewBooking';
import { Loader } from '../../components/Loader/Loader';

function Venue({ isLoggedIn }) {
	const [venue, setVenue] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [venueOwner, setVenueOwner] = useState({
		name: '',
		email: '',
		avatar: '',
	});
	const [location, setLocation] = useState([]);
	const [venueNotFound, setVenueNotFound] = useState(false);

	const missingImage = (e) => {
		e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
	};

	let params = useParams().id;

	useEffect(() => {
		axios
			.get(`${API_URL_VENUES}/${params}?_owner=true`)
			.then((res) => {
				res = res.data;
				setVenue(res);
				setIsLoading(false);
				setVenueOwner({
					name: res.owner.name,
					email: res.owner.email,
					avatar: res.owner.avatar,
				});
				setLocation(res.location);
				const userEmail = localStorage.getItem('email');
				if (res.owner.email === userEmail) {
					setIsOwner(true);
				} else {
					setIsOwner(false);
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === 404) {
					setVenueNotFound(true);
					setIsLoading(false);
				} else if (error.response && error.response.status === 400) {
					setVenueNotFound(true);
					setIsLoading(false);
				}
			});
	}, [params]);

	if (venueNotFound) {
		return (window.location.href = '/*');
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader />
			</div>
		);
	}

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	const deleteVenue = () => {
		axios
			.delete(`${API_URL_VENUES}/${params}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				console.log(res);
				window.location.href = '/';
			});
	};

	return (
		<div className='container w-11/12 mx-auto mb-32'>
			<div className='container mx-auto mb-8'>
				<h1 className='text-3xl font-bold my-4'>{venue.name}</h1>
				{isOwner && (
					<div className='flex flex-row space-x-4 text-center'>
						<Link
							to={`/manage/${params}`}
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'
						>
							Edit Venue
						</Link>
						<ViewBooking venueId={params} />
						<button
							type='button'
							onClick={openModal}
							className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 text-l rounded'
						>
							Delete Venue
						</button>
						<Modal
							isOpen={modalIsOpen}
							onRequestClose={closeModal}
							className='w-9/12 h-auto outline-none'
							overlayClassName='fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50'
						>
							<span
								className='cursor-pointer z-40 text-white absolute top-4 right-4 text-6xl rounded-full bg-blue-600 bg-opacity-50 p-2'
								onClick={closeModal}
							>
								<MdFullscreenExit />
							</span>
							<div className='flex flex-col justify-center items-center'>
								<h1 className='text-3xl font-bold my-4'>Are you sure you want to delete this venue?</h1>
								<div className='space-x-6'>
									<button
										type='button'
										onClick={closeModal}
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'
									>
										Cancel
									</button>
									<button
										type='button'
										onClick={deleteVenue}
										className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 text-l rounded'
									>
										Delete
									</button>
								</div>
							</div>
						</Modal>
					</div>
				)}
			</div>
			<div className='mb-4 flex flex-col md:flex-row z-0'>
				<div className='md:w-2/3 md:pr-4'>
					<CarouselProvider
						naturalSlideWidth={100}
						naturalSlideHeight={100}
						totalSlides={venue.media.length}
						className='relative'
					>
						<Slider>
							{venue.media.map((image, index) => (
								<Slide index={index} key={index}>
									<img
										src={image}
										alt={venue.name}
										onError={missingImage}
										className='w-full h-full object-cover rounded-md'
									/>
								</Slide>
							))}
						</Slider>
						{venue.media.length > 1 && (
							<div className='absolute top-0 left-0 w-full h-full flex justify-between items-center'>
								<ButtonBack className='absolute top-1/2 left-0 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'>
									<MdKeyboardArrowLeft />
								</ButtonBack>
								<ButtonNext className='absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'>
									<MdKeyboardArrowRight />
								</ButtonNext>
							</div>
						)}
					</CarouselProvider>
				</div>
				<div className='md:w-1/3 md:pl-4 flex flex-col'>
					<div className='mb-4 bg-white bg-opacity-80 p-4 rounded shadow-lg w-fit border border-blue-300'>
						<span className='mr-2 flex flex-row mb-2'>
							<FaBed />
							<span className='ml-1'>{venue.maxGuests} Guests</span>
						</span>
						<span className='mr-2 flex flex-row mb-2'>
							<FaDog />
							<span className='ml-1'>{venue.meta.pets ? 'Pets Allowed' : 'No Pets Allowed'}</span>
						</span>
						<span className='mr-2 flex flex-row mb-2'>
							<FaWifi />
							<span className='ml-1'>{venue.meta.wifi ? 'Wifi Available' : 'No Wifi'}</span>
						</span>
						<span className='mr-2 flex flex-row mb-2'>
							<FaParking />
							<span className='ml-1'>{venue.meta.parking ? 'Parking Available' : 'No Parking'}</span>
						</span>
						<span className='mr-2 flex flex-row mb-2'>
							<MdFoodBank />
							<span className='ml-1'>{venue.meta.breakfast ? 'Breakfast Included' : 'No Breakfast'}</span>
						</span>
					</div>
					<div className='mt-4 flex flex-col w-full'>
						<span className='text-blue-500 font-semibold'>${venue.price}/night</span>
						<Booking venueId={params} isLoggedIn={isLoggedIn} />
					</div>
				</div>
			</div>
			<div className='flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0'>
				<div className='bg-blue-500 p-4 rounded w-fit h-fit'>
					<h1 className='text-white text-2xl font-bold mb-4'>Venue Created by</h1>
					<div className='rounded-full h-24 w-24 mx-auto border-4 border-blue-300 shadow-lg overflow-hidden'>
						<div className='relative h-full w-full'>
							<img
								src={venueOwner.avatar || 'https://placehold.co/100x100?text=Avatar'}
								alt={venueOwner.name}
								className='object-cover w-full h-full'
							/>
						</div>
					</div>
					<h2 className='text-white text-2xl font-bold text-center'>{venueOwner.name}</h2>
					<p className='text-white text-center'>{venueOwner.email}</p>
				</div>
				<div className='mt-4 w-full md:w-6/12'>
					<div className='font-bold text-gray-500 mb-2'>Description:</div>
					<p>{venue.description}</p>
				</div>
			</div>
			{location && (
				<div className='mt-4'>
					<div className='font-bold text-gray-500 mb-2'>Location:</div>
					<div className='flex items-center'>
						<FaMapMarkerAlt className='mr-2' />
					</div>
				</div>
			)}
		</div>
	);
}

Venue.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
};

export default Venue;
