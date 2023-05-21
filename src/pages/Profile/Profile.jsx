import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaBed, FaDog, FaWifi, FaParking } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import axios from 'axios';
import { API_URL_PROFILES } from '../../common/common';

// eslint-disable-next-line react/prop-types
const Profile = ({ setNewAvatar }) => {
  const params = useParams();
  const url = `${API_URL_PROFILES}/${params.id}`;
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    venueManager: false,
  });

  const [venues, setVenues] = useState([]);
  const [bookedVenues, setBookedVenues] = useState([]);

  const userAvatar = profile.avatar;
  const [avatarUrl, setAvatarUrl] = useState(userAvatar);

  const handleAvatar = (e) => {
    e.preventDefault();
    const newAvatarUrl = e.target.elements[0].value;
    setAvatarUrl(newAvatarUrl);
    setNewAvatar(newAvatarUrl);

    const newProfile = { ...profile, avatar: newAvatarUrl };
    setProfile(newProfile);

    axios
      .put(url + '/media', newProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          modalOpen ? closeModal() : openModal();
        }
      })
      .catch((err) => console.log(err));
  };

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const venueUrl = `${url}/venues`;
  const getVenues = () => {
    axios
      .get(venueUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setVenues(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getBookedVenues = () => {
    const bookedVenueUrl = `${url}/booked-venues`;
    axios
      .get(bookedVenueUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBookedVenues(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        if (!response.data.venueManager) {
          getBookedVenues();
        } else {
          getVenues(response.data.name);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, [url, token]);

  const missingImage = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/150';
  };

  return (
    <div>
      <div className='bg-blue-500 p-4 relative'>
        <div
          className='group cursor-pointer rounded-full h-32 w-32 mx-auto border-4 border-blue-300 shadow-lg mb-4 overflow-hidden'
          onClick={openModal}
        >
          <div className='relative h-full w-full'>
            <img
              src={profile.avatar ? profile.avatar : 'https://placehold.co/100x100?text=Avatar'}
              alt={profile.name}
              className='object-cover w-full h-full transition duration-200 ease-in-out transform group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition duration-200 ease-in-out'>
              <IoMdCamera className='text-white text-lg opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out' />
            </div>
          </div>
        </div>
        <h2 className='text-white text-2xl font-bold text-center'>{profile.name}</h2>
        <p className='text-white text-center'>{profile.email}</p>
        <p className='text-white text-center'>{profile.venueManager ? 'Venue Manager' : 'Customer'}</p>
      </div>
      <div className='container mx-auto my-6'>
        <h3 className='ml-4 text-2xl font-semibold mb-4'>Listings</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {profile.venueManager
            ? venues.map((venue) => (
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
              ))
            : bookedVenues.map((venue) => (
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
      </div>
      {modalOpen && (
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
              <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>
            <div
              className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
              role='dialog'
              aria-modal='true'
              aria-labelledby='modal-headline'
            >
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-headline'>
                  Change Avatar
                </h3>
                <form onSubmit={handleAvatar}>
                  <input
                    type='text'
                    defaultValue={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder='New avatar URL'
                    className='mt-2 form-input block w-full'
                  />
                  <div className='mt-4 grid grid-cols-2 gap-4'>
                    <div>
                      <h4 className='mb-2'>Profile Page Preview:</h4>
                      <img
                        src={avatarUrl || 'https://placehold.co/100x100?text=Avatar'}
                        alt='Profile Page Preview'
                        className='h-24 w-24 rounded-full border-4 border-blue-300 shadow-lg'
                      />
                    </div>
                    <div>
                      <h4 className='mb-2'>Navbar Preview:</h4>
                      <img
                        src={avatarUrl || 'https://placehold.co/100x100?text=Avatar'}
                        alt='Navbar Preview'
                        className='h-12 w-12 rounded-full border-2 border-blue-300 shadow-lg'
                      />
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6'>
                    <button
                      type='submit'
                      className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
