import { useParams } from "react-router-dom"
import { VideoPlayer } from "../index.js"
import { secondsToTime } from "../../utils/timeConversion.js"

const About = () => {
    const {id} = useParams()
    return (
        <div className="flex py-2">
            {/* First column (2/3 width) */}
            <div className="w-2/3 px-3">
                <VideoPlayer videoSrc={"http://res.cloudinary.com/owaisamu20/video/upload/v1707903573/videos_upload/ehzbmmlbaqsfz0i75jkx.mp4"} />
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

export default About