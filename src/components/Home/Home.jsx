import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import videoService from "../../api/videoapi.js"
import { addVideosList } from '../../features/video/videoSlice.js'
import { Card } from '../index.js'
import { Sidebar } from '../index.js'

export default function Home() {
	const [loading, setLoading] = useState(true)
	// const navigate = useNavigate()
	const dispatch = useDispatch()
	const location = useLocation()
	const currentPath = location.pathname

	const videoStatus = useSelector(state => state.videos.isVideos)
	const videosList = useSelector(state => state.videos.videosList)
	
	const hours = new Date()

	const makeViews = (views) => {
		if (views >= 1000000000000) {
			return (views / 1000000000000).toFixed(1) + 'T'
		}else if (views >= 1000000000) {
			return (views / 1000000000).toFixed(1) + 'B'
		}else if (views >= 1000000) {
			return (views / 1000000).toFixed(1) + 'M'
		} else if (views >= 1000) {
			return (views / 1000).toFixed(1) + 'K'
		} else {
			return views
		}
	}

	const getAllVideos = async () => {
		const response = await videoService.getVideos()
		if (response.status_code >= 400) {
			console.log(response.status_code)
		} else {
			console.log(response.status_code)
			console.log(response)
			dispatch(addVideosList(response.data))
		}
	}

	useEffect(() => {
		if (!videoStatus) {
			getAllVideos()
		}
		setLoading(false)
	}, [])

	
	return (
		<div className='flex h-screen py-4'>
			{/* Left Section */}
			<Sidebar currentPath={currentPath} />

			{/* Right Section */}
			<main className="flex-1 overflow-y-auto">
				{loading? (
                    <div className="flex justify-center items-center h-screen text-white">Loading...</div>
				) : (
				<div className="max-w-screen-xl mx-auto w-full pr-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
					{videosList.map((video, index) => (
						<Link key={video._id} to={`/video-play/${video.channel.channelId}&${video.channel.channelHandle}/${video.id}`}>
							<Card
								imageUrl={video.thumbnailUrl}
								title={video.title}
								views={makeViews(video.views)}
								timestamp={video.duration}
								profile={video.channel.channelAvatarUrl  || '/userdefault.png'}
								chennelName={video.channel.channelName}
								timeUpload={video.createdAt}
							/>
						</Link>
					))}
				</div>
				</div>
				)}
			</main>
		</div>
	)
}
