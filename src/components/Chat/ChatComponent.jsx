import { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import store from '../../app/store';
import { formatDate } from '../../utils/timeConversion.js';

const ChatComponent = ({ activeUser, onClose }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState(null)
  const [userStatus, setUserStatus] = useState({})
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null);  // For file preview
  const [fileName, setFileName] = useState('');         // To store the file name
  const [fileSize, setFileSize] = useState('');   
  const [isUploading, setIsUploading] = useState(false);

  const chatContainerRef = useRef(null)

  const state = store.getState()
  const token = state.auth.userData?.accessToken
  const userId = state.auth.userData?.id
  console.log("UserId: ", userId)

  // const SOCKET_URL = serverUrl = process.env.WEBSOCKET_URL

  const handleSend = () => {
    setIsUploading(true)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const mediaType = file.type.startsWith('image/') ? 'image' : 'video'
        const data = { 
          type: 'media',
          mediaType: mediaType,
          textData: input,
          mediaFile: Array.from(new Uint8Array(reader.result)), 
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
        action: 'post_message' 
      }
      ws.send(JSON.stringify(data))
    }
    setInput('')
    setFile(null)
    handleRemovePreview()
  }

  // const handleClose = () => {
  //   isOpen = false; // Close the chat by setting isOpen to false
  // };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];  // Get the first selected file
    if (selectedFile) {
      setFile(selectedFile) // Set the selected file
      setFilePreview(URL.createObjectURL(selectedFile))
      setFileName(selectedFile.name); // Set file name
      setFileSize((selectedFile.size / 1024 / 1024).toFixed(2) + ' MB');
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

  const isVideoFile = (fileName) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']
    return videoExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))
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

  useEffect(() => {
    if (activeUser.id && token) {
      // Establish WebSocket connection when activeUser or token changes
      const socket = new WebSocket(`ws://localhost:8080/ws/chat/?receiverId=${activeUser.id}&token=${token}`);
      setWs(socket);

      socket.onopen = () => {
        console.log('WebSocket connection opened.');
        socket.send(JSON.stringify({ action: 'get_messages' }))
        socket.send(JSON.stringify({ action: 'user_status' }))
      };
      socket.onmessage = (event) => {
        // console.log('Received message from server: ', event.data);
        const messages = JSON.parse(event.data)
        console.log(messages)
        if (messages.action === 'get_messages'){
          console.log(messages.data)
          setMessages(messages.data)
        } else if (messages.data.action === 'new_message') {
          //console.log("newmessage: ", messages.data)
          setMessages((prevMessages) => [...prevMessages, messages.data.data])
        } else if (messages.data.action === 'user_status') {
          console.log(messages.data.data)
          setUserStatus(messages.data.data)
        } else if (messages.action === 'post_message') {
          console.log(messages.data.data)
          setIsUploading(false)
          handleRemovePreview()
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

  // console.log("Is Open: ", isOpen)
  // if (!isOpen) return null;

  return (
    <div className="flex flex-col h-[500px] w-full border border-gray-700 rounded-lg shadow-lg bg-gray-800 text-white space-2">
      <div
        key={activeUser.id}
        className="flex items-center p-2 cursor-pointer border-b"
      >
        {/* User Avatar */}
        <img
          src={activeUser.avatar || '/userdefault.png'}
          alt={activeUser.fullname}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="flex-1">
          <span className="block font-medium">{activeUser.fullname}</span>
          {/* Online Status or Last Active */}
          {userStatus?.isActive ? (
            <span className="flex items-center text-green-500 text-sm">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Online
            </span>
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
      <div className="flex-1 overflow-y-auto p-2" ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            key={message?.id}
            className={`flex my-2 ${
              message?.sender == userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`${
                message?.contentType == 'video' || message?.contentType == 'image' ? 'px-1' : 'px-4 py-2' // Remove padding if mediaFile exists
              } rounded-lg max-w-xs ${
                message?.sender == userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message?.contentType === 'video' && message?.mediaFile && (
                <div className="mt-2">
                  <video controls className="w-full rounded-lg">
                    <source src={message.mediaFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Check and render image based on media file extensions */}
              {message?.contentType === 'image' && message?.mediaFile && (
                <div className="mt-2">
                  <img
                    src={message.mediaFile}
                    alt="Message Media"
                    className="w-full h-auto rounded-lg"
                  />
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
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <FaSpinner className="animate-spin text-white" size={30} />
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
        <input
          type="text"
          className="flex-1 min-w-0 rounded-lg p-2 bg-gray-700 text-white outline-none border-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
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
