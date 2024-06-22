import React from 'react'

function VideoProgressBar({ currentTime, duration, onClick }) {
    const progress = (currentTime / duration) * 100 || 0;
    return (
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden" onClick={onClick}>
            <div
                className="h-full bg-red-600"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    )
}

export default VideoProgressBar