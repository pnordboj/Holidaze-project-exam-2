import React from 'react';
import { BounceLoader } from 'react-spinners';

export const Loader = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <BounceLoader color='#1D4ED8' size={100} />
    </div>
  );
};
