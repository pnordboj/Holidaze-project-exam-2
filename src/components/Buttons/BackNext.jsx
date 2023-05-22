/* eslint-disable react/prop-types */
import React from 'react';

export const BackNext = ({ step, setStep }) => {
	const handleNext = (event) => {
		event.preventDefault();
		setStep((prev) => prev + 1);
	};

	const handleBack = (event) => {
		event.preventDefault();
		setStep((prev) => prev - 1);
	};

	return (
		<div className='space-x-2'>
			{step > 1 && (
				<button
					onClick={handleBack}
					className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
				>
					Back
				</button>
			)}
			{step < 3 && (
				<button
					onClick={handleNext}
					className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
				>
					Next
				</button>
			)}
		</div>
	);
};
