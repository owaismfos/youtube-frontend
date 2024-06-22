import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addChannelStatus } from '../../features/auth/authSlice'
import channelService from '../../api/channelapi'


export const CreateChannel = () => {
    const [channelAvatar, setChannelAvatar] = useState(null)
    const [channelBgImage, setChannelBgImage] = useState(null)
    const [channelName, setChannelName] = useState('')
    const [channelDescription, setChannelDescription] = useState('')
    const [loading, setLoading] = useState(false)

    const userStatus = useSelector(state => state.auth.status)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // console.log(channelAvatar)
        const formData = new FormData()
        formData.append('channelAvatar', channelAvatar)
        formData.append('channelBackground', channelBgImage)
        formData.append('channelName', channelName)
        formData.append('channelDescription', channelDescription)
        console.log(formData.channelAvatar)
        console.log(channelAvatar)
        const channelResponse = await channelService.createChannel(formData)
        if (channelResponse.success) {
            dispatch(addChannelStatus(true))
            // navigate('/dashboard')
        }
        console.log(channelResponse)
        setLoading(false)
    }

    useEffect(() => {
        if (!userStatus) {
            alert('Please Login')
            navigate('/login')
        }
    }, [])

    return (
        <div className="py-4 mx-20 h-screen">
            {loading && 
            <div class="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
                <p>Loading...</p>
                <div class="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
            </div>
            
            }

            {/* {videoUploadCode && (
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
            )} */}

            <form onSubmit={handleSubmit}>
                <div className='mx-20'>
                    <h2 className="text-2xl text-white text-center font-semibold my-3">Create Your Channel</h2>
                
                    <label htmlFor="title" className='text-white font-semibold mx-20'>Your Channel Name <span>*</span>
                    </label> <br />
                    <input type="text" 
                        className='bg-gray-500 outline-none text-white p-2 px-5 mb-3 rounded-lg w-2/3 mx-20' 
                        id='title'
                        onChange={(e) => setChannelName(e.target.value)}
                        value={channelName}
                    /> <br />
                    <label htmlFor="title" className='text-white font-semibold mx-20'>Your Channel Handle <span>*</span>
                    </label> <br />
                    <input type="text" 
                        className='bg-gray-600 outline-none text-gray-300 p-2 px-5 mb-3 rounded-lg w-2/3 mx-20' 
                        id='title'
                        value={channelName.replaceAll(" ", "")}
                        readOnly
                    /> <br />

                    <label htmlFor="desc" className='text-white font-semibold my-3 mx-20'>Description of Your Channel</label> <br />
                    <textarea type="text" 
                        className='bg-gray-500 outline-none text-white p-2 px-5 mx-20 mb-3 rounded-lg w-2/3' 
                        id='desc'
                        onChange={(e) => setChannelDescription(e.target.value)}
                        value={channelDescription}
                    />
                    
                    <label htmlFor="channelImage" 
                    className="block cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 px-4 my-3 rounded-lg w-1/4 text-center mx-20"
                    >
                    {channelAvatar ? (
                        <p>{channelAvatar.name}</p>
                    ) : (
                        <p>Select Channel Avatar</p>
                    )}
                    <input id="channelImage" type="file" name="channelImage" className="hidden" onChange={(e) => setChannelAvatar(e.target.files[0])} />
                    </label>

                    <label htmlFor="channelBackgroundImage" 
                        className="block cursor-pointer bg-red-400 hover:bg-red-600 text-white py-2 px-4 mx-20 rounded-lg w-1/4 text-center"
                    >
                        {channelBgImage ? (
                            <p>{channelBgImage.name}</p>
                        ) : (
                            <p>Select Channel Background Image</p>
                        )}
                        <input id="channelBackgroundImage" type="file" name="channelBackgroundImage" className="hidden" onChange={(e) => setChannelBgImage(e.target.files[0])} />
                    </label>
                    <button type="submit" className="my-6 bg-red-700 hover:bg-red-600 text-white py-2 px-5 mx-20 rounded-lg">Create</button>
                </div>
            </form>
        </div>
    )
}
