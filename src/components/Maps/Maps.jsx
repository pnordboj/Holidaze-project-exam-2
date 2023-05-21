/* eslint-disable react/prop-types */
import React from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export const Maps = ({ lat, lng }) => {
  const defaultProps = {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: 11,
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyCvzNeiPch-NtQRb1toUW5XBZaWMY7Hctc' }} {...defaultProps}>
        <AnyReactComponent lat={59.955413} lng={30.337844} text='My Marker' />
      </GoogleMapReact>
    </div>
  );
};
