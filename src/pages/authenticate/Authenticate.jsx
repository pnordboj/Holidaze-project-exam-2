import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { redirect } from 'react-router-dom';
import Countdown from 'react-countdown';
import { API_URL_AUTH } from '../../common/common';

function Authenticate() {
  const [registerActive, setRegisterActive] = useState(false);
  const [registerd, setRegisterd] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginActive, setLoginActive] = useState(true);
  const [showError, setShowError] = useState(false);

  const [avatar, setAvatar] = useState('https://placehold.co/100x100?text=Avatar');
  const [venueManager, setVenueManager] = useState(false);

  const handleVenueManager = (e) => {
    console.log(e.target.value);
    setVenueManager(e.target.value);
  };

  const renderer = ({ seconds, completed }) => {
    if (loggedIn) {
      if (completed) {
        return <p>Redirecting...</p> && redirect('/');
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
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    if (registerActive) {
      fetch(`${API_URL_AUTH}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: JSON.stringify(data.name),
          email: JSON.stringify(data.email),
          password: JSON.stringify(data.password),
          avatar: avatar,
          venueManager: venueManager,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.id) {
            setRegisterd(true);
          }
        })
        .catch((error) => {
          setRegisterd(false);
          console.log('Error:', error);
        });
    } else {
      fetch(`${API_URL_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })
        .then((response) => {
          console.log(response);
          if (response.status === 401) {
            setShowError(true);
            setLoggedIn(false);
            return;
          } else if (response.status === 403) {
            setShowError(true);
            setLoggedIn(false);
            return;
          }
        })
        .then((data) => {
          if (data.accessToken) {
            setLoggedIn(true);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('name', JSON.stringify(data.name).replace(/['"]+/g, ''));
            localStorage.setItem('email', JSON.stringify(data.email).replace(/['"]+/g, ''));
            localStorage.setItem('avatar', JSON.stringify(data.avatar).replace(/['"]+/g, ''));
            localStorage.setItem('venueManager', data.venueManager);

            alert('You are now logged in!');
            redirect('/');
          }
        })
        .catch((error) => {
          console.log('Error:', error);
          setLoggedIn(false);
        });
    }
  }

  function handleAvatar(e) {
    setAvatar(e.target.value);
    if (e.target.value === '') {
      setAvatar('https://placehold.co/100x100?text=Avatar');
    }
  }

  const emailValidation = {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@stud\.noroff\.no$/i,
  };

  return (
    <div className='container mx-auto'>
      <h1 className='text-3xl font-bold my-4'>Authenticate</h1>
      <div className='flex justify-center items-center'>
        <div className='w-1/2'>
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
                    {...register('email', emailValidation)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    id='email'
                    placeholder='Email'
                    type='email'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs italic'>Please enter a valid @stud.noroff.no email address.</p>
                  )}
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                    Password
                  </label>
                  <input
                    {...register('password', { required: true, minLength: 4 })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    id='password'
                    type='password'
                    placeholder='******************'
                  />
                  {errors.password && (
                    <p className='text-red-500 text-xs italic'>Password must be at least 4 characters.</p>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    type='submit'
                    id='login'
                  >
                    Login
                  </button>
                </div>
              </form>
            )}
            {loggedIn && <Countdown date={Date.now() + 5000} renderer={renderer} />}
            {showError && <p className='text-red-500 text-xs italic'>Wrong email or password!</p>}
            {registerActive && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                    Name
                  </label>
                  <input
                    {...register('name', { required: true, minLength: 4 })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    id='name'
                    placeholder='Name'
                    type='text'
                  />
                  {errors.username && (
                    <p className='text-red-500 text-xs italic'>Username must be at least 4 characters.</p>
                  )}
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                    Email
                  </label>
                  <input
                    {...register('email', emailValidation)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    id='email'
                    placeholder='Email'
                    type='email'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs italic'>Please enter a valid @stud.noroff.no email address.</p>
                  )}
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                    Password
                  </label>
                  <input
                    {...register('password', { required: true, minLength: 4 })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    id='password'
                    type='password'
                    placeholder='******************'
                  />
                  {errors.password && (
                    <p className='text-red-500 text-xs italic'>Password must be at least 4 characters.</p>
                  )}
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
                    {avatar && <img src={avatar} alt='Preview' className='block w-full rounded-md my-4' />}
                  </div>
                </div>
                <div className='mb-4 mt-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2'>Are you a venue manager?</label>
                  <select
                    className='bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-500 block p-2.5'
                    onChange={handleVenueManager}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className='flex items-center justify-between'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    type='submit'
                    id='register'
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                      Email
                    </label>
                    <input
                      {...register('email', emailValidation)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      id='email'
                      placeholder='Email'
                      type='email'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-xs italic'>Please enter a valid @stud.noroff.no email address.</p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                      Password
                    </label>
                    <input
                      {...register('password', {
                        required: true,
                        minLength: 4,
                      })}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                      id='password'
                      type='password'
                      placeholder='******************'
                    />
                    {errors.password && (
                      <p className='text-red-500 text-xs italic'>Password must be at least 4 characters.</p>
                    )}
                  </div>
                  <div className='flex items-center justify-between'>
                    <button
                      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                      type='submit'
                      id='login'
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authenticate;
