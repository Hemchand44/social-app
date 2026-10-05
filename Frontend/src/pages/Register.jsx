import react, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;




const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");   
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate=useNavigate();

     const handleRegister = async (e) => {   
          e.preventDefault();
          setError("");
          setSuccess("");

          if(password !== confirmPassword){
               setError("Passwords do not match");
               return;
          }

          try {
               const res = await axios.post(
                    `${API_URL}/api/auth/register`,
                    {
                         name,
                         email,
                         password
                    }
               );

               setSuccess("Registration successful! Please login.");
               setTimeout(() => {
                    navigate("/login");
               }, 1000);  

          }catch (error) {
               setError(
                    error.response?.data?.message || "Registration failed"
               );
          }

     }          
     
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <h1 className="text-center text-3xl font-bold text-gray-900">
                    Create Account
                </h1>

                <p className="mt-2 mb-8 text-center text-gray-500">
                    Register to get started
                </p>

                <form onSubmit={handleRegister}>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                        />
                    </div>

                    {error && (
                        <p className="mb-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="mb-4 text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        Register
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-1 font-semibold text-gray-900 hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Register;