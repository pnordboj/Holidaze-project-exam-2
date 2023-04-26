import React, { useState } from "react";

function Authenticate() {

    /* Handles */

    const [registerActive, setRegisterActive] = useState(false);
    const registerd = false;
    const [loginActive, setLoginActive] = useState(true);
    const [avatarActiver, setAvatarActiver] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('https://placehold.co/100x100?text=Avatar');

    const usernameError = false;
    const emailError = false;
    const passwordError = false;

    function handleUsername(e) {
        if (username.length > 3) {
            setUsername(e.target.value);
        } else {
            usernameError = true;
        }
    }

    function handleEmail(e) {
        if (email.endsWith('@stud.noroff.no')) {
            setEmail(e.target.value);
        } else {
            emailError = true;        
        }
    }

    function handlePassword(e) {
        if (password.length > 8) {
            setPassword(e.target.value);
        } else {
            passwordError = true;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Submitted');

    }

    function handleAvatar(e) {
        setAvatar(e.target.value);
    }

    /* Render */

    const AvatarPage = () => {
        const [imageURL, setImageURL] = useState('');

        const handleChange = (event) => {
            setImageURL(event.target.value);
        };
        return (
            <div>
                <h1 className="text-3xl font-bold my-4">Avatar Upload</h1>
                <div className="w-1/2 mx-auto">
                <label htmlFor="imageURL">Image URL:</label>
                <input
                    type="text"
                    id="imageURL"
                    name="imageURL"
                    value={imageURL}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {imageURL && (
                    <img
                    src={imageURL}
                    alt="Preview"
                    className="block w-full rounded-md my-4"
                    />
                )}
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    disabled={!imageURL}
                >
                    Save
                </button>
                </div>
            </div>
            );
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-4">Authenticate</h1>
            <div className="flex justify-center items-center">
                <div className="w-1/2">
                    <div className="flex justify-center items-center">
                        <button
                            className={`w-1/2 py-2 rounded-tl-md rounded-bl-md ${loginActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                            onClick={() => {
                                setLoginActive(true);
                                setRegisterActive(false);
                            }}
                        >
                            Login
                        </button>
                        <button
                            className={`w-1/2 py-2 rounded-tr-md rounded-br-md ${registerActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                            onClick={() => {
                                setLoginActive(false);
                                setRegisterActive(true);
                            }}
                        >
                            Register
                        </button>
                    </div>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {loginActive && (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${usernameError ? 'border-red-500' : ''}`}
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={handleUsername}
                                    />
                                    {usernameError && (
                                        <p className="text-red-500 text-xs italic">Please choose a username with at least 4 characters.</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError ? 'border-red-500' : ''}`}
                                        id="password"
                                        type="password"
                                        placeholder="******************"
                                        value={password}
                                        onChange={handlePassword}
                                    />
                                    {passwordError && (
                                        <p className="text-red-500 text-xs italic">Please choose a password with at least 8 characters.</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        )}
                        {registerActive && (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${usernameError ? 'border-red-500' : ''}`}
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={handleUsername}
                                    />
                                    {usernameError && (
                                        <p className="text-red-500 text-xs italic">Please choose a username with at least 4 characters.</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleEmail}
                                    />
                                    {emailError && (
                                        <p className="text-red-500 text-xs italic">Please choose a valid email.</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError ? 'border-red-500' : ''}`}
                                        id="password"
                                        type="password"
                                        placeholder="******************"
                                        value={password}
                                        onChange={handlePassword}
                                    />
                                    {passwordError && (
                                        <p className="text-red-500 text-xs italic">Please choose a password with at least 8 characters.</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    )

}