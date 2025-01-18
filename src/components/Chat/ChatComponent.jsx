import { useState, useEffect, useRef } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import store from '../../app/store';

const ChatComponent = ({ activeUser, isOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  // const[isOpen, setIsOpen] = useState(true);
  const [file, setFile] = useState(null);

  const chatContainerRef = useRef(null);

  const state = store.getState();
  const token = state.auth.userData?.accessToken;
  const userId = state.auth.userData?.id;

  // const SOCKET_URL = serverUrl = process.env.WEBSOCKET_URL

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
  
    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      // Return the time in HH:MM format
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } 
    // Check if the date is yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      // Otherwise, return the full date in MM/DD/YYYY format and time in HH:MM format
      const dateFormatted = date.toLocaleDateString();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${dateFormatted}, ${hours}:${minutes}`;
    }
  };

  const handleSend = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const mediaType = file.type.startsWith('image/') ? 'image' : 'video'
        const data = { 
          type: 'media',
          mediaType: mediaType,
          textData: input,
          mediaFile: reader.result, 
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
  }

  const handleClose = () => {
    isOpen = false; // Close the chat by setting isOpen to false
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];  // Get the first selected file
    if (selectedFile) {
      setFile(selectedFile);  // Set the selected file
      console.log("File selected:", selectedFile); // Check the file in console
    } else {
      console.log("No file selected");
    }  // Set selected file
  };

  useEffect(() => {
    if (activeUser.id && token) {
      // Establish WebSocket connection when activeUser or token changes
      const socket = new WebSocket(`ws://localhost:8080/ws/chat/?receiverId=${activeUser.id}&token=${token}`);
      setWs(socket);

      socket.onopen = () => {
        console.log('WebSocket connection opened.');
        socket.send(JSON.stringify({ action: 'get_messages' }));
      };
      socket.onmessage = (event) => {
        // console.log('Received message from server: ', event.data);
        const messages = JSON.parse(event.data);
        console.log(messages)
        if (messages.action === 'get_messages'){
          console.log(messages.data)
          setMessages(messages.data)
        } else if (messages.data.action === 'new_message') {
          //console.log("newmessage: ", messages.data)
          setMessages((prevMessages) => [...prevMessages, messages.data.data]);
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

  console.log("Is Open: ", isOpen)
  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-[500px] w-full border border-gray-700 rounded-lg shadow-lg bg-gray-800 text-white space-2">
      <div
        key={activeUser.id}
        className="flex items-center p-2 cursor-pointer border-b"
      >
        <img
          src={activeUser.avatar || '/userdefault.png'}
          alt={activeUser.fullname}
          className="w-10 h-10 rounded-full mr-4"
        />
        <span>{activeUser.fullname}</span>
        <button
          onClick={handleClose}
          className="ml-auto text-gray-400 hover:bg-gray-900 hover:rounded-full px-2"
        >
          × {/* Close icon */}
        </button>
      </div>
      {/* <div className="p-4 font-bold border-b border-gray-700">Chat with {activeUser.fullname}</div> */}
      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            key={message?.id}
            className={`flex my-2 ${
              message?.sender === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                message?.sender === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message?.content}
              <div className="text-[10px] text-gray-400 justify-end">
                {formatDate(message.insertedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="flex items-center border-t border-gray-700 p-4">
        {/* File Select Icon */}
        <label htmlFor="file-input" className="cursor-pointer">
          <FaPaperclip className="text-gray-400 hover:text-gray-200 mr-3" size={20} />
        </label>
        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Message Input */}
        <input
          type="text"
          className="flex-1 rounded-lg p-2 bg-gray-700 text-white outline-none border-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
