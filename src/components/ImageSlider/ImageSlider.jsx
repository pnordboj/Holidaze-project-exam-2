/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

export const ImageSlider = ({ media = [] }) => {
	const [imageIndex, setImageIndex] = useState(0);

	const settings = {
		dots: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	const nextSlide = () => {
		const newIndex = imageIndex + 1;
		setImageIndex(newIndex >= media.length ? 0 : newIndex);
	};

	const prevSlide = () => {
		const newIndex = imageIndex - 1;
		setImageIndex(newIndex < 0 ? media.length - 1 : newIndex);
	};

	return (
		<div className='relative'>
			<Slider {...settings}>
				{media.map((image, index) => (
					<div key={index} className='mx-auto w-128 h-128'>
						<img src={image} alt='Venue' className='rounded text-center object-contain w-128 h-128' />
					</div>
				))}
			</Slider>
			<div className='absolute top-1/2 left-0 w-full flex justify-between'>
				<button
					type='button'
					onClick={prevSlide}
					className='text-white text-4xl px-4 py-2 bg-black bg-opacity-50 rounded-full'
				>
					Previous
				</button>
				<button
					type='button'
					onClick={nextSlide}
					className='text-white text-4xl px-4 py-2 bg-black bg-opacity-50 rounded-full'
				>
					Next
				</button>
			</div>
		</div>
	);
};
