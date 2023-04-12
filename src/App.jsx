import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Link, Routes, Outlet } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Manage from './pages/Manage';
import Profile from './pages/Profile';
import Venue from './pages/Venue';
import NotFound from './pages/NotFound';

function Header() {

}

function Footer() {

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
          <Route path="login" element={<Login />} />
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
