import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './Home.module.css';
import { FaWifi, FaParking, FaDog, FaBed, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {

    const baseUrl = 'https://api.noroff.dev/api/v1/holidaze';

    const [venues, setVenues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseUrl}/venues`)
            .then((res) => res.json())
            .then((json) => {
                setVenues(json);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold my-4">Venues</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white shadow-md rounded-md p-4 cursor-pointer hover:bg-blue-100"
              >
                <div className="relative h-48 rounded-md overflow-hidden">
                  <img
                    src={venue.media}
                    alt={venue.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300">
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
                      <p className="text-sm">{venue.location}</p>
                      <div className="mt-2 flex items-center">
                        <span className="mr-2">
                          <FaBed />
                          <span className="ml-1">{venue.maxGuests} Guests</span>
                        </span>
                        <span className="mr-2">
                          <FaDog />
                          <span className="ml-1">{venue.meta.pets ? "Pets Allowed" : "No Pets Allowed"}</span>
                        </span>
                        <span className="mr-2">
                          <FaWifi />
                          <span className="ml-1">{venue.meta.wifi ? "Wifi Available" : "No Wifi"}</span>
                        </span>
                        <span className="mr-2">
                          <FaParking />
                          <span className="ml-1">{venue.meta.parking ? "Parking Available" : "No Parking"}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-500">
                    <FaMapMarkerAlt />
                    <span className="ml-1">{venue.location}</span>
                  </span>
                  <span className="text-blue-500 font-semibold">
                    ${venue.price}/night
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default Home;