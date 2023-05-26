/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FaWifi, FaParking, FaDog, FaBed, FaCheck } from 'react-icons/fa';
import { API_URL_VENUES } from '../../common/common';
import { useParams } from 'react-router-dom';
import { BackNext } from '../../components/Buttons/BackNext';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Manage = () => {
	const [meta, setMeta] = useState({
		wifi: false,
		parking: false,
		pets: false,
		breakfast: false,
	});

	const venueValues = {
		name: '',
		price: 0,
		address: '',
		city: '',
		zip: '',
		country: '',
		continent: '',
		lat: 0,
		lng: 0,
		meta: {
			wifi: false,
			parking: false,
			breakfast: false,
			pets: false,
		},
		description: '',
		media: [],
		maxGuests: 0,
	};

	const [media, setMedia] = useState([]);
	const [step, setStep] = useState(1);

	const params = useParams().id;
	const url = `${API_URL_VENUES}/${params}`;

	useEffect(() => {
		axios.get(url).then((res) => {
			res = res.data;
			const location = res.location;
			setMedia(res.media || []);
			setValue('name', res.name);
			setValue('price', res.price);
			setValue('location.address', location.address);
			setValue('location.city', location.city);
			setValue('location.zip', location.zip);
			setValue('location.country', location.country);
			setValue('location.continent', location.continent);
			setValue('maxGuests', res.maxGuests);
			setValue('description', res.description);
			setValue('media', res.media.join(','));

			if (res.meta) {
				setMeta(res.meta);
			}
		});
	}, [url]);

	const onSubmit = (data) => {
		data = { ...data, meta };

		if (step < 3) {
			setStep((prevState) => prevState + 1);
		} else {
			data.media = data.media.split(',');
			axios
				.put(url, data, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				.then((res) => {
					console.log(res);
					window.location.href = `/venue/${params}`;
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const { register, handleSubmit, setValue } = useForm({ defaultValues: venueValues });

	const MetaIcons = ({ name, icon: Icon, metaState, setMetaState }) => {
		const handleIconClick = () => {
			setMetaState((prevState) => ({ ...prevState, [name]: !metaState[name] }));
		};

		return (
			<div onClick={handleIconClick} className='flex flex-col items-center space-y-1 cursor-pointer'>
				<div className='flex items-center space-x-1'>
					<Icon size={24} />
					{metaState[name] && <FaCheck className='text-green-500' />}
				</div>
				<p className='text-sm text-gray-600 capitalize'>{name}</p>
			</div>
		);
	};

	return (
		<div className='container mx-auto max-w-screen-lg'>
			<Helmet>
				<title>Manage venue</title>
				<meta name='description' content='At Holidaze you can update your venue without any issues!' />
			</Helmet>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='p-6 border border-blue-500 rounded-lg bg-white shadow-xl mt-10'
			>
				{step === 1 && (
					<div className='mt-4'>
						<h3 className='text-lg leading-6 font-medium text-gray-900'>Venue Details</h3>
						<div className='mt-4'>
							<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
								Venue name
							</label>
							<input
								{...register('name', { required: true })}
								id='name'
								placeholder='Venue name'
								className='block w-full placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
							<label htmlFor='price' className='block text-sm font-medium text-gray-700 mt-4'>
								Price
							</label>
							<div className='flex items-center flex-row'>
								<input
									{...register('price', { required: true })}
									id='price'
									placeholder='Price'
									className='block w-24 placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
								/>
								<p className='text-xl'>$</p>
							</div>
							<label htmlFor='maxGuests' className='block text-sm font-medium text-gray-700 mt-4'>
								Max guests
							</label>
							<input
								{...register('maxGuests', { required: true })}
								id='maxGuests'
								placeholder='Max guests'
								className='block w-32 placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>

							<h3 className='text-lg leading-6 font-medium text-gray-900 mt-6'>Meta tags</h3>
							<div className='mt-4 space-y-4 flex flex-row gap-6'>
								<MetaIcons name='wifi' icon={FaWifi} metaState={meta} setMetaState={setMeta} />
								<MetaIcons name='parking' icon={FaParking} metaState={meta} setMetaState={setMeta} />
								<MetaIcons name='pets' icon={FaDog} metaState={meta} setMetaState={setMeta} />
								<MetaIcons name='breakfast' icon={FaBed} metaState={meta} setMetaState={setMeta} />
							</div>
						</div>
					</div>
				)}
				{step === 2 && (
					<div className='mt-4'>
						<h3 className='text-lg leading-6 font-medium text-gray-900'>Address</h3>
						<div className='mt-4'>
							<label htmlFor='address' className='block text-sm font-medium text-gray-700'>
								Address
							</label>
							<div className='flex gap-4'>
								<input
									{...register('location.address', { required: true })}
									id='address'
									placeholder='Address'
									className='w-4/5 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
								/>
								<input
									{...register('location.zip', { required: true })}
									id='zip'
									placeholder='ZIP'
									className='w-1/5 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
								/>
							</div>
							<label htmlFor='country' className='block text-sm font-medium text-gray-700 mt-4'>
								Country
							</label>
							<input
								{...register('location.country', { required: true })}
								id='country'
								placeholder='Country'
								className='block w-full placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
							<label htmlFor='continent' className='block text-sm font-medium text-gray-700 mt-4'>
								Continent
							</label>
							<input
								{...register('location.continent', { required: true })}
								id='continent'
								placeholder='Continent'
								className='block w-full placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
						</div>
					</div>
				)}
				{step === 3 && (
					<div className='mt-4'>
						<h3 className='text-lg leading-6 font-medium text-gray-900'>Description and Images</h3>
						<div className='mt-4'>
							<label htmlFor='description' className='block text-sm font-medium text-gray-700'>
								Description
							</label>
							<textarea
								{...register('description', { required: true })}
								id='description'
								className='block w-full placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
							/>
							<label htmlFor='images' className='block text-sm font-medium text-gray-700 mt-4'>
								Images (comma separated URLs)
							</label>
							<input
								{...register('media', { required: true })}
								id='images'
								className='block w-10/12 placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
							/>
							<div className='mt-4'>
								<CarouselProvider
									naturalSlideWidth={100}
									naturalSlideHeight={100}
									totalSlides={media.length}
									isPlaying={true}
									interval={3000}
									infinite={true}
								>
									<Slider>
										{media.map((image, index) => (
											<Slide key={index} index={index}>
												<img src={image} alt='room' className='w-full h-64 object-cover' />
											</Slide>
										))}
									</Slider>
									<div className='flex justify-center mt-4'>
										<ButtonBack className='mr-4'>
											<MdKeyboardArrowLeft className='w-6 h-6' />
										</ButtonBack>
										<ButtonNext>
											<MdKeyboardArrowRight className='w-6 h-6' />
										</ButtonNext>
									</div>
								</CarouselProvider>
							</div>
						</div>
					</div>
				)}

				<div className='flex space-x-2 mt-8 mb-12'>
					<BackNext step={step} setStep={setStep} />
					{step === 3 && (
						<button
							type='submit'
							className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
						>
							Submit
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default Manage;
