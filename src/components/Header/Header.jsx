/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
// _____________________________________________//

const Nav = ({ isLoggedIn, setIsLoggedIn, newAvatar }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setName(localStorage.getItem('name'));
      setAvatar(localStorage.getItem('avatar'));
      if (!avatar) {
        setAvatar('https://placehold.co/100x100?text=Avatar');
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (newAvatar) {
      setAvatar(newAvatar);
      localStorage.setItem('avatar', newAvatar);
    }
  }),
    [newAvatar];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('avatar');
    setIsLoggedIn(false);
  };

  return (
    <nav className='bg-blue-500 p-1'>
      <div className='container mx-auto flex justify-between items-center'>
        {isLoggedIn ? (
          <div className='flex space-x-6'>
            <Link exact to='/' className='text-white font-semibold hover:text-blue-300' activeClassName='text-blue-300'>
              Home
            </Link>
            <Link to='/manage' className='text-white font-semibold hover:text-blue-300' activeClassName='text-blue-300'>
              Manage your venue(s)
            </Link>
          </div>
        ) : (
          <div className='flex space-x-6'>
            <Link exact to='/' className='text-white font-semibold hover:text-blue-300' activeClassName='text-blue-300'>
              Home
            </Link>
          </div>
        )}
        {isLoggedIn ? (
          <div className='flex items-center space-x-2'>
            <div className='flex items-center'>
              <img src={avatar} alt={name} className='h-12 w-12 rounded-full' />
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
