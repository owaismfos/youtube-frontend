import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux'
import { FaPaperclip, FaPaperPlane, FaSpinner, FaMicrophone, FaStopCircle } from 'react-icons/fa';
import ReactPlayer from 'react-player'
import store from '../../app/store';
import { formatDate } from '../../utils/timeConversion.js';
import { addUsersList } from '../../features/chat/chatSlice';


const ChatComponent = ({ activeUser, onClose }) => {
  const dispatch = useDispatch()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState(null)
  const [userStatus, setUserStatus] = useState({})
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)  // For file preview
  const [fileName, setFileName] = useState('')         // To store the file name
  const [fileSize, setFileSize] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)  // To track recording state
  // const [audioBlob, setAudioBlob] = useState(null)   // To store audio data
  const [recordingTime, setRecordingTime] = useState(0)  // Timer for recording
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  // const [typingUser, setTypingUser] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isUploaded, setIsUploaded] = useState(true)

  const mediaRecorderRef = useRef(null)   // To hold MediaRecorder instance
  const audioChunksRef = useRef([])   // To collect audio chunks
  const chatContainerRef = useRef(null)
  const timerRef = useRef(null) // Timer reference for auto-stop

  const peerRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)

  const state = store.getState()
  const token = state.auth.userData?.accessToken
  const userId = state.auth.userData?.id
  // console.log("UserId: ", userId)

  const MAX_RECORDING_DURATION = 10 // Max recording duration in seconds


  // const SOCKET_URL = serverUrl = process.env.WEBSOCKET_URL

  const handleSend = async () => {
    setIsUploading(true)
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        let mediaType = ''
        let duration = 0
        if (file.type.startsWith('image/')) {
          mediaType = 'image'
        } else if (file.type.startsWith('video/')) {
          mediaType =  'video'
          duration = await getVideoDuration(file)
          // setVideoDuration(duration)
          // console.log("Video Duration state var: ", videoDuration)
          // console.log("Video Duration: ", duration)
        } else {
          mediaType = 'audio'
        }
        const data = { 
          type: 'media',
          mediaType: mediaType,
          textData: input,
          mediaFile: Array.from(new Uint8Array(reader.result)), 
          duration: duration,
          action: 'post_message'
        }
        console.log("post_data", data)
        ws.send(JSON.stringify(data))
        // displayMessage(data, 'sent');
      };
      reader.readAsArrayBuffer(file)
    } else {
      const data = { 
        type: 'text',
        textData: input, 
        action: 'post_message',
        mediaType: 'text'
      }
      ws.send(JSON.stringify(data))
    }
    setInput('')
    setFile(null)
    handleRemovePreview()
  }


  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        video.preload = "metadata"

        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src) // Free memory
            resolve(video.duration) // Returns duration in seconds
        };

        video.onerror = function () {
            reject("Error loading video")
        };

        video.src = URL.createObjectURL(file)
    })
  }

  const handleRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio : true})
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = [] // reset chunks

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"})
        const fileName = `recording_${Date.now()}.wav`
        setFile(audioBlob)
        setFilePreview(URL.createObjectURL(audioBlob))
        setFileName(fileName) // Set file name
        setFileSize((audioBlob.size / 1024 / 1024).toFixed(2) + ' MB')
        stream.getTracks().forEach((track) => track.stop())  // stop all track
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0) // Reset the timer

      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime + 1 >= MAX_RECORDING_DURATION) {
            handleRecordStop()
          }
          return prevTime + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  const handleRecordStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      clearInterval(timerRef.current) // Clear the timer
      setIsRecording(false)
      handleRemovePreview()
      console.log("Audio Data: ", file)
      console.log("File Name: ", fileName)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];  // Get the first selected file
    if (selectedFile) {
      setFile(selectedFile) // Set the selected file
      setFilePreview(URL.createObjectURL(selectedFile))
      setFileName(selectedFile.name) // Set file name
      setFileSize((selectedFile.size / 1024 / 1024).toFixed(2) + ' MB')
      console.log("File selected:", selectedFile); // Check the file in console
    } else {
      console.log("No file selected");
    }  // Set selected file
  }

  const handleRemovePreview = () => {
    setFilePreview(null)
    setFileName('')
    setFileSize('')
  }

  const handleFocus = () => {
    ws.send(JSON.stringify({action: 'type_message', isTyped: true, typingUser: activeUser.id}))
    setIsFocused(true)
  }

  const handleBlur = () => {
    ws.send(JSON.stringify({action: 'type_message', isTyped: false, typingUser: activeUser.id}))
    setIsFocused(false)
  }

  const isVideoFile = (fileName) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']
    return videoExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
  }

  const isAudioFile = (fileName) => {
    if (!fileName || typeof fileName !== "string") return false
    const audioExtensions = [".mp3", ".wav", ".ogg", ".aac"]
    return audioExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
  }

  const getVideoMimeType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    switch (ext) {
      case 'mp4':
        return 'video/mp4'
      case 'webm':
        return 'video/webm'
      case 'avi':
        return 'video/x-msvideo'
      case 'mov':
        return 'video/quicktime'
      case 'mkv':
        return 'video/x-matroska'
      case 'flv':
        return 'video/x-flv'
      case 'wmv':
        return 'video/x-ms-wmv'
      default:
        return 'video/mp4' // Default to mp4 if type is unknown
    }
  }

  const handleOffer = async (offer) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    const peer = new RTCPeerConnection();
    peerRef.current = peer;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({ action: 'call', type: "ice-candidate", candidate: event.candidate }));
        }
    };

    peer.ontrack = (event) => {
        remoteStreamRef.current.srcObject = event.streams[0];
    };

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.send(JSON.stringify({ action: 'call', type: "answer", answer }));
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    const peer = new RTCPeerConnection();
    peerRef.current = peer;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({ action: 'call', type: "ice-candidate", candidate: event.candidate }));
        }
    };

    peer.ontrack = (event) => {
        remoteStreamRef.current.srcObject = event.streams[0];
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.send(JSON.stringify({ action: 'call', type: "offer", offer }));
  };

  useEffect(() => {
    if (activeUser.id && token) {
      // Establish WebSocket connection when activeUser or token changes
      const socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}/?receiverId=${activeUser.id}&token=${token}`);
      setWs(socket);

      socket.onopen = () => {
        console.log('WebSocket connection opened.');
        socket.send(JSON.stringify({ action: 'get_messages' }))
        socket.send(JSON.stringify({ action: 'user_status' }))
      };
      socket.onmessage = async (event) => {
        console.log('Received message from server: ', event.data);
        const messages = JSON.parse(event.data)
        console.log(messages)
        if (messages.action === 'get_messages'){
          console.log(messages.data)
          setMessages(messages.data)
        } else if (messages.data.action == 'type_message' && messages.data.typingUser !== activeUser.id) {
          setIsTyping(messages.data.isTyped)
          setTypingUser(messages.data.typingUser)
        } else if (messages.data.action === 'new_message') {
          //console.log("newmessage: ", messages.data)
          setIsUploading(false)
          setMessages((prevMessages) => [...prevMessages, messages.data.data])
        } else if (messages.data.action === 'user_status') {
          console.log(messages.data.data)
          setUserStatus(messages.data.data)
        } else if (messages.action === 'post_message') {
          console.log(messages.data.data)
          setIsUploaded(false)
          // setIsUploading(false)
          handleRemovePreview()
        } else if (messages.data.action === 'send_progress') {
            setProgress(messages.data.progress)
            console.log("Progress: ", progress)
            if (messages.data.progress === 100) {
              setIsUploading(false)
            }
        } else if (messages.data.action === 'call') {
          console.log("Call data: ", messages.data)
          if (messages.data.type === 'offer') {
            await handleOffer(data.offer);
          } else if (messages.data.type === 'answer') {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer))
          } else if (messages.data.type === 'ice-candidate') {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          }
        } else if (messages.data.action === 'user_list') {
          console.log("userList: ", messages.data)
          dispatch(addUsersList(messages.data.data))
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      socket.onerror = (error) => {
        console.log('WebSocket error: ', error);
      };

      console.log("Messages:", messages)
      console.log("Message Type: ", typeof messages)
      // Cleanup WebSocket connection when component unmounts or activeUser changes
      return () => {
        socket.close();
      };
    }
  }, [activeUser.id, token]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-full border border-gray-700 rounded-lg shadow-lg bg-gray-800 text-white space-2">
      <div
        key={activeUser.id}
        className="flex items-center p-2 cursor-pointer border-b"
      >
        {/* User Avatar */}
        <img
          src={activeUser.avatarUrl || '/userdefault.png'}
          alt={activeUser.fullname}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="flex-1">
          <span className="block font-medium">{activeUser.fullname}</span>
          {/* Online Status or Last Active */}
          {userStatus?.isActive ? (
            <>
            {isTyping ? (
              <span className="flex items-center text-green-500 text-sm">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                typing...
              </span>
            ) : (
              <span className="flex items-center text-green-500 text-sm">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </span>
            )}
            </>
          ) : (
            <span className="text-gray-400 text-[12px]">
              Last active: {userStatus ? formatDate(userStatus?.lastActive) : 'N/A'}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 rounded-full p-1 transition duration-300"
        >
          x {/* Close icon */}
        </button>
      </div>
      {/* <div className="p-4 font-bold border-b border-gray-700">Chat with {activeUser.fullname}</div> */}
      <div className="message-container flex-1 overflow-y-auto p-2" ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            key={message?.id}
            className={`flex my-2 ${
              message?.sender == userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`${
                message?.contentType == 'video' 
                || message?.contentType == 'image' 
                || message?.contentType == 'audio' ? 'px-1' : 'px-4 py-2' // Remove padding if mediaFile exists
              } rounded-lg max-w-xs ${
                message?.sender == userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message?.contentType == 'video' && message?.mediaFile && (
                <div className="mt-2">
                  <video controls className="w-full rounded-lg">
                    <source src={message.mediaFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Check and render image based on media file extensions */}
              {message?.contentType == 'image' && message?.mediaFile && (
                <div className="mt-2">
                  <img
                    src={message.mediaFile}
                    alt="Message Media"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

              {/* Render audio */}
              {message?.contentType === 'audio' && message?.mediaFile && (
                <div className="">
                  {/* <ReactPlayer
                    url={message.mediaFile}          // The URL of the audio file
                    playing={false}                  // Whether the audio is auto-playing
                    controls={true}                  // Show controls (play, pause, etc.)
                    width="100%"                     // Ensure it stretches the full width
                    height="40px"                    // Set a fixed height
                    className="rounded-lg" // Optional custom styling
                  /> */}
                  <audio controls className="rounded-lg py-[10px]">
                    <source src={message.mediaFile} type="audio/mp3" />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}
              {message?.content}
              <div className="text-[10px] text-gray-400 justify-end">
                {formatDate(message.insertedAt)}
              </div>
            </div>
          </div>
        ))}
        {isUploading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center space-y-4 p-4">
            {/* Spinner */}
            <FaSpinner className="animate-spin text-white" size={30} />

            {isUploaded ? (
              <p className="text-white">Uploading...</p>
            ) : (
              <>
              {/* Progress Bar */}
              <p className="text-white">Compression...</p>
              <div className="w-3/4 bg-gray-500 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}  // Dynamic width update
                ></div>
              </div>
            
              {/* Show Percentage */}
              <p className="text-white">{progress}%</p>
              </>
            )}
          </div>
        )}
      </div>

      {filePreview && (
        <div className="flex items-center p-2 border-t border-gray-700 bg-transparent">
          <div className="flex-1">
            {/* Image or Video Preview */}
            {filePreview && isVideoFile(fileName) ? (
              <video controls className="w-full rounded-lg">
                <source src={filePreview} type={getVideoMimeType(fileName)} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={filePreview} alt="Preview" className="w-full rounded-lg" />
            )}

            {/* File Info */}
            <div className="text-gray-400 text-sm mt-2">
              <p>{fileName}</p>
              <p>{fileSize}</p>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemovePreview}
            className="ml-3 top-2 right-2 text-gray-400 hover:text-gray-200"
          >
            X
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="flex items-center border-t border-gray-700 p-4 gap-2">
        {/* File Select Icon */}
        <label htmlFor="file-input" className="cursor-pointer flex-shrink-0">
          <FaPaperclip className="text-gray-400 hover:text-gray-200" size={20} />
        </label>
        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Mic and Stop Recording Icon */}
        {!isRecording ? (
          <button
            className="cursor-pointer flex-shrink-0 text-gray-400 hover:text-gray-200"
            onClick={handleRecordStart}
          >
            <FaMicrophone size={20} />
          </button>
        ) : (
          <button
            className="cursor-pointer flex-shrink-0 text-red-500 hover:text-red-700"
            onClick={handleRecordStop}
          >
            <FaStopCircle size={20} />
          </button>
        )}

        {isRecording && (
          <span className="text-sm text-gray-400">{recordingTime}s</span>
        )}

        <input
          type="text"
          className="flex-1 min-w-0 rounded-lg p-2 bg-gray-700 text-white outline-none border-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Send Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex justify-center items-center"
          onClick={handleSend}
        >
          <FaPaperPlane className="text-white" size={20} />
        </button>
      </div>
    </div>
    // </div>
  );
};

export default ChatComponent;
