import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatePost from "./CreatePost.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const getTime = (createdAt) => {
  const currentDate = Date.now();
  const postDate = new Date(createdAt).getTime();

  const difference = (currentDate - postDate) / 1000;

  if (difference < 60) {
    return "just now";
  } else {
    const minute = Math.floor(difference / 60);

    if (minute < 60) {
      return `${minute} min ago`;
    } else {
      const hour = Math.floor(minute / 60);

      if (hour === 1) {
        return "1 hour ago";
      } else if (hour < 24) {
        return `${hour} hours ago`;
      } else {
        const day = Math.floor(hour / 24);

        if (day === 1) {
          return "1 day ago";
        }

        return `${day} days ago`;
      }
    }
  }
};

const Feed = () => {
  const [post, setpost] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Get all posts
  const getPost = async () => {
    try {
      const token = localStorage.getItem("token");

      const allPosts = await axios.get(
        `${API_URL}/api/post/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setpost(allPosts.data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch posts when Feed loads
  useEffect(() => {
    getPost();
  }, []);

  // Delete post
  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setpost((prevPost) =>
        prevPost.filter((post) => post._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={getPost}
        />
      )}

      {/* Feed Container */}
      <div className="w-ful ">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Feed
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              See what people are sharing
            </p>
          </div>

          <button
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            onClick={() => setShowCreatePost(true)}
          >
            + Create Post
          </button>

        </div>

        {/* Posts */}
        {post.length > 0 ? (

          <div className="space-y-6">

            {post.map((post) => (

              <div
                key={post._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >

                {/* Post Header */}
                <div className="flex items-center justify-between px-5 py-4">

                  <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 font-semibold text-white">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-900">
                        {post.author.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {getTime(post.createdAt)}
                      </p>

                    </div>

                  </div>

                  {/* Menu */}
                  <div className="relative">

                    <button
                      onClick={() =>
                        setShowMenu(
                          showMenu === post._id
                            ? null
                            : post._id
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      ⋮
                    </button>

                    {showMenu === post._id && (

                      <div className="absolute right-0 top-10 z-10 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">

                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deletePost(post._id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    )}

                  </div>

                </div>

                {/* Post Image */}
                <div className="aspect-square w-full overflow-hidden">

                  <img
                    src={post.image}
                    alt="post"
                    className="h-full w-full object-cover object-center"
                  />

                </div>

                {/* Post Content */}
                <div className="px-5 py-4">

                  {/* Actions */}
                  <div className="mb-3 flex items-center gap-5">

                    <button className="text-2xl transition hover:scale-110">
                      ♡
                    </button>

                    <button className="text-2xl transition hover:scale-110">
                      💬
                    </button>

                    <button className="text-2xl transition hover:scale-110">
                      ↗
                    </button>

                  </div>

                  {/* Caption */}
                  <p className="text-sm leading-6 text-gray-800">
                    {post.caption}
                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* Empty State */
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">

            <div className="text-5xl">
              📭
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No posts yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Be the first one to create a post.
            </p>

            <button
              onClick={() => setShowCreatePost(true)}
              className="mt-6 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Create Post
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default Feed;