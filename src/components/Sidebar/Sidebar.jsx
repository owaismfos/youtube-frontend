import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import channelService from '../../api/channelapi.js'


export default function Sidebar({currentPath}) {
    const navigate = useNavigate()
    const [channel, setChannel] = useState({})
    const userStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)
    const [error, setError] = useState(null)
    
    const navigateHome = () => {
        navigate('/')
    }

    const navigateSubscription = () => {
        if (!userStatus) {
            alert('Please Login')
            navigate('/login')
        } else {
            navigate('/subscription')
        }
    }

    const navigateYourChannel = () => {
        if (!userStatus) {
            alert('Please Login')
            navigate('/login')
        } else if (error?.status_code >= 400) {
            alert(error.message)
        } else {
            navigate(`/channel/${channel?.id}?${channel?.channelHandle}`)
        }
    }

    const getChannelDetails = async () => {
        const channelResponse = await channelService.getChannelDetails()
        console.log("Channel Response: ", channelResponse)
        if (channelResponse.status_code >= 400) {
            console.log("I am checking the token exiration")
            setError(channelResponse)
            return null
        }
        setChannel(channelResponse.data)
        // console.log("Channel: ", channel)
    }

    useEffect(() => {
        if (userStatus){
            console.log("Reprint the side bar...")
            getChannelDetails()
        } else {
            console.log("No user data")
        }
        console.log('User Data: ', userData)
    }, [userStatus])

    return (
        <aside className="h-full w-64 p-4 text-white hidden md:block">
            <ul>
                {currentPath === '/' ? (
                    <li className='bg-gray-800 hover:bg-gray-700 rounded-md py-2 cursor-pointer'>
                        <Link className='px-3 font-semibold' to="/">Home</Link>
                    </li>
                ) : (
                    <li className='hover:bg-gray-800 rounded-md py-2 cursor-pointer' onClick={navigateHome}>
                        <Link className='px-3 font-semibold' to="/">Home</Link>
                    </li>
                )}
                {currentPath === '/subscription' ? (
                    <li className='bg-gray-800 hover:bg-gray-700 rounded-md py-2'>
                        <Link className='px-3 font-semibold' to="/subscription">Subscriptions</Link>
                    </li>
                ) : (
                    <li className='hover:bg-gray-800 rounded-md py-2 cursor-pointer' onClick={navigateSubscription}>
                        <Link className='px-3 font-semibold'>Subscriptions</Link>
                    </li>
                )}
                <hr className='my-2 border-gray-400' />
                {currentPath === `/channel/${channel?.id}` ? (
                    <li className='bg-gray-800 hover:bg-gray-700 rounded-md py-2'>
                        <Link className='px-3 font-semibold' to={`/channel/${channel?.id}`}>Your channel</Link>
                    </li>
                ) : (
                    <li className='hover:bg-gray-800 rounded-md py-2 cursor-pointer' onClick={navigateYourChannel}>
                        <Link className='px-3 font-semibold'>Your channel</Link>
                    </li>
                )}
            </ul>
        </aside>
    )
}
