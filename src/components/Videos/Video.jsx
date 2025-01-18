import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addCommentsList, addComment } from '../../features/video/commentSlice.js'
import { VideoPlayer } from '../index.js'
import videoService from '../../api/videoapi.js'
import userService from '../../api/userapi.js'
import channelService from '../../api/channelapi.js'
import { timeSinceUpload, secondsToTime } from '../../utils/timeConversion.js'

export default function Video() {
    const { channelInfo, videoId } = useParams()
    const [video, setVideo] = useState({})
    const [user, setUser] = useState({})
    const [channel, setChannel] = useState({})
    const [views, setViews] = useState('0')
    const [subscribers, setSubscribers] = useState('0')
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [loggedInAvatar, setLoggedInAvatar] = useState(null)
    // const [commentsList, setCommentsList] = useState([])
    const [comment, setComment] = useState('')
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const navigator = useNavigate()

    const channelId = channelInfo.split('&')[0]
    console.log(channelId)

    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.userData)
    const commentsList = useSelector(state => state.comments.commentsList)
    const videosList = useSelector(state => state.videos.videosList)

    const getVideo = async () => {
        // const response = await videoService.getVideo(videoId)
        for (let i = 0; i < videosList.length; i++) {
            if (videosList[i]._id === videoId) {
                setVideo(videosList[i])
                console.log(videosList[i])
                break
            }
        }
        // setVideo(response.data)
        // setUser(response.data.user)
        // setChannel(response.data.channel)
        // console.log(response.data)
    }

    const postView = async () => {
        const viewsResponse = await videoService.postView(videoId)
        const viewsNumber = viewsResponse.data
        console.log(viewsNumber)
        if (viewsNumber >= 1000000000000) {
			setViews((viewsNumber / 1000000000000).toFixed(1) + 'T')
		}else if (viewsNumber >= 1000000000) {
			setViews((viewsNumber / 1000000000).toFixed(1) + 'B')
		} else if (viewsNumber >= 100000) {
            const d = viewsNumber / 1000000
            setViews(`${d.toFixed(1)}M`)
        } else if (viewsNumber >= 1000) {
            const d = viewsNumber / 1000
            setViews(`${d.toFixed(1)}K`)
        } else {
            setViews(String(viewsNumber))
        }
    }

    const getSubscribers = async () => {
        const subscribersResponse = await channelService.getSubscribers(channelId)
        console.log(subscribersResponse)
        const subscribersNumber = subscribersResponse.data.subscribersCount
        setIsSubscribed(subscribersResponse.data.isSubscribed)
        console.log(subscribersNumber)
        if (subscribersNumber >= 100000) {
            const d = subscribersNumber / 1000000
            setSubscribers(`${d.toFixed(1)}M`)
        } else if (subscribersNumber >= 1000) {
            const d = subscribersNumber / 1000
            setSubscribers(`${d.toFixed(1)}K`)
        } else {
            setSubscribers(String(subscribersNumber))
        }
    }

    const postSubscribe = async () => {
        const subscribeResponse = await channelService.subscribeChannel(channelId)
        console.log(subscribeResponse)
        if (subscribeResponse.success) {
            getSubscribers()
        }
    }

    const postUnsubscribe = async () => {
        const unsubscribeResponse = await channelService.unsubscribeChannel(channelId)
        console.log(unsubscribeResponse)
        if (unsubscribeResponse.success) {
            getSubscribers()
        }
    }

    // const loggedinUserAvatar = async () => {
    //     const response = await userService.loggedInUserAvatar()
    //     console.log(response)
    //     setLoggedInAvatar(response.data)
    // }

    const getComments = async () => {
        const response = await videoService.getComments(videoId)
        console.log(response)
        if (response.success) {
            dispatch(addCommentsList(response.data)) 
        }
        // setCommentsList(response.data)
    }

    const postComment = async (e) => {
        e.preventDefault()
        const response = await videoService.postComment(videoId, comment)
        console.log(response)
        if (response.success) {
            dispatch(addComment(response.data))
        }
        setComment('')
    }


    const getVideoLikes = async () => {
        const response = await videoService.getVideoLikes(videoId)
        console.log(response)
        setLikesCount(response.data.likesCount)
        setIsLiked(response.data.isLiked)
    }

    const likeVideo = async () => {
        const response = await videoService.likeVideo(videoId)
        console.log(response)
        getVideoLikes()
    }

    const unlikeVideo = async () => {
        const response = await videoService.unlikeVideo(videoId)
        console.log(response)
        getVideoLikes()
    }

    useEffect(() => {
        getVideo()
        postView()
        getSubscribers()
        // loggedinUserAvatar()
        getComments()
        getVideoLikes()
    }, [])

    return (
        <div className="flex py-2 mx-20">
        {/* First column (2/3 width) */}
            <div className="w-2/3 mr-5">
                <VideoPlayer videoSrc={video.videoUrl} />
                <div className='text-white py-3'>
                    <h1 className='text-2xl font-bold my-3'>{video.title}</h1>
                    {/* <p className='my-2'>{views} views</p> */}
                    <div className='flex'>
                        <div className='w-1/2 my-4 flex my-auto'>
                            <img className='w-10 h-10 rounded-full' src={video?.channel?.channelAvatarUrl} alt="" />
                            <div className='mx-3'>
                                <Link className='text-lg font-semibold text-gray-200' to={`/channel/${video?.channel?.channelId}?${video?.channel?.channelHandle}`}>{video?.channel?.channelName}</Link>
                                <p className='text-sm text-gray-400'>{subscribers} Subscribers</p>
                            </div>
                        </div>
                        <div className='w-1/4 my-4'>
                            {isSubscribed ? (
                                <button className='py-2 px-6 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-3xl'
                                onClick={postUnsubscribe}
                            >Subscribed</button>
                            ) : (
                                <button className='py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-3xl'
                                onClick={postSubscribe}
                            >Subscribe</button>
                            )}
                        
                        </div>
                        <div className='w-1/4 my-4'>
                            {isLiked ? (
                                <button className='py-2 px-6 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-3xl items-center'
                                onClick={unlikeVideo}
                            ><i className="fa-solid fa-thumbs-up fa-xl"></i> {likesCount}</button>
                            ) : (
                                <button className='py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-3xl items-center'
                                onClick={likeVideo}
                            ><i className="fa-regular fa-thumbs-up fa-xl"></i> {likesCount}</button>
                            )}
                        
                        </div>
                    </div>
                    <div className='p-3  bg-gray-800 rounded-md'>
                        <p className='text-md font-semibold text-gray-200'>{views} views {timeSinceUpload(video.createdAt)}</p>
                        <p className='py-2'>{video.description}</p>
                    </div>

                    <div className="max-w-4xl mt-8">
                    {/* <!-- Comment Form Container --> */}
                        <form className="flex space-x-4">
                            {/* <!-- Avatar --> */}
                            <img src={userData.userAvatar} alt="Avatar" className="w-12 h-10 rounded-full" />

                            {/* <!-- Input Field --> */}
                            {/* <!-- Input field with bottom border --> */}
                            <input type="text" 
                            placeholder="Enter your comment..." 
                            className="bg-black w-full border-b border-gray-500 focus:outline-none"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            />


                            {/* <!-- Submit Button --> */}
                            <button type="submit" 
                            className='bg-gray-800 text-gray-500 font-semibold py-2 px-4 rounded-3xl' onClick={postComment}
                            >Comment</button>
                        </form>
                    </div>

                    <div className="max-w-xl mt-8">
                        <h3 className='text-xl font-bold mb-5'>{commentsList?.length} Comments</h3>
                        {/* <!-- Single comment --> */}
                        {commentsList?.toReversed()?.map((comment) => (
                            <div className="flex space-x-4 items-start" key={comment.id}>
                                {/* <!-- Commenter's avatar --> */}
                                <img src={comment.user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full" />

                                {/* <!-- Comment content --> */}
                                <div>
                                    {/* <!-- Commenter's username --> */}
                                    <div className="font-semibold text-gray-300 flex items-center gap-2">{comment.user.username}
                                        <div className="text-gray-400 text-xs">{timeSinceUpload(comment.createdAt)}</div>
                                    </div>
                                    {/* <!-- Comment text --> */}
                                    <p className="text-white font-thin">{comment.comment}</p>
                                    {/* <!-- Timestamp --> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Second column (1/3 width) */}
            <div className="w-1/3">
                <div className="flex my-3">
                    <div className="w-2/3">
                        <div className="relative max-w-md rounded-lg overflow-hidden cursor-pointer">
                            {/* Image */}
                            <img className="w-48 xs:w-16 sm:h-28 xs:h-20 object-cover rounded-lg" src={"http://res.cloudinary.com/owaisamu20/image/upload/v1707903574/thumbnail_upload/yrgedp4qhn1vrtfzz2qw.jpg"} alt="Card Image" />

                            {/* Overlay */}
                            <div className="absolute bottom-1 right-2 px-1 rounded-md bg-gray-700">
                                <p className="text-xs font-semibold text-white">{secondsToTime(90)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <p className="text-white font-semibold">Title Title Title Title Title Title Title Title Title</p>
                        <p className='text-sm text-gray-300'>@owais</p>
                        <p className='text-sm text-gray-300'>12K views</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
