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
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Venue({ isLoggedIn }) {
	const [isOpen, setIsOpen] = useState(false);
	const [venue, setVenue] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCalendar, setShowCalendar] = useState(false);
	const [date, setDate] = useState(new Date());
	const [isOwner, setIsOwner] = useState(false);

	useEffect(() => {
		if (showCalendar) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [showCalendar]);

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
	};

	console.log(venue);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='container w-11/12 mx-auto'>
			{showCalendar && (
				<div className='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90'>
					<div className='bg-white rounded-md shadow-md p-4'>
						<Calendar onChange={setDate} value={date} />
						<button
							className='px-4 py-4 rounded-md text-white text-lg font-bold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
							onClick={() => setShowCalendar(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}
			<div className='container mx-auto mb-8'>
				<h1 className='text-3xl font-bold my-4'>{venue.name}</h1>
				{isOwner && (
					<Link
						to={`/manage/${venue.id}`}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'
					>
						Edit Venue
					</Link>
				)}
			</div>
			<div className='mb-4'>
				<Modal
					isOpen={isOpen}
					onRequestClose={() => setIsOpen(false)}
					className='w-9/12 h-auto outline-none'
					overlayClassName='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90'
				>
					<span className='cursor-pointer right-1 z-40 text-white absolute text-4xl' onClick={() => setIsOpen(false)}>
						<MdFullscreenExit />
					</span>
					{venue.media.length > 1 ? (
						<Slider {...sliderSettings}>
							{venue.media.map((image, index) => (
								<img key={index} src={image} alt={venue.name} className='object-contain w-full h-full' />
							))}
						</Slider>
					) : (
						<img src={venue.media} alt={venue.name} className='object-contain w-full h-full' />
					)}
				</Modal>
				<div className='mb-4'>
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
					<div className='mt-4 flex items-center justify-between'>
						<span className='text-blue-500 font-semibold'>${venue.price}/night</span>
						{isLoggedIn ? (
							<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Book Now</button>
						) : (
							<Link to='/login' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
								Login to Book
							</Link>
						)}
					</div>
					<div className='mt-4 flex items-center'>
						<span className='mr-2'>
							<FaBed />
							<span className='ml-1'>{venue.maxGuests} Guests</span>
						</span>
						<span className='mr-2'>
							<FaDog />
							<span className='ml-1'>{venue.meta.pets ? 'Pets Allowed' : 'No Pets Allowed'}</span>
						</span>
						<span className='mr-2'>
							<FaWifi />
							<span className='ml-1'>{venue.meta.wifi ? 'Wifi Available' : 'No Wifi'}</span>
						</span>
						<span className='mr-2'>
							<FaParking />
							<span className='ml-1'>{venue.meta.parking ? 'Parking Available' : 'No Parking'}</span>
						</span>
						<span className='mr-2'>
							<MdFoodBank />
							<span className='ml-1'>{venue.meta.breakfast ? 'Breakfast Included' : 'No Breakfast'}</span>
						</span>
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
			</div>
		</div>
	);
}

export default Venue;
