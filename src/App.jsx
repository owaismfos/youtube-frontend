import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ChatComponent, Header, Home, About, Subscription, Video, Login, Register, VideoUpload, Channel, CreateChannel } from './components/index.js'
import authService from './api/userapi.js'
import { login } from './features/auth/authSlice.js';
import { updateReduxState } from './utils/tokenHandle.js'
// import ChatComponent from './ChatComponent';

function App() {
    const userStatus = useSelector(state => state.auth.status)

    // const [isChatOpen, setIsChatOpen] = useState(true);
    const [activeUser, setActiveUser] = useState(null);
    //const users = ['Alice', 'Bob', 'Charlie'];
    const [users, setUsers] = useState([])

    const dispatch = useDispatch()

    const handleUserClick = (user) => {
      setActiveUser(user);
    };

    const getUsersList = async () => {
      try {
        const res = await authService.userList();
        console.log('Users: ', res.data);  // Use res.data to get the response body
        setUsers(res.data)
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    }

    useEffect(() => {
      if (!userStatus && localStorage.getItem('authToken')) {
        updateReduxState(dispatch)
      }
      getUsersList();
    }, [userStatus])

    return (
        <Router>
            <Header />
            <div className='pt-12'>
                <Routes>
                    <Route path='/' Component={Home} />
                    {userStatus ? (
                        <>
                        {/* These are protected urls which acces by an authenticated user */}
                        <Route path='/upload-video' Component={VideoUpload} />
                        <Route path='/subscription' Component={Subscription} />
                        <Route path='/video-play/:channelInfo/:videoId' Component={Video} />
                        <Route path='/channel/:channelId' Component={Channel} />
                        <Route path='/create-channel' Component={CreateChannel} />
                        </>
                    ): (
                        <>
                        <Route path='/login' Component={Login} />
                        <Route path='/register' Component={Register} />
                        <Route path='/about' Component={About} />
                        </>
                    )}
                </Routes>
            </div>
            {userStatus && users && Array.isArray(users) && (
                <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white">
                  <div className="p-4 border-b border-gray-700 font-bold">Users For Chat</div>
                  <div className="p-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center p-2 hover:bg-gray-700 hover:rounded-lg cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <img
                          src={user.avatar || '/userdefault.png'}
                          alt={user.fullname}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <span>{user.fullname}</span>
                      </div>
                    ))}
                  </div>
                </div>
            )}

            {activeUser && (
              <div className="fixed bottom-4 right-96 w-1/3">
                <ChatComponent activeUser={activeUser} isOpen={true} />
              </div>
            )}
        </Router>
  )
}

export default App
