import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ForgotPassword, ChatComponent, Header, Home, About, Subscription, Video, Login, Register, VideoUpload, Channel, CreateChannel } from './components/index.js'
import authService from './api/userapi.js'
import { login } from './features/auth/authSlice.js';
import { addUsersList } from './features/chat/chatSlice.js'
import { updateReduxState } from './utils/tokenHandle.js'
// import ChatComponent from './ChatComponent';

function App() {
    const userStatus = useSelector(state => state.auth.status)

    const [isOpen, setIsOpen] = useState(false)
    const [activeUser, setActiveUser] = useState(null)
    // const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const dispatch = useDispatch()

    const users = useSelector(state => state.usersList.usersList)

    const handleUserClick = (user) => {
      setActiveUser(user)
    };

    const toggleChatSection = () => {
      setIsOpen(!isOpen)
    }

    const getUsersList = async () => {
      try {
        if (localStorage.getItem('authToken')) {
          const res = await authService.userList();
          console.log('Users: ', res.data)  // Use res.data to get the response body
          // setUsers(res.data)
          dispatch(addUsersList(res.data))
        }
      } catch (error) {
        console.error('Failed to fetch users', error)
      }
    }

    const getUserSearch = async (q) => {
      try {
        setIsLoading(true)
        const res = await authService.userSearch(q)
        console.log('Users: ', res.data)  // Use res.data to get the response body
        setSearchResults(res.data)
        // console.log()
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch users', error)
      }
    }

    const closeChat = () => {
      setActiveUser(null)
    }

    useEffect(() => {
      if (!userStatus && localStorage.getItem('authToken')) {
        updateReduxState(dispatch)
      }
      getUsersList();
    }, [userStatus])

    useEffect(() => {
      if (query.length >= 3) {
        getUserSearch(query)
      }
    }, [query])

    return (
      <></>
        // <Router>
        //     <Header />
        //     <div className='pt-12'>
        //         <Routes>
        //             {/* <Route path='/' Component={Home} /> */}
        //             {userStatus ? (
        //                 <>
        //                 {/* These are protected urls which acces by an authenticated user */}
        //                 {/* <Route path='/upload-video' Component={VideoUpload} />
        //                 <Route path='/subscription' Component={Subscription} />
        //                 <Route path='/video-play/:channelInfo/:videoId' Component={Video} />
        //                 <Route path='/channel/:channelId' Component={Channel} />
        //                 <Route path='/create-channel' Component={CreateChannel} /> */}
        //                 </>
        //             ): (
        //                 <>
        //                 <Route path='/login' Component={Login} />
        //                 <Route path='/register' Component={Register} />
        //                 <Route path='/about' Component={About} />
        //                 <Route path='/forgot-password' Component={ForgotPassword} />
        //                 </>
        //             )}
        //         </Routes>
        //     </div>
        //     <button
        //       onClick={toggleChatSection}
        //       className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800"
        //     >
        //       {isOpen ? "Close Chat" : "Open Chat"} {/* Button label changes based on state */}
        //     </button>
        //     {isOpen && userStatus && users && Array.isArray(users) && (
        //         <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white">
        //           <div className="p-4 border-b border-gray-700">
        //             {/* Header with Title and Close Button */}
        //             <div className="flex justify-between items-center">
        //               <span>Users For Chat</span>
        //               <button
        //                 onClick={toggleChatSection} // Close button logic
        //                 className="text-gray-400 hover:text-white"
        //               >
        //                 ✖ {/* Close icon */}
        //               </button>
        //             </div>

        //             {/* Search Bar */}
        //             <div className="mt-2">
        //               <input
        //                 type="text"
        //                 placeholder="Search..."
        //                 value={query}
        //                 onChange={(e) => setQuery(e.target.value)}
        //                 className="w-full bg-gray-700 text-white py-1 px-3 rounded-xl focus:outline-none"
        //               />
        //             </div>
        //           </div>
        //           <div className="p-4">
        //             {query.length >= 3 ? (
        //               searchResults.map((user) => (
        //                 <div
        //                   key={user.id}
        //                   className="flex items-center p-2 hover:bg-gray-700 hover:rounded-lg cursor-pointer"
        //                   onClick={() => handleUserClick(user)}
        //                 >
        //                   <img
        //                     src={user.avatarUrl || '/userdefault.png'}
        //                     alt={user.fullname}
        //                     className="w-10 h-10 rounded-full mr-4"
        //                   />
        //                   <span>{user.fullname}</span>
        //                 </div>
        //               ))
        //             ): (
        //               users.map((user) => (
        //                 <div
        //                   key={user.id}
        //                   className="flex items-center p-2 hover:bg-gray-700 hover:rounded-lg cursor-pointer"
        //                   onClick={() => handleUserClick(user)}
        //                 >
        //                   <img
        //                     src={user.avatarUrl || '/userdefault.png'}
        //                     alt={user.fullname}
        //                     className="w-10 h-10 rounded-full mr-4"
        //                   />
        //                   <span>{user.fullname}</span>
        //                   {user.unreadMessageCount > 0 && (
        //                     <div className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        //                       {user.unreadMessageCount}
        //                     </div>
        //                   )}
        //                 </div>
        //               ))
        //             )}
        //           </div>
        //         </div>
        //     )}

        //     {activeUser && (
        //       <div className="fixed bottom-4 right-96 w-1/3">
        //         <ChatComponent activeUser={activeUser} onClose={closeChat} />
        //       </div>
        //     )}
        // </Router>
  )
}

export default App
