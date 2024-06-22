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

        const data = await videoService.uploadVideo(formData)

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
    <div className="py-4 mx-20 h-screen">
        {uploadProgress && 
        <div className="mt-2 bg-green-500 py-3 text-white font-semibold px-20 mx-20">
            <p className='mx-20 px-20'>Uploading...</p> 
            <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-20 px-20"></span>
        </div>
        }

        {videoUploadCode && (
        <>
        {videoUploadCode === 201 ? (
            <div className="mt-2 bg-green-500 py-3 text-white font-semibold px-20 mx-20">
            <p className='mx-20'>{videoUploadMessage}</p>
            </div>
        ) : (
            <div className="mt-2 bg-red-500 py-3 text-white font-semibold px-20 mx-20">
            <p className='mx-20'>{videoUploadMessage}</p>
            </div>
        )}
        </>
        )}

        <form onSubmit={handleSubmit}>
        <div className='mx-20'>
            <h2 className="text-2xl text-white text-center font-semibold my-3">Upload Video</h2>
            <label htmlFor="videoUpload" 
            className="block cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 px-4 my-3 rounded-lg w-1/4 text-center mx-20"
            >
            {videoFile ? (
                <p>{videoFile.name}</p>
            ) : (
                <p>Select Video</p>
            )}
            <input id="videoUpload" type="file" className="hidden" onChange={handleVideoFileChange} />
            </label>
        
        <label htmlFor="title" className='text-white font-semibold mx-20'>Title of Video
        </label> <br />
        <input type="text" 
            className='bg-gray-600 outline-none text-white p-2 px-5 mb-3 rounded-lg w-2/3 mx-20' 
            id='title'
            onChange={handleVideoTitleChange}
        /> <br />

        <label htmlFor="desc" className='text-white font-semibold my-3 mx-20'>Description of Video</label> <br />
        <textarea type="text" 
            className='bg-gray-600 outline-none text-white p-2 px-5 mx-20 mb-3 rounded-lg w-2/3' 
            id='desc'
            onChange={handleVideoDescriptionChange}
        />

        <label htmlFor="thubmnailUpload" 
            className="block cursor-pointer bg-red-400 hover:bg-red-600 text-white py-2 px-4 mx-20 rounded-lg w-1/4 text-center"
        >
            {thubmnailFile ? (
                <p>{thubmnailFile.name}</p>
            ) : (
                <p>Select Thumbnail</p>
            )}
            <input id="thubmnailUpload" type="file" className="hidden" onChange={handleThubmnailFileChange} />
        </label>
        <button type="submit" className="my-6 bg-blue-500 hover:bg-blue-700 text-white py-2 px-5 mx-20 rounded-lg">Upload</button>
        </div>
        </form>
    </div>
    );
};

export default VideoUpload
