import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import videoService from '../../api/videoapi'
import { addVideo } from '../../features/video/videoSlice';

const VideoUpload = () => {
    const [videoFile, setVideoFile] = useState(null)
    const [thubmnailFile, setThubmnailFile] = useState(null)
    const [videoTitle, setVideoTitle] = useState("")
    const [videoDescription, setVideoDescription] = useState("")
    const [uploadProgress, setUploadProgress] = useState(false)
    const [videoUploadMessage, setVideoUploadMessage] = useState("")
    const [videoUploadCode, setVideoUploadCode] = useState(null)
    const [progress, setProgress] = useState(0)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userStatus = useSelector(state => state.auth.status)

    const handleVideoFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    }
    const handleThubmnailFileChange = (event) => {
        setThubmnailFile(event.target.files[0]);
    }
    const handleVideoTitleChange = (event) => {
        setVideoTitle(event.target.value);
    }
    const handleVideoDescriptionChange = (event) => {
        setVideoDescription(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!videoFile) {
            alert('Please select a file.')
            return
        }

        setUploadProgress(true)

        const formData = new FormData()
        formData.append('video', videoFile)
        formData.append('thumbnail', thubmnailFile)
        formData.append('title', videoTitle)
        formData.append('description', videoDescription)

        const data = await videoService.uploadVideo(formData, (progress) => {
            setProgress(progress)
        })
        setProgress(0)
        setUploadProgress(false)
        setVideoFile(null)
        setThubmnailFile(null)
        setVideoTitle("")
        setVideoDescription("")
        setVideoUploadMessage(data.message)
        setVideoUploadCode(data.status_code)
        if (data.success) {
            dispatch(addVideo(data.data))
            alert(data.message)
        }
        console.log(data)
    }

    useEffect(() => {
        if (!userStatus) {
            alert("You're not logged in.")
            // navigate("/login")
            // window.location.href = "/login"
        }
    }, [uploadProgress])


    return (
        <div className="flex flex-col items-center py-8 min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
            {/* Header */}
            <h1 className="text-4xl text-white font-bold mb-8">Upload Your Video</h1>

            {/* Upload Card */}
            <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-8">
                {/* Loader and Progress */}
                {progress > 0 && progress < 100 && (
                    <div className="flex flex-col items-center mb-6">
                        {/* Loader Animation */}
                        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
                        {/* Progress Bar */}
                        <p className="text-center text-white mb-2 font-semibold">
                            Uploading... {progress}%
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-blue-500 h-3 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Success or Error Message */}
                {videoUploadCode && (
                    <div
                        className={`mb-6 p-4 text-center font-semibold rounded-lg ${
                            videoUploadCode === 201
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                        }`}
                    >
                        {videoUploadMessage}
                    </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Video Upload Section */}
                    <div>
                        <label
                            htmlFor="videoUpload"
                            className="block w-full border-2 border-dashed border-gray-500 text-center rounded-lg p-6 cursor-pointer hover:border-blue-500"
                        >
                            {videoFile ? (
                                <p className="text-white">{videoFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-gray-400">
                                        Drag and drop your video here, or click to select
                                    </p>
                                    <span className="block mt-2 text-sm text-gray-500">
                                        (MP4, MOV, AVI, WEBM - Max size: 500MB)
                                    </span>
                                </>
                            )}
                            <input
                                id="videoUpload"
                                type="file"
                                className="hidden"
                                onChange={handleVideoFileChange}
                                accept="video/*"
                            />
                        </label>
                    </div>

                    {/* Video Title */}
                    <div>
                        <label htmlFor="title" className="block text-white mb-2">
                            Video Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter video title"
                            className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleVideoTitleChange}
                        />
                    </div>

                    {/* Video Description */}
                    <div>
                        <label htmlFor="desc" className="block text-white mb-2">
                            Video Description
                        </label>
                        <textarea
                            id="desc"
                            placeholder="Write a short description about the video"
                            className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            onChange={handleVideoDescriptionChange}
                        />
                    </div>

                    {/* Thumbnail Upload Section */}
                    <div>
                        <label
                            htmlFor="thumbnailUpload"
                            className="block w-full border-2 border-dashed border-gray-500 text-center rounded-lg p-6 cursor-pointer hover:border-red-500"
                        >
                            {thubmnailFile ? (
                                <p className="text-white">{thubmnailFile.name}</p>
                            ) : (
                                <>
                                    <p className="text-gray-400">
                                        Drag and drop your thumbnail here, or click to select
                                    </p>
                                    <span className="block mt-2 text-sm text-gray-500">
                                        (JPG, PNG - Max size: 5MB)
                                    </span>
                                </>
                            )}
                            <input
                                id="thumbnailUpload"
                                type="file"
                                className="hidden"
                                onChange={handleThubmnailFileChange}
                                accept="image/*"
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={progress > 0 && progress < 100}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                            progress > 0 && progress < 100
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        {progress > 0 && progress < 100 ? "Uploading..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default VideoUpload
