import React from 'react'
import ReactDOM from 'react-dom/client'
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store'

import App from './App.jsx'
// import { Header, Home, About, Subscription, Video, Login, Register, VideoUpload, Channel, CreateChannel } from './components/index.js'
import './index.css';
import '@fortawesome/fontawesome-free/css/all.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <div className='bg-black'>
      <App />
    </div>
  </Provider>,
)
