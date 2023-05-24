/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaWifi, FaParking, FaDog, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import { MdFoodBank, MdFullscreenExit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Modal from 'react-modal';
import { API_URL_VENUES } from '../../common/common';
import { Maps } from '../../components/Maps/Maps';
import { Booking } from '../../components/Booking/Booking';
import { Loader } from '../../components/Loader/Loader';

function Venue({ isLoggedIn }) {
	const [isOpen, setIsOpen] = useState(false);
	const [venue, setVenue] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const location = {
		lat: '',
		lng: '',
	};

	const venueOwner = {
		name: '',
		email: '',
		avatar: '',
	};

	const missingImage = (e) => {
		e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
	};

	let params = useParams().id;
	useEffect(() => {
		axios.get(`${API_URL_VENUES}/${params}?_owner=true`).then((res) => {
			res = res.data;
			setVenue(res);
			setIsLoading(false);
			if (res.location.lat && res.location.lng !== 0) {
				location.lat = res.location.lat;
				location.lng = res.location.lng;
			} else {
				location.lat = 0;
				location.lng = 0;
			}
			venueOwner.name = res.owner.name;
			venueOwner.email = res.owner.email;
			venueOwner.avatar = res.owner.avatar;
			const userEmail = localStorage.getItem('email');
			if (res.owner.email === userEmail) {
				setIsOwner(true);
			} else {
				setIsOwner(false);
			}
		});
	}, [params]);

	const Map = () => {
		if (location.lat && location.lng !== 0) {
			return <div className='w-full h-96'>No map available</div>;
		} else {
			<Maps lat={location.lat} lng={location.lng} />;
		}
	};

	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
	};

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
					<div className='space-x-6'>
						<Link
							to={`/manage/${venue.id}`}
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'
						>
							Edit Venue
						</Link>
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
							overlayClassName='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90'
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
			<div className='mb-4 flex flex-col md:flex-row'>
				<div className='md:w-2/3 md:pr-4'>
					<Modal
						isOpen={isOpen}
						onRequestClose={() => setIsOpen(false)}
						className='w-9/12 h-auto outline-none'
						overlayClassName='fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-90'
					>
						<span
							className='cursor-pointer z-40 text-white absolute top-4 right-4 text-6xl rounded-full bg-blue-600 bg-opacity-50 p-2'
							onClick={() => setIsOpen(false)}
						>
							<MdFullscreenExit />
						</span>
						{venue.media.length > 1 ? (
							<Slider {...sliderSettings}>
								{venue.media.map((image, index) => (
									<img key={index} src={image} alt={venue.name} className='w-8/12 h-8/12 mx-auto' />
								))}
							</Slider>
						) : (
							<img src={venue.media} alt={venue.name} className='w-8/12 h-8/12 mx-auto' />
						)}
					</Modal>

					{venue.media.length > 1 ? (
						<Slider {...sliderSettings}>
							{venue.media.map((image) => (
								<div key={image}>
									<img
										src={image}
										onError={missingImage}
										onClick={() => setIsOpen(true)}
										alt={venue.name}
										className='w-full h-64 object-cover rounded-md mb-4'
									/>
								</div>
							))}
						</Slider>
					) : (
						<img
							src={venue.media}
							alt={venue.name}
							onError={missingImage}
							onClick={() => setIsOpen(true)}
							className='w-full h-64 object-contain shadow-lg rounded-md mb-4 bg-slate-500'
						/>
					)}
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
						<Booking venueId={venue.id} isLoggedIn={isLoggedIn} />
					</div>
				</div>
			</div>
			<div className='mt-4'>
				<div className='font-bold text-gray-500 mb-2'>Description:</div>
				<p>{venue.description}</p>
			</div>
			<div className='mt-4'>
				<div className='font-bold text-gray-500 mb-2'>Location:</div>
				<div className='flex items-center'>
					<FaMapMarkerAlt className='mr-2' />
					<span className='ml-1'>{venue.location.address}</span>
				</div>
				<Map />
			</div>
		</div>
	);
}

export default Venue;
