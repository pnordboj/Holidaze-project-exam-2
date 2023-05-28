import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { IoMdCamera } from 'react-icons/io';
import axios from 'axios';
import { API_URL_PROFILES, API_URL_BOOKINGS } from '../../common/common';
import { MdFullscreenExit } from 'react-icons/md';
import Modal from 'react-modal';
import EditBooking from '../../components/Booking/EditBooking';
import { VenueCard } from '../../components/Cards/VenueCard';

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
	const [headerText, setHeaderText] = useState('My Profile');

	const userAvatar = profile.avatar;
	const [avatarUrl, setAvatarUrl] = useState(userAvatar);

	const [avatarModalOpen, setAvatarModalOpen] = useState(false);
	const openModal = () => setAvatarModalOpen(true);
	const closeModal = () => setAvatarModalOpen(false);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [bookingId, setBookingId] = useState([]);
	const openDeleteModal = () => {
		setDeleteModalOpen(true);
	};

	const [booking, setBooking] = useState([]);

	const closeDeleteModal = () => setDeleteModalOpen(false);

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
					avatarModalOpen ? closeModal() : openModal();
				}
			})
			.catch((err) => console.log(err));
	};

	const venueUrl = `${url}/venues`;
	const getVenues = () => {
		axios
			.get(venueUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				setHeaderText('My Venues');
				setVenues(res.data);
			})
			.catch((err) => console.log(err));
	};

	const getBookedVenues = () => {
		const bookedVenueUrl = `${url}/bookings?_venue=true`;
		axios
			.get(bookedVenueUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				setHeaderText('My Bookings');
				setBooking(res.data);
				setBookedVenues(res.data.map((booking) => booking.venue));
				setBookingId(res.data.map((booking) => booking.id));
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

	const handleDeleteBooking = (id) => {
		const bookingUrl = `${API_URL_BOOKINGS}/${id}`;
		axios
			.delete(bookingUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				if (res.status === 204) {
					alert('Booking deleted!');
					getBookedVenues();
					closeDeleteModal();
				}
			})
			.catch((err) => {
				const error = err.response.data.errors[0].message;
				console.log(error);
			});
	};

	const updateBooking = (updateBooking) => {
		const bookingUrl = `${API_URL_BOOKINGS}/${bookingId}`;
		axios
			.put(bookingUrl, updateBooking, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					alert('Booking updated!');
					getBookedVenues();
				} else {
					alert('Something went wrong, please try again!');
				}
			})
			.catch((err) => {
				const error = err.response.data.errors[0].message;
				console.log(error);
			});
	};

	const missingImage = (e) => {
		e.target.onerror = null;
		e.target.src = 'https://placehold.co/100x100?text=Avatar';
	};

	return (
		<div className='mb-24'>
			<Helmet>
				<title>Holidaze | {profile.name}</title>
				<meta name='description' content='Manage or delete your bookings, edit your profile picture with ease!' />
			</Helmet>
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
				<h3 className='ml-4 text-2xl font-semibold mb-4'>{headerText}</h3>
				<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
					{profile.venueManager
						? venues.map((venue) => (
								<div key={venue.id}>
									<VenueCard key={venue.id} venue={venue} missingImage={missingImage} />
								</div>
						  ))
						: bookedVenues.map((venue) => (
								<div key={venue.id} className='sm:mx-auto'>
									<VenueCard venue={venue} missingImage={missingImage} />
									<div className='mt-4 flex space-x-4'>
										<button
											className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded h-fit'
											type='button'
											onClick={() => openDeleteModal(bookingId)}
										>
											Delete
										</button>
										<EditBooking
											booking={booking.find((book) => book.venue.id === venue.id)}
											bookingId={bookingId}
											venueId={venue.id}
											updateBooking={updateBooking}
										/>
									</div>
								</div>
						  ))}
				</div>
			</div>
			{avatarModalOpen && (
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
			{deleteModalOpen && (
				<Modal
					isOpen={deleteModalOpen}
					onRequestClose={closeDeleteModal}
					className='w-9/12 h-auto outline-none'
					overlayClassName='fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90'
				>
					<span
						className='cursor-pointer z-40 text-white absolute top-4 right-4 text-6xl rounded-full bg-blue-600 bg-opacity-50 p-2'
						onClick={closeDeleteModal}
					>
						<MdFullscreenExit />
					</span>
					<div className='flex flex-col justify-center items-center'>
						<h1 className='text-3xl font-bold my-4'>Are you sure you want to delete this booking?</h1>
						<div className='space-x-6'>
							<button
								type='button'
								onClick={closeDeleteModal}
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-l rounded'
							>
								Cancel
							</button>
							<button
								type='button'
								onClick={() => handleDeleteBooking(bookingId)}
								className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 text-l rounded'
							>
								Delete
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

Profile.propTypes = {
	setNewAvatar: PropTypes.func.isRequired,
};

export default Profile;
