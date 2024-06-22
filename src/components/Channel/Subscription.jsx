import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Sidebar } from '../index.js'
// import videoService from '../../backendapi/videoapi.js'
import channelService from '../../api/channelapi.js'
import { timeSinceUpload } from '../../utils/timeConversion.js'

function Subscription() {
    const [channelList, setChannelList] = useState([])
    
    const location = useLocation()
    const currentPath = location.pathname

    const getSubscribeChannelsListOfCurrentUser = async () => {
        const response = await channelService.getSubscribeChannelsListOfCurrentUser()
        setChannelList(response.data.subscriptions)
        console.log(response.data)
    }

    useEffect(() => {
        getSubscribeChannelsListOfCurrentUser()
    }, [])

    return (
        <div className='flex flex-1 h-screen'>
            {/* Left Section */}
            <Sidebar currentPath={currentPath} />

            {/* Right Section */}
            <main className="p-4 ml-48 ">
                <div className="px-24 py-7">
                    <h1 className='text-white text-xl font-bold mb-5'>Channels Subscribed By You 
                        <span className='mx-5'>{channelList.length}</span>
                    </h1>
                    {channelList.map((channel) => (
                        <div className='hover:bg-gray-600 py-3 px-6 rounded-md'>
                            <Link key={channel._id} to={`/channel/${channel.id}?${channel.channelHandle}`}>
                                <div className='flex items-center'>
                                    <div className='w-1/3'>
                                        <img src={channel.channelAvatarUrl} alt="" className='h-20 w-20 rounded-full' />
                                    </div>
                                    <div className='w-2/3'>
                                        <p className='text-white text-xl font-bold'>{channel.channelName}</p>
                                        <p className='text-gray-400'>@{channel.channelHandle}</p>
                                        <p className='text-gray-500'>{timeSinceUpload(channel.createdAt)}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Subscription