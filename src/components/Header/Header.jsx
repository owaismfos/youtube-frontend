import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, login, addUserInfo } from "../../features/auth/authSlice";
import { logoutUser } from "../../features/auth/authActions";
import authService from "../../api/userapi";

function Header() {
    const status = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const dispatch = useDispatch();

    // user logout action
    const logout = async () => {
        dispatch(logoutUser());
    };

    const toggleDropdown = async () => {
        if (userInfo === null) {
            const userResponse = await authService.userProfile();
            console.log(userResponse)
            // setUser(userResponse.data);
            dispatch(addUserInfo(userResponse.data));
            console.log(userResponse.data);
        }
        const dropdownMenu = document.getElementById("dropdown-menu");
        const isHidden = dropdownMenu.classList.contains("hidden");

        dropdownMenu.classList.toggle("hidden");

        // Remove any previous listener to avoid duplication
        document.removeEventListener("click", handleOutsideClick);

        // If dropdown just opened, start listening for outside clicks
        if (isHidden) {
            setTimeout(() => {
                document.addEventListener("click", handleOutsideClick);
            }, 0);
        }
    };

    const handleOutsideClick = (event) => {
        const dropdownMenu = document.getElementById("dropdown-menu");
        const button = document.getElementById("dropdown-button");

        if (
            dropdownMenu &&
            !dropdownMenu.contains(event.target) &&
            !button.contains(event.target)
        ) {
            dropdownMenu.classList.add("hidden");
            document.removeEventListener("click", handleOutsideClick);
        }
    };

    // useEffect(() => {
    //     const root = window.document.documentElement;
    //     if (theme === 'dark') {
    //         root.classList.add('dark');
    //     } else {
    //         root.classList.remove('dark');
    //     }
    //     localStorage.setItem('theme', theme);
    // }, [theme]);

    return (
    <nav className="bg-gray-900 px-5 py-2 fixed w-full top z-10 items-center">
        <div className="container mx-auto flex items-center justify-between">
        {/* Left section */}
        <div className="text-white font-bold text-xl">
            <Link to="/">
            <span className="text-white">Stream</span>
            <span className="text-green-500">Talk</span>
            </Link>
        </div>

        {/* Middle section */}
        <div className="flex-grow md:flex items-center justify-center hidden">
            <input
                type="text"
                placeholder="Search"
                className="px-3 py-2 w-1/2 rounded-l-3xl bg-gray-800 border border-gray-700 focus:outline-none text-white placeholder-gray-500"
            />
            <i className="fas fa-search text-white bg-gray-700 border-gray-600 border px-6 py-3 rounded-r-3xl cursor-pointer"></i>
        </div>

        {/* Right section */}
        <div className="flex items-center">
            <Link to="/upload-video">
            <i className="fas fa-video text-white"></i>
            </Link>
            {status ? (
            <div className="relative">
                <button className="text-white" id="dropdown-button" onClick={toggleDropdown}>
                <img
                    src={userData.userAvatar}
                    alt="Profile Image"
                    className="h-8 w-8 rounded-full ml-10"
                />
                </button>
                <div
                id="dropdown-menu"
                className="hidden absolute right-0 w-64 bg-gray-900 rounded-md shadow-lg text-white py-3"
                >
                <div className="flex py-5 px-4">
                    <div className="w-1/4">
                    <img src={userInfo?.avatar} className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="w-3/4">
                    <p className="leading-none text-lg text-gray-200">
                        {userInfo?.fullname}
                    </p>
                    <p className="text-gray-200">{userInfo?.username}</p>
                    </div>
                </div>
                <hr className="border-gray-500 py-1" />
                {userInfo?.isChannel ? (
                    <Link
                    to={`/channel/${userInfo.channelId}?${userInfo.channelHandle}`}
                    className="block py-2 px-4 cursor-pointer hover:bg-gray-800 hover:mr-2 mb-2"
                    >
                    Go To Your Channel
                    </Link>
                ) : (
                    <Link
                    to="/create-channel"
                    className="block px-4 py-2 cursor-pointer hover:bg-gray-800 hover:mr-2 mb-2"
                    >
                    Create Your Channel
                    </Link>
                )}
                <p className='block py-2 px-4 cursor-pointer hover:bg-gray-800 hover:mr-2 mb-2'>
                    <Link to="/subscription">Subscriptions</Link>
                </p>

                <hr className="border-gray-500 py-1" />
                <p
                    className="block px-4 cursor-pointer py-2 hover:bg-gray-800 hover:mr-2"
                    onClick={logout}
                >
                    Logout
                </p>
                </div>
            </div>
            ) : (
            <Link className="text-white ml-10" to="/login">
                Log In
            </Link>
            )}
        </div>
        </div>
    </nav>
    );
}

export default Header;
