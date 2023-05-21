/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { API_URL_VENUES } from '../../common/common';
//import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  };

  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({ defaultValues: venueValues });

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
      <div onClick={handleIconClick} className='flex items-center space-x-1 cursor-pointer'>
        <Icon size={24} />
        {metaState[name] && <FaCheck className='text-green-500' />}
      </div>
    );
  };
  const onSubmit = (data) => {
    data = { ...data, meta };
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
        .catch((err) => console.log(err));
    }
  };

  const handleNext = (event) => {
    event.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleBack = (event) => {
    event.preventDefault();
    setStep((prev) => prev - 1);
  };

  return (
    <div className='container mx-auto'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Venue details */}
        {step === 1 && (
          <div className='w-8/12 m-auto m-0 items-center'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>Venue Details</h3>
            <div className='mt-4'>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Venue name
              </label>
              <input
                {...register('name', { required: true })}
                id='name'
                placeholder='Venue name'
                className='block w-full placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
              />
              <label htmlFor='price' className='block text-sm font-medium text-gray-700 mt-4'>
                Price
              </label>
              <input
                {...register('price', { required: true })}
                id='price'
                placeholder='Price'
                className='block w-full placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
              />
              <label htmlFor='address' className='block text-sm font-medium text-gray-700 mt-4'>
                Address
              </label>
              <input
                {...register('address', { required: true })}
                id='address'
                placeholder='Address'
                className='block w-full placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
              />
            </div>
          </div>
        )}

        {/* Meta tags */}
        {step === 2 && (
          <div>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>Select included amenities</h3>
            <div className='flex space-x-4 mt-4'>
              <MetaIcons name='wifi' icon={FaWifi} metaState={meta} setMetaState={setMeta} />
              <MetaIcons name='parking' icon={FaParking} metaState={meta} setMetaState={setMeta} />
              <MetaIcons name='pets' icon={FaDog} metaState={meta} setMetaState={setMeta} />
              <MetaIcons name='breakfast' icon={FaBed} metaState={meta} setMetaState={setMeta} />
            </div>
          </div>
        )}

        {/* Description and Images */}
        {step === 3 && (
          <div>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>Description and Images</h3>
            <div className='mt-4'>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                Description
              </label>
              <textarea
                {...register('description', { required: true })}
                id='description'
                placeholder='Description'
                className='block w-full placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
              />
              <label htmlFor='images' className='block text-sm font-medium text-gray-700 mt-4'>
                Images (comma separated URLs)
              </label>
              <textarea
                {...register('media', { required: true })}
                id='images'
                placeholder='https://image1.jpg, https://image2.png, ...'
                className='block w-full placeholder-gray-500 mt-1 border rounded-md p-2 shadow-sm focus:border-blue-500'
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className='flex justify-between mt-8'>
          {step > 1 && (
            <button
              onClick={handleBack}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Next
            </button>
          ) : (
            <input
              type='submit'
              value='Create'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default Create;
