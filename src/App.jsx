import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Link, Routes, Outlet } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

// Pages
import Home from './pages/home/Home';
import Authenticate from './pages/authenticate/Authenticate';
import Manage from './pages/manage/Manage';
import Profile from './pages/profile/Profile';
import Venue from './pages/venue/Venue';
import NotFound from './pages/notfound/NotFound';

function Nav() {

  const accessToken = localStorage.getItem('accessToken');
  // If the local storage changes, update the state
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
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {isLoggedIn ? (
          <div className="flex space-x-6">
            <Link
              exact
              to="/"
              className="text-white font-semibold hover:text-blue-300"
              activeClassName="text-blue-300"
            >
              Home
            </Link>
            <Link
              to="/manage"
              className="text-white font-semibold hover:text-blue-300"
              activeClassName="text-blue-300"
            >
              Manage your venue(s)
            </Link>
          </div>
        ) : (
          <div className="flex space-x-6">
            <Link
              exact
              to="/"
              className="text-white font-semibold hover:text-blue-300"
              activeClassName="text-blue-300"
            >
              Home
            </Link>
          </div>
        )}
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <Link to="/profile/:id" className="text-white hover:text-blue-300">
              <span className="text-white font-semibold">{username}</span>
            </Link>
            <Link to="/profile/:id" className="text-white hover:text-blue-300">
              <FaUserCircle size={24} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login" className="text-white font-semibold hover:text-blue-300">
              <span className="text-white font-semibold">Login/Register</span>
            </Link>
            <Link
              to="/login"
              className="text-white font-semibold hover:text-blue-300"
            >
              <FaUserCircle size={24} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function Header() {
  return (
    <header className="bg-blue-500 p-4">
      <Nav />
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-blue-500 p-4 fixed bottom-0 w-full">
      <div className="container mx-auto text-center text-white">
        <p>© 2023 - All Rights Reserved</p>
      </div>
    </footer>
  )
}

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Authenticate />} />
          <Route path="manage/:id" element={<Manage />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="venue/:id" element={<Venue />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
