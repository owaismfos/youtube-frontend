import { useState } from "react";
import authService from "../../api/userapi";


const Register = () => {
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const initialState = {
        fullname: "",
        username: "",
        email: "",
        password: ""
    }
    const [userData, setUserData] = useState(initialState)

    const [file, setFile] = useState(null)

    const handleChange = (e) => {
        const {name, value} = e.target
        setUserData({
         ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        console.log("File: " + file)
        const formData = new FormData()
        formData.append('fullname', userData.fullname)
        formData.append('username', userData.username)
        formData.append('email', userData.email)
        formData.append('avatar', file)
        formData.append('password', userData.password)
        console.log("Form Data: " + formData)

        const data = await authService.register(formData)
        console.log(data)
        setResult(data.success)
        setMsg(data.message)
        setUserData(initialState)
        setLoading(false)
    }

    return (
        <>
        {loading && 
            <div class="flex justify-center items-center mt-8 w-1/2 mx-auto py-3 rounded-3xl">
                <div class="w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
          </div>
          
        }
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-gray-800 w-1/3 shadow-md rounded px-8 pt-6 pb-8 mb-2">
                {result && (
                    <div className="text-green-800 text-lg font-semibold py-1 px-20 bg-green-100 my-2 rounded-lg justify-center">
                        <p className="">{msg}</p>
                    </div>
                )}
                {result === false && (
                    <div className="text-red-800 text-lg font-semibold py-1 px-20 bg-red-100 my-2 rounded-lg justify-center">
                        <p className="">{msg}</p>
                    </div>
                )}
                <div className="mb-2">
                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="fullname">
                    Full Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-900 border-none leading-tight focus:outline-none focus:shadow-outline"
                        id="fullname"
                        type="text"
                        placeholder="Full Name"
                        name="fullname"
                        value={userData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="username">
                    Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-900 border-none leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="email">
                    Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-900 border-none leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="password">
                    Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-900 border-none mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-500 text-sm font-bold mb-2" htmlFor="avatar">
                    Avatar
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-900 border-none mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="avatar"
                        type="file"
                        name="avatar"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    >
                    Register
                    </button>
                </div>
            </form>
        </div>
        </>
    )
}

export default Register