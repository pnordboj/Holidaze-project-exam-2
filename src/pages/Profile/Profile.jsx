import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import style from './Profile.module.css';
import { API_URL_PROFILES } from '../../common/common';

const Profile = () => {
    
    const params = useParams();
    const url = API_URL_PROFILES + params.id;

    return (
        <div>
            <h1>Profile</h1>
        </div>
    );
}

export default Profile;