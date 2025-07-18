import React, { useState, useEffect, useRef } from 'react';
import VideoProgressBar from './VideoProgressBar';
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const VideoPlayer = ({ videoSrc }) => {
	const videoRef = useRef(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [mute, setMute] = useState(false)
	const [volume, setVolume] = useState(100)
	const [previousVolume, setPreviousVolume] = useState(0)
	const [fullscreen, setFullscreen] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [showControls, setShowControls] = useState(false)

	useEffect(() => {
		const video = videoRef.current
		const updateProgress = () => {
			setCurrentTime(video.currentTime)
			setDuration(video.duration)
		}
		video.addEventListener('timeupdate', updateProgress)
		return () => video.removeEventListener('timeupdate', updateProgress)
	}, [])

	const togglePlay = () => {
		const video = videoRef.current
		if (isPlaying) {
			video.pause()
		} else {
			video.play()
		}
		setIsPlaying(!isPlaying)
	}

	const toggleMute = () => {
		const video = videoRef.current
		if (mute) {
			setVolume(previousVolume)
		} else {
			setVolume(0)
			setPreviousVolume(volume)
		}
		video.muted = !mute
		setMute(!mute)
	}

	const handleVolumeChange = (e) => {
		const video = videoRef.current
		video.volume = e.target.value / 100
		setVolume(e.target.value)
	};

	const toggleFullscreen = () => {
		const video = videoRef.current
		if (!document.fullscreenElement) {
		video.requestFullscreen().catch((err) => {
			console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
		})
		} else {
		document.exitFullscreen()
		}
		// setFullscreen(!fullscreen);
	}

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}

	const handleClick = (event) => {
		const rect = event.target.getBoundingClientRect()
		console.log(event.target.value)
		console.log("Rect :", rect)
		console.log(event.clientX)
		const offsetX = event.clientX - rect.left
		const width = (offsetX / rect.width) * 100
		console.log(parseInt(width))
		// setCurrentTime(width)
	}

	const handleMouseMove = () => {
		setShowControls(true);
		// Reset timer to hide controls after 3 seconds
		clearTimeout(timeout);
		timeout = setTimeout(() => {
		  setShowControls(false);
		}, 5000);
	  };
	
	  const handleMouseLeave = () => {
		setShowControls(false);
	  };

	  const getVideoQuality = () => {
		const video = videoRef.current;
		if (!video) return 'Unknown';
		
		const width = video.videoWidth;
		const height = video.videoHeight;
		const bitrate = video.currentSrc && video.currentSrc.bitrate;
	
		// Example quality thresholds (adjust as needed)
		if (width >= 1920 || height >= 1080) {
		  return '1080p';
		} else if (width >= 1280 || height >= 720) {
		  return '720p';
		} else if (width >= 854 || height >= 480) {
		  return '480p';
		} else {
		  return 'SD';
		}
	  };

	return (
		<div className="mt-3">
			<div
				className={`relative w-full ${showControls ? '' : 'cursor-none'}`}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
			<video
				ref={videoRef}
				className="rounded-xl w-full relative video-js vjs-default-skin"
				src={videoSrc}
				onEnded={() => setIsPlaying(false)}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				onLoadedMetadata={() => setDuration(videoRef.current.duration)}
				controls={showControls}
			></video>
			{/* <div>
				Current Video Quality: {getVideoQuality()}
			</div> */}
			</div>
			{/* <div className="bottom-14 left-0 rounded-xl bg-gray-800 bg-opacity-50 px-3 py-2 items-center"> */}
				{/* <VideoProgressBar currentTime={currentTime} duration={duration} onClick={handleClick} /> */}
				{/* <input
					type="range"
					className="appearance-red-500 w-full h-1 bg-gray-200 rounded-full my-2 outline-none focus:outline-none"
					id="video-range"
					min={0}
					value={currentTime}
					max={duration}
					onChange={(e) => (videoRef.current.currentTime = e.target.value)}
				/> */}
				{/* </div> */}
				{/* <div className='flex justify-between py-2 items-center justify-center'>
					<button className="text-white" onClick={togglePlay}>
						{isPlaying ? (
							<i className="fa-solid fa-pause fa-lg mx-2"></i>
						) : (
							<i className="fa-solid fa-play fa-lg mx-2"></i>
						)}
					</button>
					<span className="text-white items-center font-thin text-sm mx-10">{formatTime(currentTime)} / {formatTime(duration)}</span>
					<div>
						<button className="text-white" onClick={toggleMute}>
							{mute ? (
								<i className="fa-sharp fa-solid fa-volume-xmark mx-2"></i>
							) : (
								<i className="fa-solid fa-volume-high mx-2"></i>
							)}
						</button>
						<input
							type="range"
							className="h-1"
							value={volume}
							max={100}
							onChange={handleVolumeChange}
						/>
						<span className="text-white items-center font-thin text-sm mx-1">{volume} / {100}</span>
					</div>
					<div class="flex-grow"></div> 
					<button className="text-white" onClick={toggleFullscreen}> 
						<i className="fa-solid fa-expand fa-xl"></i>
					</button>
				</div> */}
			{/* </div> */}
		</div>
	)
}

export default VideoPlayer
