import React from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = ({ onClose, onPostCreated }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/post/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onPostCreated();
      onClose();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Create Post
          </h1>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full rounded-lg border border-gray-300 p-2"
          />

          <textarea
            name="caption"
            placeholder="What's on your mind?"
            required
            className="min-h-28 w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Post
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreatePost;