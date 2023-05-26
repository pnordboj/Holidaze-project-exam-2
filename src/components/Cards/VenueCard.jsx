import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed } from 'react-icons/fa';

export const VenueCard = ({ venue, missingImage }) => {
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

VenueCard.propTypes = {
	venue: PropTypes.object.isRequired,
	missingImage: PropTypes.func.isRequired,
};
