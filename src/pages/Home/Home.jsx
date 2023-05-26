import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed } from 'react-icons/fa';
import { API_URL_VENUES } from '../../common/common';
import { BackToTop } from '../../components/Buttons/BackToTop';
import { Loader } from '../../components/Loader/Loader';
import axios from 'axios';

const Home = ({ isLoggedIn, isManager }) => {
	const [venues, setVenues] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${API_URL_VENUES}?sort=created&sortOrder=desc`);
				setVenues(response.data);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

	const filteredVenues = venues.filter((venue) => {
		return venue.name.toLowerCase().includes(search.toLowerCase());
	});

	const handleChange = (e) => {
		setSearch(e.target.value);
	};

	const missingImage = (e) => {
		e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className='container mx-auto w-11/12'>
			<h1 className='text-3xl font-bold my-4'>Venues</h1>
			<div className='flex flex-col '>
				<label htmlFor='search' className='text-md font-semibold mb-2'>
					Search Venues
				</label>
				<input
					type='text'
					placeholder='Search'
					onChange={handleChange}
					className='w-12/12 mb-6 border shadow-md border-blue-500 rounded p-1 sm:w-11/12 md:w-9/12 lg:w-6/12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
				/>
			</div>
			<div className='flex flex-row space-x-12 mb-6'>
				{isLoggedIn && isManager && (
					<Link
						to='/create-venue'
						className='px-6 py-4 rounded-md text-white text-lg font-bold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
					>
						Create Venue
					</Link>
				)}
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 mb-24 lg:grid-cols-3 gap-4'>
				{filteredVenues.map((venue) => (
					<VenueCard key={venue.id} venue={venue} missingImage={missingImage} />
				))}
			</div>
			<BackToTop />
		</div>
	);
};

const VenueCard = ({ venue, missingImage }) => {
	const { id, media, name, maxGuests, meta, price } = venue;

	return (
		<div className='bg-white shadow-md border border-blue-200 rounded-md p-4 cursor-pointer hover:bg-blue-100'>
			<Link to={`/venue/${id}`}>
				<div className='relative h-48 rounded-md overflow-hidden'>
					<img
						src={media}
						onError={missingImage}
						alt={name}
						className='absolute inset-0 w-full h-full object-cover rounded-md'
					/>
					<div className='absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300'>
						<div className='flex flex-col items-center justify-center h-full text-white'>
							<h2 className='text-xl font-semibold mb-2'>{name}</h2>
							<div className='mt-2 flex flex-wrap justify-center items-center'>
								<span className='mr-4 flex items-center'>
									<FaBed className='mr-1' />
									{maxGuests} Guests
								</span>
								<span className='mr-4 flex items-center'>
									<FaDog className='mr-1' />
									{meta.pets ? 'Pets Allowed' : 'No Pets Allowed'}
								</span>
								<span className='mr-4 flex items-center'>
									<FaWifi className='mr-1' />
									{meta.wifi ? 'Wifi Available' : 'No Wifi'}
								</span>
								<span className='mr-4 flex items-center'>
									<FaParking className='mr-1' />
									{meta.parking ? 'Parking Available' : 'No Parking'}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-4 flex items-center justify-between'>
					<span className='text-blue-500 font-semibold'>${price}/night</span>
					<span className='text-gray-600 font-semibold'>{name}</span>
				</div>
			</Link>
		</div>
	);
};

Home.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	isManager: PropTypes.bool.isRequired,
};
VenueCard.propTypes = {
	venue: PropTypes.object.isRequired,
	missingImage: PropTypes.func.isRequired,
};

export default Home;
