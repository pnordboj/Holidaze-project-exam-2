import React from 'react';
import { useParams } from 'react-router-dom';
import { API_URL_PROFILES } from '../../common/common';

const Profile = () => {
  const params = useParams();
  const url = API_URL_PROFILES + params.id;

  return (
    <div>
      <h1>Profile {url}</h1>
    </div>
  );
};

export default Profile;
