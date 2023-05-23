/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { API_URL_VENUES } from '../../common/common';
import { BackNext } from '../../components/Buttons/BackNext';

const Create = () => {
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

	const [step, setStep] = useState(1);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: venueValues });
	const [showError, setShowError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const [meta, setMeta] = useState({
		wifi: false,
		parking: false,
		pets: false,
		breakfast: false,
	});

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
	const onSubmit = (data) => {
		try {
			data = { ...data, meta };
			data.price = parseInt(data.price);
			data.maxGuests = parseInt(data.maxGuests);
			data.media = data.media.split(',');
			if (step < 3) {
				setStep(step + 1);
			} else {
				const token = localStorage.getItem('token');
				axios
					.post(API_URL_VENUES, data, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
					.then((res) => {
						if (res.status === 201) {
							navigate('/');
						}
					})
					.catch((err) => {
						if (err.response.status < 500) {
							console.log(err.response.data.errors[0].message);
							setShowError(true);
							setErrorMsg(err.response.data.errors[0].message);
						}
					});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const ErrorMessage = () => {
		return (
			<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2'>
				<strong className='font-bold'>Error!</strong>
				<span className='block sm:inline ml-6'>{errorMsg}</span>
				<span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
					<svg
						className='fill-current h-6 w-6 text-red-500'
						role='button'
						onClick={() => setShowError(false)}
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
					>
						<title>Close</title>
						<path
							fillRule='evenodd'
							d='M14.348 5.652a.5.5 0 010 .707L9.707 10l4.64 4.64a.5.5 0 11-.707.707L9 10.707l-4.64 4.64a.5.5 0 11-.707-.707L8.293 10l-4.64-4.64a.5.5 0 01.707-.707L9 9.293l4.64-4.64a.5.5 0 01.708 0z'
							clipRule='evenodd'
						/>
					</svg>
				</span>
			</div>
		);
	};

	return (
		<div className='container mx-auto max-w-screen-lg w-11/12'>
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
							{errors.name && <span className='text-red-500'>Name is required</span>}
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
							{errors.price && <span className='text-red-500'>Price is required</span>}
							<label htmlFor='maxGuests' className='block text-sm font-medium text-gray-700 mt-4'>
								Max guests
							</label>
							<input
								{...register('maxGuests', { required: true, min: 1, max: 100 })}
								id='maxGuests'
								placeholder='Max guests'
								className='block w-32 placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
							{errors.maxGuests && <span className='text-red-500'>Max guests must be min 1 or max 100</span>}
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
								{errors.location?.address && <span className='text-red-500'>Address is required</span>}
								<input
									{...register('location.zip', { required: true })}
									id='zip'
									placeholder='ZIP'
									className='w-1/5 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
								/>
								{errors.location?.zip && <span className='text-red-500'>ZIP is required</span>}
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
							{errors.location?.country && <span className='text-red-500'>Country is required</span>}
							<label htmlFor='continent' className='block text-sm font-medium text-gray-700 mt-4'>
								Continent
							</label>
							<input
								{...register('location.continent', { required: true })}
								id='continent'
								placeholder='Continent'
								className='block w-full placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
							{errors.location?.continent && <span className='text-red-500'>Continent is required</span>}
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
								placeholder='Description'
								className='block w-full placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
							{errors.description && <span className='text-red-500'>Description is required</span>}
							<label htmlFor='images' className='block text-sm font-medium text-gray-700 mt-4'>
								Images (comma separated URLs)
							</label>
							<textarea
								{...register('media', { required: true })}
								id='images'
								placeholder='https://image1.jpg, https://image2.png, ...'
								className='block w-full placeholder-gray-500 mt-1 border border-blue-500 rounded-md p-2 shadow-sm focus:border-blue-700'
							/>
							{errors.media && <span className='text-red-500'>Images are required</span>}
						</div>
					</div>
				)}
				<div className='flex space-x-2 mt-8'>
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
			{showError && <ErrorMessage />}
		</div>
	);
};

export default Create;
