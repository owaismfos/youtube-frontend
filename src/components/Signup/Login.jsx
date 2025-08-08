import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../api/userapi';
import { login } from '../../features/auth/authSlice'
import { loginUser } from '../../features/auth/authActions';
import { useDispatch } from 'react-redux'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    setLoading(true)
    if (await dispatch(loginUser(username, password))) {
        navigate('/')
    }
    setLoading(false)
  };

  async function handleCredentialResponse(response) {
      // response.credential is the id_token
      // ✅ Correct property name
      const idToken = response.credential;
      
      // 1. Log the whole object
      console.log("Google raw response:", response);

      // 2. Log token separately
      console.log("ID Token:", idToken);

      // 3. (Optional) Decode the JWT on frontend to inspect its contents
      const payload = JSON.parse(atob(idToken.split(".")[1]));
      console.log("Decoded ID Token payload:", payload);

      // try {
      //     const res = await fetch("/api/auth/google/", {
      //         method: POST,
      //         headers: {"Content-Type": "application/json"},
      //         body: JSON.stringify({id_token: idToken})
      //     })
      // } catch (error) {
          
      // }
  }

  const startGoogleLogin = () => {
    google.accounts.id.prompt(); // triggers Google popup
  };

  useEffect(() => {
    console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
    }
  }, []);

  return (
    <>
    {loading && 
      <div className="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
        <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    }
    <div className="flex justify-center h-screen my-16">
      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md h-72 rounded px-8 pt-6 pb-8 mb-4 w-1/3">
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="username">
            Username/Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-500 leading-tight focus:outline-none focus:shadow-outline border-none"
            id="username"
            type="text"
            placeholder="Username OR Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline border-none"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link className='text-blue-700 hover:text-blue-800' to="/forgot-password">Forgot Password</Link>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </div>
        <p className="text-gray-300 py-2">Not a User ? <Link className='text-blue-700 hover:text-blue-800' to="/register">Please Register</Link></p>
      </form>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={startGoogleLogin}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5 rounded-full"
          />
          {/* <span className="text-gray-700 font-medium"></span> */}
        </button>
      </div>
    </div>
    </>
  )
}

export default Login
