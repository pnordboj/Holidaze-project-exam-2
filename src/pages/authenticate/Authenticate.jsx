import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Countdown from 'react-countdown';
import { API_URL_AUTH } from '../../common/common';

function Authenticate({ setIsLoggedIn }) {
	const [registerActive, setRegisterActive] = useState(false);
	const [registerd, setRegisterd] = useState(false);
	const [login, setLogin] = useState(false);
	const [loginActive, setLoginActive] = useState(true);
	const [showError, setShowError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [avatar, setAvatar] = useState('https://placehold.co/100x100?text=Avatar');
	const [isCompleted, setIsCompleted] = useState(false);

	useEffect(() => {
		if (login !== null) {
			setIsLoggedIn(login);
		}
	}, [login, setIsLoggedIn]);

	useEffect(() => {
		if (isCompleted) {
			window.location.href = '/';
		}
	}, [isCompleted]);

	const renderer = ({ seconds, completed }) => {
		if (login) {
			if (completed) {
				setIsCompleted(true);
				return <p>Redirecting...</p>;
			} else {
				return (
					<div className='flex-1 flex-col justify-center text-center justify-items-center'>
						<div className='py-2 rounded-tl-md rounded-bl-md'>
							<p className='text-green-500 text-lg block italic'>Logged in successfully!</p>
							<p className='block text-gray-700 text-sm font-bold mb-2'>Redirecting you to home page in:</p>
						</div>
						<div className='bg-blue-500 p-2 border shadow font-bold text-white rounded-md w-16 m-auto mb-4'>
							<p className='text-xl'>{seconds}</p>
							<p>sec</p>
						</div>
					</div>
				);
			}
		}
		return null;
	};

	const emailValidation = yup
		.string()
		.required('Email is required')
		.matches(/^[A-Z0-9._%+-]+@(noroff\.no|stud\.noroff\.no)$/i, 'Email must be a valid noroff email address');

	const schema = yup.object().shape({
		name: yup.string().min(3).required('Name is required'),
		email: emailValidation,
		password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
		avatar: yup.string().required('Avatar is required'),
		venueManager: yup.boolean().required('Venue Manager is required'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const [body, setBody] = useState({
		name: '',
		email: '',
		password: '',
		avatar: '',
		venueManager: false,
	});

	const handleAvatar = (e) => {
		const value = e.target.value;
		setAvatar(value);
		setBody({
			...body,
			avatar: value,
		});
		if (value === '') {
			setAvatar('https://placehold.co/100x100?text=Avatar');
		}
	};

	const handleChange = (e) => {
		let value = e.target.value;
		if (e.target.name === 'venueManager') {
			value = value === 'true' ? true : false;
		}
		setBody({
			...body,
			[e.target.name]: value,
		});
	};

	const onSubmit = () => {
		if (registerActive) {
			axios
				.post(`${API_URL_AUTH}/register`, body)
				.then((response) => {
					if (response.status === 201) {
						setRegisterd(true);
						setLoginActive(true);
						setRegisterActive(false);
						setShowError(false);
						return;
					}
				})
				.catch((e) => {
					const err = e.response.data.errors[0].message;
					setErrorMsg(err);
					setShowError(true);
					setRegisterd(false);
				});
		} else {
			axios
				.post(`${API_URL_AUTH}/login`, body)
				.then((response) => {
					if (response.status === 401) {
						setShowError(true);
						setLogin(false);
						return;
					} else if (response.status === 403) {
						setShowError(true);
						setLogin(false);
						return;
					} else if (response.status === 200) {
						setShowError(false);
						localStorage.setItem('token', response.data.accessToken);
						localStorage.setItem('name', response.data.name);
						localStorage.setItem('email', response.data.email);
						localStorage.setItem('avatar', response.data.avatar);
						localStorage.setItem('venueManager', response.data.venueManager);
						setLogin(true);
						return;
					}
				})
				.catch((e) => {
					const err = e.response.data.errors[0].message;
					setErrorMsg(err);
					setShowError(true);
					setLogin(false);
				});
		}
	};

	return (
		<div className='container mx-auto mb-24'>
			<Helmet>
				<title>Login</title>
				<meta name='description' content='Login or register to Holidaze to book or create a venue!' />
			</Helmet>
			<h1 className='text-center text-3xl font-bold my-4'>Login or register</h1>
			<div className='flex justify-center items-center my-8'>
				<div className='w-10/12 md:w-6/12'>
					<div className='flex justify-center items-center'>
						<button
							className={`w-1/2 py-2 rounded-tl-md rounded-bl-md ${
								loginActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
							}`}
							onClick={() => {
								setLoginActive(true);
								setRegisterActive(false);
							}}
						>
							Login
						</button>
						<button
							className={`w-1/2 py-2 rounded-tr-md rounded-br-md ${
								registerActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
							}`}
							onClick={() => {
								setShowError(false);
								setLoginActive(false);
								setRegisterActive(true);
							}}
						>
							Register
						</button>
					</div>
					<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
						{loginActive && (
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
										Email
									</label>
									<input
										{...register('email')}
										className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
											errors.email ? 'border-red-500' : ''
										}`}
										id='email'
										placeholder='Email'
										onChange={(e) => handleChange(e)}
									/>
									{errors.email && <span className='text-red-500 text-xs italic'>{errors.email.message}</span>}
								</div>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
										Password
									</label>
									<input
										{...register('password')}
										className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
											errors.password ? 'border-red-500' : ''
										}`}
										placeholder='******************'
										id='password'
										type='password'
										onChange={(e) => handleChange(e)}
									/>
									{errors.password && <span className='text-red-500 text-xs italic'>{errors.password.message}</span>}
								</div>
								<div className='flex items-center justify-between'>
									<button
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
										type='submit'
										id='login'
										onClick={() => onSubmit()}
									>
										Login
									</button>
								</div>
							</form>
						)}
						{login && <Countdown date={Date.now() + 5000} renderer={renderer} />}
						{showError && (
							<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>
								<strong className='font-bold'>Error!</strong>
								<span className='block sm:inline'> {errorMsg}</span>
								<span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
									<svg
										className='fill-current h-6 w-6 text-red-500'
										role='button'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'
										onClick={() => setShowError(false)}
									>
										<title>Close</title>
										<path
											fillRule='evenodd'
											d='M14.348 5.652a.5.5 0 010 .707L9.707 10l4.641 4.641a.5.5 0 11-.707.707L9 10.707l-4.641 4.64a.5.5 0 11-.707-.707L8.293 10 3.652 5.359a.5.5 0 01.707-.707L9 9.293l4.641-4.64a.5.5 0 01.707 0z'
											clipRule='evenodd'
										/>
									</svg>
								</span>
							</div>
						)}
						{registerActive && (
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
										Name
									</label>
									<input
										{...register('name')}
										className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
											errors.name ? 'border-red-500' : ''
										}`}
										id='name'
										placeholder='Name'
										type='text'
										onChange={(e) => handleChange(e)}
									/>
									{errors.name && <span className='text-red-500 text-xs italic'>{errors.name.message}</span>}
								</div>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
										Email
									</label>
									<input
										{...register('email')}
										className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
											errors.email ? 'border-red-500' : ''
										}`}
										id='email'
										placeholder='Email'
										type='email'
										onChange={(e) => handleChange(e)}
									/>
									{errors.email && <span className='text-red-500 text-xs italic'>{errors.email.message}</span>}
								</div>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
										Password
									</label>
									<input
										{...register('password')}
										className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
											errors.password ? 'border-red-500' : ''
										}`}
										id='password'
										type='password'
										placeholder='******************'
										onChange={(e) => handleChange(e)}
									/>
									{errors.password && <span className='text-red-500 text-xs italic'>{errors.password.message}</span>}
								</div>
								<div className='mb-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='avatar'>
										Image URL:
									</label>
									<input
										type='text'
										id='avatar'
										placeholder='Image URL'
										name='Image URL'
										onChange={handleAvatar}
										className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									/>
									<div className='w-1/2'>
										{avatar && <img src={avatar} alt='image preview' className='block w-full rounded-md my-4' />}
									</div>
								</div>
								<div className='mb-4 mt-4'>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Are you a venue manager?</label>
									<select
										name='venueManager'
										className='bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-500 block p-2.5'
										value={body.venueManager}
										onChange={(e) => handleChange(e)}
									>
										<option value='false'>No</option>
										<option value='true'>Yes</option>
									</select>
								</div>
								<div className='flex items-center justify-between'>
									<button
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
										type='submit'
										id='register'
										onClick={() => onSubmit()}
									>
										Register
									</button>
								</div>
							</form>
						)}
						{registerd && (
							<div>
								<p className='text-green-500 text-l block italic'>
									You have been registered successfully. Please login.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

Authenticate.propTypes = {
	setIsLoggedIn: PropTypes.func.isRequired,
};

export default Authenticate;
