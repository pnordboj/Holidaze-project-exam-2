import './App.css';
import React from 'react';
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

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Authenticate />} />
          <Route path='manage/:id' element={<Manage />} />
          <Route path='profile/:id' element={<Profile />} />
          <Route path='venue/:id' element={<Venue />} />
          <Route path='create-venue' element={<CreateVenue />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
