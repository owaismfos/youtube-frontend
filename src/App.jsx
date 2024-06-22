import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Header, Home, About, Subscription, Video, Login, Register, VideoUpload, Channel, CreateChannel } from './components/index.js'

function App() {
    const userStatus = useSelector(state => state.auth.status)
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
        </Router>
  )
}

export default App
