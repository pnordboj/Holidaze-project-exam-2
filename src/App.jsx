import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';

// Pages
import Home from './pages/home/Home';
import Authenticate from './pages/authenticate/Authenticate';
import Manage from './pages/manage/Manage';
import Profile from './pages/profile/Profile';
import Venue from './pages/venue/Venue';
import CreateVenue from './pages/createvenue/CreateVenue';
import NotFound from './pages/notfound/NotFound';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// eslint-disable-next-line react/prop-types
function Layout({ isLoggedIn, setIsLoggedIn, newAvatar }) {
  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} newAvatar={newAvatar} />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }),
    [];

  const [newAvatar, setNewAvatar] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setNewAvatar(localStorage.getItem('avatar'));
      if (!newAvatar) {
        setNewAvatar('https://placehold.co/100x100?text=Avatar');
      }
    }
  });

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} newAvatar={newAvatar} />}
        >
          <Route index element={<Home />} />
          <Route path='login' element={<Authenticate setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='manage/:id' element={<Manage />} />
          <Route path='profile/:id' element={<Profile setNewAvatar={setNewAvatar} />} />
          <Route path='venue/:id' element={<Venue />} />
          <Route path='create-venue' element={<CreateVenue />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
