import React, { useEffect, useState } from 'react'
import { timeSinceUpload, secondsToTime } from '../../utils/timeConversion.js'

const Card = ({ imageUrl, title, views, timestamp, profile, chennelName, timeUpload }) => {
    const [videoTitle, setVideoTitle] = useState("")

    const makeVideoTitle = () => {
        if (title.length > 40) {
            return title.substring(0, 50) + "..."
        } else {
            return title
        }
    }
   
    return (
        <div className="relative max-w-md rounded-lg overflow-hidden m-3 cursor-pointer">
            {/* Image */}
            <img className="w-full h-52 sm:h-52 object-cover rounded-lg" src={imageUrl} alt="Card Image" />

            {/* Overlay */}
            {makeVideoTitle().length <= 30 ? (
                <div className="absolute bottom-14 right-0 text-black px-1 my-10 mx-3 rounded-md bg-gray-700">
                    <p className="text-sm text-white">{secondsToTime(timestamp)}</p>
                </div>
            ) : (
                <div className="absolute bottom-20 right-0 text-black px-1 my-10 mx-3 rounded-md bg-gray-700">
                    <p className="text-sm text-white">{secondsToTime(timestamp)}</p>
                </div>
            )}
            <div className='flex my-2'>
                <div className='w-1/6'>
                    <img className='w-10 h-10 rounded-full' src={profile} alt="" />
                </div>
                <div className='w-5/6'>
                    <p className='text-lg font-semibold text-white'>{makeVideoTitle()}</p>
                    <p className='text-sm text-gray-300'>{chennelName} <i className="fa-solid fa-circle-check fa-xs text-gray-300"></i></p>
                    <p className='text-sm text-gray-300'>{views} views . {timeSinceUpload(timeUpload)}</p>
                </div>
            </div>
        </div>
    )
}

export default Card