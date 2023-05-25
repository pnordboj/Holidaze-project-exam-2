import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegSadTear } from 'react-icons/fa';

const NotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<div className='text-8xl text-gray-600 mb-4'>
				<FaRegSadTear />
			</div>
			<h1 className='text-3xl text-gray-800 mb-6'>Oh no! This page does not exist :(</h1>
			<Link to='/' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
				Return to Home
			</Link>
		</div>
	);
};

export default NotFound;
