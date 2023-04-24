import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {

    const baseUrl = 'https://api.noroff.dev/api/v1/holidaze';

    const [venues, setVenues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const missingImage = (e) => {
        e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'
    }

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
              <Link to={`/venue/${venue.id}`}>
                <div className="relative h-48 rounded-md overflow-hidden">
                  <img
                    src={venue.media}
                    onError={missingImage}
                    alt={venue.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300">
                    <div className="flex flex-col items-center justify-center h-full text-white">
                      <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
                      <div className="mt-2 flex flex-wrap justify-center items-center">
                        <span className="mr-4 flex items-center">
                          <FaBed className="mr-1" />
                          {venue.maxGuests} Guests
                        </span>
                        <span className="mr-4 flex items-center">
                          <FaDog className="mr-1" />
                          {venue.meta.pets ? "Pets Allowed" : "No Pets Allowed"}
                        </span>
                        <span className="mr-4 flex items-center">
                          <FaWifi className="mr-1" />
                          {venue.meta.wifi ? "Wifi Available" : "No Wifi"}
                        </span>
                        <span className="mr-4 flex items-center">
                          <FaParking className="mr-1" />
                          {venue.meta.parking ? "Parking Available" : "No Parking"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-blue-500 font-semibold">
                    ${venue.price}/night
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
}

export default Home;