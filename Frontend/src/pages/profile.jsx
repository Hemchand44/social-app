import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {

    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [posts, setPosts] = useState([]);


    const getUserProfile = async () => {

        try{

            const token = localStorage.getItem("token");
            
            if (!token) {
                alert("Please login first");
                window.location.href = "/login";
                return;
            }
            
            const res= await axios.get(`${API_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(res.data.user);
        }catch(err){
            console.log(err);
        }

    }


    const getUserPosts= async () => {
        try{
            const token=localStorage.getItem("token");
            const decodetoken=jwtDecode(token);
            const userID=decodetoken.userId;
            const res=await axios.get(`${API_URL}/api/post/${userID}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            // console.log("API RESPONSE:", res.data);
            // console.log("POSTS FROM API:",res.data.post)
            setPosts(res.data.post);
            // console.log("decoded token",decodetoken)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        getUserProfile();
        getUserPosts();
    }, []);
    
   


    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.patch(
                `${API_URL}/api/user/profile`,
                {
                    name,
                    email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(res.data.user);
            setIsEditing(false);

        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-200">

            {/* Mobile App Container */}
            <div className="min-h-screen bg-white">

                {/* ================= PROFILE HEADER ================= */}
                <div className="border-b border-gray-200 px-5 py-6">

                    <div className="flex items-center gap-5">

                        {/* Avatar */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Username + Stats */}
                        <div className="flex-1">

                            <h1 className="text-xl font-semibold text-gray-900">
                                {user.name}
                            </h1>

                            <div className="mt-3 flex justify-between text-center">

                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {posts.length}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Posts
                                    </p>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.followers?.length || 0}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Followers
                                    </p>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.following?.length || 0}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Following
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="mt-5 flex gap-2">

                        <button
                            onClick={() => {
                                setName(user.name || "");
                                setEmail(user.email || "");
                                setIsEditing(true);
                            }}
                            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                            Logout
                        </button>

                    </div>

                </div>

                {/* ================= EDIT PROFILE ================== */}
                {isEditing && (
                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-5">

                        <h2 className="mb-4 text-lg font-bold">
                            Edit Profile
                        </h2>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
                        />

                        <div className="flex gap-2">

                            <button
                                onClick={handleUpdate}
                                className="flex-1 rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 rounded-lg bg-gray-200 py-3 text-sm font-semibold"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                )}

                {/* ================= POSTS ================= */}
                <div>

                    <div className="border-b border-gray-200 py-3 text-center">
                        <h2 className="font-semibold text-gray-900">
                            Posts
                        </h2>
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="aspect-square overflow-hidden bg-gray-100"
                                >
                                    <img
                                        src={post.image}
                                        alt={post.caption}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-40 items-center justify-center">
                            <p className="text-sm text-gray-500">
                                No posts yet
                            </p>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Profile;