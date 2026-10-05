import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const res = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            // console.log(res.data);

            localStorage.setItem("token", res.data.token);
            navigate("/feed");

        } catch (error) {
            setError(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <h1 className="text-center text-3xl font-bold text-gray-900">
                    Welcome Back
                </h1>

                <p className="mt-2 mb-8 text-center text-gray-500">
                    Login to your account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="mb-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        Login
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?
                    <Link to="/register" className="ml-1 cursor-pointer font-semibold text-gray-900 hover:underline">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Login;