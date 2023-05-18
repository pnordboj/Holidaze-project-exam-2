import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed } from 'react-icons/fa';
import { API_URL } from '../../common/common';
import { BounceLoader } from 'react-spinners';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetch(`${API_URL}/venues`)
      .then((res) => res.json())
      .then((json) => {
        setVenues(json);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  }, []);

  useEffect(() => {
    if (showCalendar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCalendar]);

  const missingImage = (e) => {
    e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <BounceLoader color='#1D4ED8' size={100} />
      </div>
    );
  }

  return (
    <div className='container mx-auto w-11/12'>
      {showCalendar && (
        <div className='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90'>
          <div className='bg-white rounded-md shadow-md p-4'>
            <Calendar onChange={setDate} value={date} />
            <button
              className='px-4 py-4 rounded-md text-white text-lg font-bold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
              onClick={() => setShowCalendar(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h1 className='text-3xl font-bold my-4'>Venues</h1>
      <div className='flex flex-row space-x-12 mb-6'>
        <button
          className='px-6 py-4 rounded-md text-white text-lg font-bold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
          onClick={() => setShowCalendar(true)}
        >
          Select Date
        </button>
        <Link
          to='/create-venue'
          className='px-6 py-4 rounded-md text-white text-lg font-bold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
        >
          Create Venue
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {venues.map((venue) => (
          <div key={venue.id} className='bg-white shadow-md rounded-md p-4 cursor-pointer hover:bg-blue-100'>
            <Link to={`/venue/${venue.id}`}>
              <div className='relative h-48 rounded-md overflow-hidden'>
                <img
                  src={venue.media}
                  onError={missingImage}
                  alt={venue.name}
                  className='absolute inset-0 w-full h-full object-cover rounded-md'
                />
                <div className='absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300'>
                  <div className='flex flex-col items-center justify-center h-full text-white'>
                    <h2 className='text-xl font-semibold mb-2'>{venue.name}</h2>
                    <div className='mt-2 flex flex-wrap justify-center items-center'>
                      <span className='mr-4 flex items-center'>
                        <FaBed className='mr-1' />
                        {venue.maxGuests} Guests
                      </span>
                      <span className='mr-4 flex items-center'>
                        <FaDog className='mr-1' />
                        {venue.meta.pets ? 'Pets Allowed' : 'No Pets Allowed'}
                      </span>
                      <span className='mr-4 flex items-center'>
                        <FaWifi className='mr-1' />
                        {venue.meta.wifi ? 'Wifi Available' : 'No Wifi'}
                      </span>
                      <span className='mr-4 flex items-center'>
                        <FaParking className='mr-1' />
                        {venue.meta.parking ? 'Parking Available' : 'No Parking'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <span className='text-blue-500 font-semibold'>${venue.price}/night</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <button
        onClick={handleClick}
        className='fixed bottom-20 right-10 px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
      >
        Back to top
      </button>
    </div>
  );
};

export default Home;
