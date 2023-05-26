import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL_VENUES } from '../../common/common';
import { BackToTop } from '../../components/Buttons/BackToTop';
import { Loader } from '../../components/Loader/Loader';
import { VenueCard } from '../../components/Cards/VenueCard';

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

Home.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	isManager: PropTypes.bool.isRequired,
};
export default Home;
