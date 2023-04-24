import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaDog, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import { MdFoodBank, MdFullscreenExit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Modal from 'react-modal';

function Venue() {

    const [isOpen, setIsOpen] = useState(false);

    let params = useParams();
    let url = `https://api.noroff.dev/api/v1/holidaze/venues/${params.id}?_owner=true`;

    const [venue, setVenue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const missingImage = (e) => {
        e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'
    }

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((json) => {
                setVenue(json);
                setIsLoading(false);
            });
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    
    console.log(venue);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold my-4">{venue.name}</h1>
          <div className="mb-4">
            <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    className="w-9/12 h-auto outline-none"
                    overlayClassName="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-90"
                >
                <span
                    className="cursor-pointer right-1 z-40 text-white absolute text-4xl"
                    onClick={() => setIsOpen(false)}>
                    <MdFullscreenExit />
                </span>
                {venue.media.length > 1 ? (
                        <Slider {...sliderSettings} >
                            {venue.media.map((image, index) => (
                                <img    
                                    key={index}
                                    src={image}
                                    alt={venue.name}
                                    className="object-contain w-full h-full" />
                            ))}
                        </Slider>
                    ) : (
                        <img 
                            src={venue.media} 
                            alt={venue.name}
                            className="object-contain w-full h-full" />
                    )
                }
            </Modal>
            <div className="mb-4">
                {venue.media.length > 1 ? (
                    <Slider {...sliderSettings} >
                    {venue.media.map((image) => (
                        <div key={image}>
                            <img
                                src={image}
                                onError={missingImage}
                                onClick={() => setIsOpen(true)}
                                alt={venue.name}
                                className="w-full h-64 object-cover rounded-md mb-4"
                            />
                        </div>
                    ))}
                    </Slider>
                ) : (
                    <img
                    src={venue.media}
                    alt={venue.name}
                    onError={missingImage}
                    onClick={() => setIsOpen(true)}
                    className="w-full h-64 object-contain rounded-md mb-4"
                    />
                )}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-blue-500 font-semibold">
                    ${venue.price}/night
                    </span>
                </div>
                <div className="mt-4 flex items-center">
                    <span className="mr-2">
                        <FaBed />
                        <span className="ml-1">{venue.maxGuests} Guests</span>
                    </span>
                    <span className="mr-2">
                        <FaDog />
                        <span className="ml-1">
                            {venue.meta.pets ? 'Pets Allowed' : 'No Pets Allowed'}
                        </span>
                    </span>
                    <span className="mr-2">
                        <FaWifi />
                        <span className="ml-1">
                            {venue.meta.wifi ? 'Wifi Available' : 'No Wifi'}
                        </span>
                    </span>
                    <span className="mr-2">
                        <FaParking />
                        <span className="ml-1">
                            {venue.meta.parking ? 'Parking Available' : 'No Parking'}
                        </span>
                    </span>
                    <span className="mr-2">
                        <MdFoodBank />
                        <span className="ml-1">
                            {venue.meta.breakfast ? 'Breakfast Included' : 'No Breakfast'}
                        </span>
                    </span>
                </div>
                <div className="mt-4">
                    <div className="font-bold text-gray-500 mb-2">Description:</div>
                    <p>{venue.description}</p>
                </div>
                <div className="mt-4">
                    <div className="font-bold text-gray-500 mb-2">Location:</div>
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2" />
                            <span className='ml-1'>{venue.location.address}</span>
                        </div>
                    </div>
                </div>
          </div>
        </div>
      );
}

export default Venue;