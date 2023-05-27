import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import Slogan from './Holidaze-transparent-slogan.png';
//import LogoSlogan from './Holidaze-transparent-slogan-logo.png';

const Nav = ({ isLoggedIn, setIsLoggedIn, newAvatar }) => {
	const [name, setName] = useState('');
	const [avatar, setAvatar] = useState('');

	useEffect(() => {
		if (isLoggedIn) {
			setName(localStorage.getItem('name'));
			const avatarStorage = localStorage.getItem('avatar');
			if (avatarStorage) {
				setAvatar(avatarStorage);
			} else {
				setAvatar('https://placehold.co/100x100?text=No+Avatar');
			}
		}
	}, [isLoggedIn]);

	useEffect(() => {
		if (newAvatar) {
			setAvatar(newAvatar);
			localStorage.setItem('avatar', newAvatar);
		}
	}, [newAvatar]);

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		localStorage.removeItem('avatar');
		setIsLoggedIn(false);
		window.location.href = '/';
	};

	const handleAvatarError = (e) => {
		e.target.onerror = null;
		e.target.src = 'https://placehold.co/100x100?text=No+Avatar';
	};
	return (
		<nav className='bg-blue-500 p-1'>
			<div className='container mx-auto flex justify-between items-center space-x-4'>
				<div className='flex space-x-6'>
					<Link
						exact
						to='/'
						className='text-white text-xl font-semibold hover:text-blue-300'
						activeClassName='text-blue-300'
					>
						Home
					</Link>
				</div>
				<div className='flex flex-center '>
					<img src={Slogan} alt='Holidaze Slogan' className='w-11/12 mx-auto' />
				</div>
				{isLoggedIn ? (
					<div className='flex flex-center space-x-2'>
						<div className='flex items-center'>
							<Link to={`/profile/${name}`} className='text-white hover:text-blue-300 ml-2'>
								<img
									src={avatar}
									alt={name}
									onError={handleAvatarError}
									className='h-12 w-12 rounded-full invisible sm:visible'
								/>
							</Link>
							<Link to={`/profile/${name}`} className='text-white hover:text-blue-300 ml-2'>
								<span className='text-white font-semibold'>{name}</span>
							</Link>
						</div>
						<button onClick={logout} className='text-white hover:text-blue-300'>
							<IoMdLogOut size={24} />
						</button>
					</div>
				) : (
					<div className='flex items-center space-x-2'>
						<Link to='/login' className='text-white font-semibold hover:text-blue-300'>
							<span className='text-white font-semibold'>Login/Register</span>
						</Link>
						<Link to='/login' className='text-white font-semibold hover:text-blue-300'>
							<FaUserCircle size={24} />
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

const Header = ({ isLoggedIn, setIsLoggedIn, newAvatar }) => {
	return (
		<header className='bg-blue-500 p-4'>
			<Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} newAvatar={newAvatar} />
		</header>
	);
};

export default Header;

Nav.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	setIsLoggedIn: PropTypes.func.isRequired,
	newAvatar: PropTypes.string.isRequired,
};

Header.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	setIsLoggedIn: PropTypes.func.isRequired,
	newAvatar: PropTypes.string.isRequired,
};
