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
        <div className="relative overflow-hidden m-3 cursor-pointer w-full max-w-md">
            {/* Image */}
            <div className="relative aspect-[16/9] w-full">
                <img className="absolute inset-0 w-full h-full object-cover" src={imageUrl} alt="Card Image" />

                {/* Timestamp Overlay */}
                <div className="absolute bottom-1 right-1 bg-gray-800/60 text-white text-xs font-semibold px-2 rounded">
                    <p className="text-sm text-white">{secondsToTime(timestamp)}</p>
                </div>
            </div>
            {/* <img className="absolute inset-0 w-full h-full object-cover" src={imageUrl} alt="Card Image" /> */}

            {/* Timestamp Overlay */}
            {/* {makeVideoTitle().length <= 30 ? ( */}
            {/* <div className="absolute bottom-3 right-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                <p className="text-sm text-white">{secondsToTime(timestamp)}</p>
            </div> */}
            {/* ) : (
                <div className="absolute bottom-20 right-0 text-black px-1 my-10 mx-3 rounded-md bg-gray-700">
                    <p className="text-sm text-white">{secondsToTime(timestamp)}</p>
                </div>
            )} */}

            {/* Video Info */}
            <div className='flex gap-3 mt-3 items-start'>
                {/* <div className='w-1/6'> */}
                {/* Profile */}
                    <img className='w-10 h-10 rounded-full' src={profile} alt="" />
                {/* </div> */}
                {/* Video Details */}
                {/* <div className='w-5/6'> */}
                <div className='flex-1 min-w-0'>
                    <p className='text-base font-semibold text-white'>{makeVideoTitle()}</p>
                    <p className='text-sm text-gray-300 items-center gap-1'>{chennelName} <i className="fa-solid fa-circle-check fa-xs text-gray-300"></i></p>
                    <p className='text-sm text-gray-300 truncate'>{views} views . {timeSinceUpload(timeUpload)}</p>
                </div>
            </div>
        </div>
    )
}

export default Card