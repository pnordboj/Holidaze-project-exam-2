import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';

const Nav = () => {
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    checkLogin();
  }, [accessToken]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const checkLogin = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      setUsername(localStorage.getItem('name'));
    } else {
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('avatar');
    setIsLoggedIn(false);
  };

  const name = localStorage.getItem('name');

  useEffect(() => {
    checkLogin();
  }, []);

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
            <div className='flex flex-col items-center'>
              <Link to={`/profile/${name}`} className='text-white hover:text-blue-300 '>
                <FaUserCircle size={24} />
              </Link>
              <Link to={`/profile/${name}`} className='text-white hover:text-blue-300 '>
                <span className='text-white font-semibold'>{username}</span>
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

const Header = () => {
  return (
    <header className='bg-blue-500 p-4'>
      <Nav />
    </header>
  );
};

export default Header;
