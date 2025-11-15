import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addChannelStatus, addUserInfo } from "../../features/auth/authSlice";
import channelService from "../../api/channelapi";
import { FancyImageUpload } from "./FancyImageUpload";
import authService from "../../api/userapi";

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

  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch()

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
      formData.append('avatar', avatar)
      formData.append('banner', banner)
      formData.append('name', channelName)
      formData.append('description', description)
      formData.append('handle', channelName.replaceAll(" ", ""))
      const channelResponse = await channelService.createChannel(formData)
      if (channelResponse.success) {
        dispatch(addChannelStatus(true))
        const userResponse = await authService.userProfile();
            console.log(userResponse)
            // setUser(userResponse.data);
            dispatch(addUserInfo(userResponse.data));
            console.log(userResponse.data);
      }
      console.log(channelResponse)
        // await sleep(2000);
      setLoading(false)
      alert(channelResponse?.message);
      navigate(`/channel/${userInfo?.id}?unique_id=${userInfo?.uniqueId}&handle=${userInfo?.channelHandle}`)
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
                  file={banner}
                  onChange={setBanner}
                  className="w-full max-w-md" // max width ~ 28rem = 448px
                />
                <FancyImageUpload
                  label="Profile Picture"
                  aspectRatio={1}
                  file={avatar}
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
