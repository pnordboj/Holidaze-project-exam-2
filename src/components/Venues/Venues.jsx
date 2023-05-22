/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import { MdFoodBank, MdFullscreenExit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Modal from 'react-modal';
import { API_URL_VENUES } from '../../common/common';
import { Maps } from '../../components/Maps/Maps';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Loader } from '../Loader/Loader';

export const Venues = ({ venueId }) => {
  const [venue, setVenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  const location = {
    lat: '',
    lng: '',
  };

  const missingImage = (e) => {
    e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
  };

  let id = venueId;

  if (id === undefined) {
    useEffect(() => {
      axios
        .get(`${API_URL_VENUES}`)
        .then((res) => {
          setVenue(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  } else {
    useEffect(() => {
      axios
        .get(`${API_URL_VENUES}/${id}?_owner=true`)
        .then((res) => {
          setVenue(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }),
      [id];
  }

  const Map = () => {
    if (location.lat && location.lng !== 0) {
      return <div className='w-full h-96'>No map available</div>;
    } else {
      return <Maps lat={location.lat} lng={location.lng} />;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      width: '80%',
      height: '80%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '10px',
      padding: '0',
    },
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDateChange = (date) => {
    setDate(date);
    setShowCalendar(false);
  };

  const handleCalendar = () => {
    setShowCalendar(true);
  };

  const handleCalendarClose = () => {
    setShowCalendar(false);
  };

  const handleBooking = () => {
    setShowCalendar(false);
    setIsOpen(false);

    const booking = {
      venueId: venue._id,
      date: date,
    };

    axios
      .post(`${API_URL_VENUES}/bookings`, booking)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isLoading) {
    return <Loader />;
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
      {venue.map((venue) => (
        <div key={venue._id}>
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2'>
              <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                className='w-9/12 h-auto outline-none'
                overlayClassName='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90'
              >
                <span
                  className='cursor-pointer right-1 z-40 text-white absolute text-4xl'
                  onClick={() => setIsOpen(false)}
                >
                  <MdFullscreenExit />
                </span>
                {venue.media.length > 1 ? (
                  <Slider {...settings}>
                    {venue.media.map((image, index) => (
                      <img key={index} src={image} alt={venue.name} className='object-contain w-full h-full' />
                    ))}
                  </Slider>
                ) : (
                  <img src={venue.media} alt={venue.name} className='object-contain w-full h-full' />
                )}
              </Modal>
            </div>
            <div className='mt-4 flex items-center justify-between'>
              <span className='text-blue-500 font-semibold'>${venue.price}/night</span>
              {isLoggedIn ? (
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                  Book Now
                </button>
              ) : (
                <Link to='/login' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                  Login to Book
                </Link>
              )}
            </div>
            <div className='mt-4 flex items-center'>
              <span className='mr-2'>
                <FaBed />
                <span className='ml-1'>{venue.maxGuests} Guests</span>
              </span>
              <span className='mr-2'>
                <FaDog />
                <span className='ml-1'>{venue.meta.pets ? 'Pets Allowed' : 'No Pets Allowed'}</span>
              </span>
              <span className='mr-2'>
                <FaWifi />
                <span className='ml-1'>{venue.meta.wifi ? 'Wifi Available' : 'No Wifi'}</span>
              </span>
              <span className='mr-2'>
                <FaParking />
                <span className='ml-1'>{venue.meta.parking ? 'Parking Available' : 'No Parking'}</span>
              </span>
              <span className='mr-2'>
                <MdFoodBank />
                <span className='ml-1'>{venue.meta.breakfast ? 'Breakfast Included' : 'No Breakfast'}</span>
              </span>
            </div>
            <div className='mt-4'>
              <div className='font-bold text-gray-500 mb-2'>Description:</div>
              <p>{venue.description}</p>
            </div>
            <div className='mt-4'>
              <div className='font-bold text-gray-500 mb-2'>Location:</div>
              <div className='flex items-center'>
                <FaMapMarkerAlt className='mr-2' />
                <span className='ml-1'>{venue.location.address}</span>
              </div>

              <Map />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
*/
