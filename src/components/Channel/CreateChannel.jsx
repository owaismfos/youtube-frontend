import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addChannelStatus } from "../../features/auth/authSlice";
import channelService from "../../api/channelapi";
import { FancyImageUpload } from "./FancyImageUpload";

// export const CreateChannel = () => {
//     const [channelAvatar, setChannelAvatar] = useState(null)
//     const [channelBgImage, setChannelBgImage] = useState(null)
//     const [channelName, setChannelName] = useState('')
//     const [channelDescription, setChannelDescription] = useState('')
//     const [loading, setLoading] = useState(false)

//     const userStatus = useSelector(state => state.auth.status)

//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setLoading(true)
//         // console.log(channelAvatar)
//         const formData = new FormData()
//         formData.append('channelAvatar', channelAvatar)
//         formData.append('channelBackground', channelBgImage)
//         formData.append('channelName', channelName)
//         formData.append('channelDescription', channelDescription)
//         console.log(formData.channelAvatar)
//         console.log(channelAvatar)
//         const channelResponse = await channelService.createChannel(formData)
//         if (channelResponse.success) {
//             dispatch(addChannelStatus(true))
//             // navigate('/dashboard')
//         }
//         console.log(channelResponse)
//         setLoading(false)
//     }

//     useEffect(() => {
//         if (!userStatus) {
//             alert('Please Login')
//             navigate('/login')
//         }
//     }, [])

//     return (
//         <div className="py-4 mx-20 h-screen">
//             {loading &&
//             <div class="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
//                 <p>Loading...</p>
//                 <div class="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
//             </div>

//             }

//             {/* {videoUploadCode && (
//             <>
//             {videoUploadCode === 201 ? (
//                 <div className="mt-2 bg-green-500 py-3 text-white font-semibold px-20 mx-20">
//                 <p className='mx-20'>{videoUploadMessage}</p>
//                 </div>
//             ) : (
//                 <div className="mt-2 bg-red-500 py-3 text-white font-semibold px-20 mx-20">
//                 <p className='mx-20'>{videoUploadMessage}</p>
//                 </div>
//             )}
//             </>
//             )} */}

//             <form onSubmit={handleSubmit}>
//                 <div className='mx-20'>
//                     <h2 className="text-2xl text-white text-center font-semibold my-3">Create Your Channel</h2>

//                     <label htmlFor="title" className='text-white font-semibold mx-20'>Your Channel Name <span>*</span>
//                     </label> <br />
//                     <input type="text"
//                         className='bg-gray-500 outline-none text-white p-2 px-5 mb-3 rounded-lg w-2/3 mx-20'
//                         id='title'
//                         onChange={(e) => setChannelName(e.target.value)}
//                         value={channelName}
//                     /> <br />
//                     <label htmlFor="title" className='text-white font-semibold mx-20'>Your Channel Handle <span>*</span>
//                     </label> <br />
//                     <input type="text"
//                         className='bg-gray-600 outline-none text-gray-300 p-2 px-5 mb-3 rounded-lg w-2/3 mx-20'
//                         id='title'
//                         value={channelName.replaceAll(" ", "")}
//                         readOnly
//                     /> <br />

//                     <label htmlFor="desc" className='text-white font-semibold my-3 mx-20'>Description of Your Channel</label> <br />
//                     <textarea type="text"
//                         className='bg-gray-500 outline-none text-white p-2 px-5 mx-20 mb-3 rounded-lg w-2/3'
//                         id='desc'
//                         onChange={(e) => setChannelDescription(e.target.value)}
//                         value={channelDescription}
//                     />

//                     <label htmlFor="channelImage"
//                     className="block cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 px-4 my-3 rounded-lg w-1/4 text-center mx-20"
//                     >
//                     {channelAvatar ? (
//                         <p>{channelAvatar.name}</p>
//                     ) : (
//                         <p>Select Channel Avatar</p>
//                     )}
//                     <input id="channelImage" type="file" name="channelImage" className="hidden" onChange={(e) => setChannelAvatar(e.target.files[0])} />
//                     </label>

//                     <label htmlFor="channelBackgroundImage"
//                         className="block cursor-pointer bg-red-400 hover:bg-red-600 text-white py-2 px-4 mx-20 rounded-lg w-1/4 text-center"
//                     >
//                         {channelBgImage ? (
//                             <p>{channelBgImage.name}</p>
//                         ) : (
//                             <p>Select Channel Background Image</p>
//                         )}
//                         <input id="channelBackgroundImage" type="file" name="channelBackgroundImage" className="hidden" onChange={(e) => setChannelBgImage(e.target.files[0])} />
//                     </label>
//                     <button type="submit" className="my-6 bg-red-700 hover:bg-red-600 text-white py-2 px-5 mx-20 rounded-lg">Create</button>
//                 </div>
//             </form>
//         </div>
//     )
// }

const variants = {
  enter: (direction) => ({
    x: direction === "next" ? 300 : -300,
    opacity: 0,
    position: "absolute",
    width: "100%",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
    width: "100%",
  },
  exit: (direction) => ({
    x: direction === "next" ? -300 : 300,
    opacity: 0,
    position: "absolute",
    width: "100%",
  }),
};

export const CreateChannel = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("next");

  // Form fields
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false)

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  // Navigation handlers
  const nextStep = async () => {
    if (step < 4) {
      setDirection("next");
      setStep(step + 1);
    } else {
      // Final submit logic here
      setLoading(true)
      // console.log(channelAvatar)
      const formData = new FormData()
      formData.append('channelAvatar', avatar)
      formData.append('channelBackground', banner)
      formData.append('channelName', channelName)
      formData.append('channelDescription', description)
      console.log(formData.avatar)
      console.log(avatar)
      const channelResponse = await channelService.createChannel(formData)
      if (channelResponse.success) {
        dispatch(addChannelStatus(true))
      }
      console.log(channelResponse)
        // await sleep(2000);
      setLoading(false)
      alert("Channel Created!");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection("back");
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-8 pb-20 max-h-[90vh] flex flex-col"
        style={{ paddingBottom: "0" }} // space for buttons (approx button height + padding)
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-100">
          Create Your Channel
        </h1>

        {/* Step progress */}
        <p className="text-gray-400 mb-6">Step {step} of 4</p>
        <div className="w-full bg-gray-700 rounded h-2 mb-8">
          <div
            className="bg-green-600 h-2 rounded"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <div className="overflow-y-auto flex-grow mb-20">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="min-h-[300px]" // or 350-400px, adjust as needed
          >
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Channel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-green-600 focus:outline-none text-gray-100"
                    placeholder="Enter your channel name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-300">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-green-600 focus:outline-none text-gray-100 resize-none"
                    rows={4}
                    maxLength={200}
                    placeholder="Describe your channel"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    {description.length} / 200 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <FancyImageUpload
                  label="Channel Banner"
                  aspectRatio={27 / 9}
                  onChange={setBanner}
                  className="w-full max-w-md" // max width ~ 28rem = 448px
                />
                <FancyImageUpload
                  label="Profile Picture"
                  aspectRatio={1}
                  onChange={setAvatar}
                  className="w-full max-w-xs" // max width ~ 28rem = 448px
                />
              </div>
            )}

            {/* Step 3 - Placeholder */}
            {step === 3 && (
              <div className="text-gray-300">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <p>
                  Here you can add channel privacy, categories, social links
                  etc.
                </p>
                {/* Add your inputs here */}
              </div>
            )}

            {/* Step 4 - Review */}
            {step === 4 && (
              <div className="text-gray-300 space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  Review Your Channel
                </h2>
                <p>
                  <strong>Name:</strong> {channelName || "-"}
                </p>
                <p>
                  <strong>Channel Handle:</strong> {channelName.replaceAll(" ", "") || "-"}
                </p>
                <p>
                  <strong>Description:</strong> {description || "-"}
                </p>
                <div>
                  <strong>Banner Preview:</strong>
                  {banner ? (
                    <img
                      src={URL.createObjectURL(banner)}
                      alt="Banner Preview"
                      className="mt-2 rounded max-h-40 object-contain"
                    />
                  ) : (
                    <p>No banner uploaded.</p>
                  )}
                </div>
                <div>
                  <strong>Avatar Preview:</strong>
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Avatar Preview"
                      className="mt-2 w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <p>No avatar uploaded.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Navigation buttons inside container, absolutely positioned */}
        <div className="absolute bottom-4 left-0 w-full px-8 flex justify-between rounded-b-lg shadow-t">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="bg-gray-700 px-6 py-2 rounded disabled:opacity-50 transition-colors hover:bg-gray-600"
          >
            Back
          </button>
          {loading &&
            <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>

        }
          <button
            onClick={nextStep}
            disabled={step === 1 && !channelName.trim()}
            className="bg-green-600 px-6 py-2 rounded disabled:opacity-50 transition-colors hover:bg-green-700"
          >
            {step === 4 ? "Create Channel" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
