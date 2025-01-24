import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { useSelector } from 'react-redux'
import { Sidebar } from '../index.js'
import videoService from '../../api/videoapi.js'
import channelService from '../../api/channelapi.js'
// import userService from '../../api/userapi.js'
import { secondsToTime, timeSinceUpload } from '../../utils/timeConversion.js'
import { ImageUploadModal } from '../index.js'

function Channel() {
    const {channelId} = useParams()
    console.log(channelId)
    const location = useLocation()
    const [currentUser, setCurrentUser] = useState(false)
    const [videosList, setVideosList] = useState([])
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [channel, setChannel] = useState({})
    const [channelBackgroundUrl, setChannelBackgroundUrl] = useState(null)
    const [channelAvatarUrl, setChannelAvatarUrl] = useState(null)
    console.log(channelId)
    const navigate = useNavigate()

    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false)
    const [isAvatarModalOpen, setAvatarModalOpen] = useState(false)
    const [backgroundImageFile, setBackgroundImageFile] = useState(null)
    const [avatarImageFile, setAvatarImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [channelName, setChannelName] = useState('')
    const [isChannelNameModalOpen, setIsChannelNameModalOpen] = useState(false)
    // const []

    const openModalBackgroundImage = () => setIsBackgroundModalOpen(true)
    const closeModalBackgroundImage = () => {
        setIsBackgroundModalOpen(false)
        setBackgroundImageFile(null)
    }

    const openModalAvatarImage = () => setAvatarModalOpen(true)
    const closeModalAvatarImage = () => {
        setAvatarModalOpen(false)
        setAvatarImageFile(null)
    }

    const openModalChannelName = () => setIsChannelNameModalOpen(true)
    const closeModalChannelName = () => {
        setIsChannelNameModalOpen(false)
        setChannelName('')
    }

    const uploadBackgroundImage = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('backgroundImage', backgroundImageFile)
        const response = await channelService.uploadChannelBackgroundImage(formData)
        console.log(response)
        setChannelBackgroundUrl(response.data)
        setLoading(false)
    }

    const uploadAvatarImage = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('avatarImage', avatarImageFile)
        const response = await channelService.uploadChannelAvatarImage(formData)
        console.log(response)
        setChannelAvatarUrl(response.data)
        setLoading(false)
    }

    const changeChannelName = async () => {
        setLoading(true)
        const response = await channelService.changeChannelName(channelName)
        console.log(response)
        setChannel({...channel, channelName:response.data})
        setLoading(false)
        console.log(channel)
    }

    const channelDetails = async () => {
        const response = await channelService.getChannelDetailsById(channelId)
        // response = await response.json()
        setChannel(response.data)
        setChannelBackgroundUrl(response.data.channelBackgroundUrl)
        setChannelAvatarUrl(response.data.channelAvatarUrl)
        setCurrentUser(response.data.currentUser)
    }

    const getSubscribersCount = async () => {
        const response = await channelService.getSubscribers(channelId)
        console.log(response)
        setSubscriberCount(response.data.subscribersCount)
        setIsSubscribed(response.data.isSubscribed)
    }

    const getVideos = async () => {
        const videos = await videoService.getVideosOfChannel(channelId)
        if (videos.status >= 400) {
            console.log("I am checking the token exiration")
            return null
        }
        setVideosList(videos.data)
    }

    const makeSubscriberCount = (subscriber) => {
        if (subscriber >= 1000000) {
          return (subscriber / 1000000).toFixed(1) + 'M'
        } else if (subscriber >= 1000) {
            return (subscriber / 1000).toFixed(1) + 'K'
        } else {
            return subscriber
        }
    }

    const makeViewrCount = (views) => {
        if (views >= 1000000) {
          return (views / 1000000).toFixed(1) + 'M'
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K'
        } else {
            return views
        }
    }

    const makeVideoTitle = (title) => {
        if (title.length > 40) {
            return title.substring(0, 50) + "..."
        } else {
            return title
        }
    }

    useEffect(() => {
        channelDetails()
        getSubscribersCount()
        getVideos()
    }, [])
    return (
        <div className="">
            <Sidebar currentPath={location.pathname} />
            <div className="pl-8 pr-20 ml-56 pt-10">
                <div className='w-full bg-gray-500 rounded-xl'>
                    {currentUser ? (
                        <>
                        {channelBackgroundUrl ? (
                            <div className='relative'>
                                <img src={channelBackgroundUrl} alt="" className='h-40 w-full rounded-xl' />
                                <button className='absolute top-2 right-2 p-1 border bg-white bg-opacity-40 rounded-md border-gray-600 text-gray-900' onClick={openModalBackgroundImage}><i className="fa-solid fa-camera"></i>Edit Cover Image</button>
                            </div>
                        ) : (
                            <div className='relative'>
                                <img src={'../../public/backgroundImage.jpg'} alt="" className='h-40 w-full rounded-xl' />
                                <button className='absolute top-2 right-2 p-1 border bg-gray-900 bg-opacity-20 rounded-md border-gray-600 text-white' onClick={openModalBackgroundImage}><i className="fa-solid fa-camera"></i>Edit Cover Image</button>
                            </div>
                        )}
                        </>
                    ) : (
                        <>
                        {channelBackgroundUrl ? (
                            <img src={channelBackgroundUrl} alt="" className='h-40 w-full rounded-xl' />
                        ) : (
                            <img src={'../../public/backgroundImage.jpg'} alt="" className='h-40 w-full rounded-xl' />
                        )}
                        </>
                    )}
                </div>
                <ImageUploadModal isOpen={isBackgroundModalOpen} onClose={closeModalBackgroundImage}>
                    <div className=''>
                        {loading && 
                            <div className="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
                                <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
                            </div>
                        }
                        <h1 className="text-xl font-semibold mb-4 mt-5">Upload Channel Background Image</h1>
                        <input type="file" name="upload" className='p-2 bg-red-500' onChange={e => setBackgroundImageFile(e.target.files[0])} /> <br />
                        <button className='bg-orange-600 hover:bg-orange-700 px-4 py-2 my-4 text-gray-300 disable' onClick={uploadBackgroundImage}>Upload</button>
                    </div>
                </ImageUploadModal>

                <ImageUploadModal isOpen={isAvatarModalOpen} onClose={closeModalAvatarImage}>
                    <div className=''>
                        {loading && 
                            <div className="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
                                <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
                            </div>
                        }
                        <h1 className="text-xl font-semibold mb-4 mt-5">Upload Channel Avatar Image</h1>
                        <input type="file" name="upload" className='p-2 bg-red-500' onChange={e => setAvatarImageFile(e.target.files[0])} /> <br />
                        <button className='bg-orange-600 hover:bg-orange-700 px-4 py-2 my-4 text-gray-300 disable' onClick={uploadAvatarImage}>Upload</button>
                    </div>
                </ImageUploadModal>

                <ImageUploadModal isOpen={isChannelNameModalOpen} onClose={closeModalChannelName}>
                    <div className=''>
                        {loading && 
                            <div className="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
                                <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
                            </div>
                        }
                        <h1 className="text-xl font-semibold mb-4 mt-5">Change Channel Name</h1>
                        <input type="text" name="channelName" className='p-2 focus:outline-none' onChange={e => setChannelName(e.target.value)} /> <br />
                        <button className='bg-orange-600 hover:bg-orange-700 px-4 py-2 my-4 text-gray-300 disable' onClick={changeChannelName}>Change</button>
                    </div>
                </ImageUploadModal>
                <div className="py-7">
                    <div className='flex'>
                        <div className='w-1/5'>
                            {currentUser ? (
                                <>
                                {channelAvatarUrl ? (
                                    <div className='relative'>
                                        <img src={channelAvatarUrl} alt="avatar" className='w-32 h-32 rounded-full' />
                                        <button className='absolute text-white py-1 px-2 items-center bg-gray-600 rounded-full bottom-2 right-14' onClick={openModalAvatarImage}><i className="fa-solid fa-camera"></i></button>
                                    </div>
                                ) : (
                                    <div className='relative'>
                                        <img src={'../../public/channelImage.jpg'} alt="avatar" className='w-32 h-32 rounded-full' />
                                        <button className='absolute text-white py-1 px-2 items-center bg-gray-600 rounded-full bottom-2 right-14' onClick={openModalAvatarImage}><i className="fa-solid fa-camera"></i></button>
                                    </div>
                                )}
                                </>
                            ) : (
                                <>
                                {channelAvatarUrl ? (
                                    <img src={channelAvatarUrl} alt="avatar" className='w-32 h-32 rounded-full' />
                                ) : (
                                    <img src={'../../public/channelImage.jpg'} alt="avatar" className='w-32 h-32 rounded-full' />
                                )}
                                </>
                            )}
                        </div>
                        <div className='w-4/5'>
                            {currentUser ? (
                                <div className='flex items-center'>
                                    <h1 className='text-white text-4xl font-semibold'>{channel.channelName}</h1>
                                    <button className='ml-3 text-gray-300 border border-gray-500 py-1/2 px-1 rounded-md' onClick={openModalChannelName}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                </div>
                            ) : (
                                <h1 className='text-white text-4xl font-semibold'>{channel.channelName}</h1>
                            )}
                            <p className='text-gray-400 text-xl py-1'>@{channel.channelHandle}</p>
                            <p className='text-gray-400 text-xl pb-4'>{makeSubscriberCount(subscriberCount)} subscribers . {videosList.length} videos</p>
                            {isSubscribed? (
                                <button className='py-2 px-7 bg-gray-500 text-gray-300 text-lg font-medium rounded-3xl'
                                // onClick={postUnsubscribe}
                            >Subscribed</button>
                            ): (
                                <button className='py-2 px-7 bg-gray-200 text-gray-800 text-lg font-medium rounded-3xl'
                                // onClick={postSubscribe}
                                >Subscribe</button>
                            )}
                        </div>
                    </div>
                    <hr className='border-gray-400 mt-7' />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gab-4">
                    {videosList.map(video =>(
                        <div key={video._id} className="relative max-w-md rounded-lg overflow-hidden m-3 cursor-pointer">
                            {/* Image */}
                            <img className="w-full h-52 sm:h-52 object-cover rounded-lg" src={video.thumbnailUrl} alt="Card Image" />
                
                            {/* Overlay */}
                            {makeVideoTitle(video.title).length <= 30 ? (
                                <div className="absolute bottom-8 right-0 text-black px-1 my-10 mx-3 rounded-md bg-gray-700">
                                    <p className="text-sm text-white">{secondsToTime(video.duration)}</p>
                                </div>
                            ) : (
                                <div className="absolute bottom-8 right-0 text-black px-1 my-10 mx-3 rounded-md bg-gray-700">
                                    <p className="text-sm text-white">{secondsToTime(video.duration)}</p>
                                </div>
                            )}
                            <div className='flex my-2'>
                                <div className='w-5/6'>
                                    <p className='text-lg font-semibold text-white'>{makeVideoTitle(video.title)}</p>
                                    <p className='text-sm text-gray-300'>{makeViewrCount(video.views)} views . {timeSinceUpload(video.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> 
        </div>
    )
}

export default Channel