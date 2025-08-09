import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/userapi";
import { login } from "../../features/auth/authSlice";
import { loginUser, loginWithGoogle } from "../../features/auth/authActions";
import { useDispatch } from "react-redux";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    setLoading(true);
    if (await dispatch(loginUser(username, password))) {
      navigate("/");
    }
    setLoading(false);
  };

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    console.log("Google Token Response:", response);
    console.log("Access Token:", response.access_token);

    if (await dispatch(loginWithGoogle(response.access_token))) {
      navigate("/");
    }
    setLoading(false);
    // // If you want user info
    // fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    //   headers: {
    //     Authorization: `Bearer ${tokenResponse.access_token}`
    //   }
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log("User Info:", data))
    //   .catch((err) => console.error(err));
  };

  const startGoogleLogin = () => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "openid profile email", // Request user info,
      ux_mode: "popup",
      callback: handleCredentialResponse,
    });
    client.requestAccessToken();
    // const client = google.accounts.oauth2.initCodeClient({
    //   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    //   scope: "openid profile email", // Request user info,
    //   ux_mode: "popup",
    //   callback: handleCredentialResponse
    // });
    // client.requestAccessToken();
    // client.requestCode();
    // google.accounts.id.initialize({
    //   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    //   callback: handleCredentialResponse
    // });
  };

  // useEffect(() => {
  //   console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  // }, []);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 bg-white rounded-3xl">
          <div className="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md flex flex-col justify-between"
        >
          <div>
            <div className="mb-4">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username/Email
              </label>
              <input
                className="shadow appearance-none rounded w-full py-2 px-3 bg-gray-900 text-gray-500 leading-tight focus:outline-none focus:shadow-outline border-none"
                id="username"
                type="text"
                placeholder="Username OR Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label
                className="block text-gray-500 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none rounded w-full py-2 px-3 bg-gray-900 text-gray-500 mb-3 leading-tight focus:outline-none focus:shadow-outline border-none"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Link
              className="text-blue-700 hover:text-blue-800"
              to="/forgot-password"
            >
              Forgot Password
            </Link>
            <div className="flex items-center justify-between mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </div>

          {/* Separator with line and text */}
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-4 text-gray-400 text-sm whitespace-nowrap">
              Login with others
            </span>
            <hr className="flex-grow border-gray-600" />
          </div>

          {/* Google login button centered */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={startGoogleLogin}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 rounded-full"
              />
              <span className="font-medium">Sign in with Google</span>
            </button>
          </div>

          <p className="text-gray-300 py-2 text-center mt-6">
            Not a User ?{" "}
            <Link className="text-blue-700 hover:text-blue-800" to="/register">
              Please Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
