import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const formatDateDivider = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const Message = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get current user ID and contacts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId);

        const response = await axios.get(`${API_URL}/api/user/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Exclude current logged-in user from contact list
        const otherUsers = (response.data.users || []).filter(
          (u) => u._id !== decoded.userId
        );
        setUsers(otherUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch messages when a user is selected
  const fetchMessages = async (userId, isSilent = false) => {
    if (!userId) return;
    try {
      if (!isSilent) setLoadingMessages(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/message/get/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser._id);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Polling for new incoming messages every 3 seconds
    const interval = setInterval(() => {
      fetchMessages(selectedUser._id, true);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (selectedUser) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // Send message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !selectedUser || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/message/send`,
        {
          receiverId: selectedUser._id,
          message: trimmed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.newMessage) {
        setMessages((prev) => [...prev, response.data.newMessage]);
      }
      setInputText("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================================ */}
      {/* 1. CONTACT LIST VIEW (when no chat is active)                */}
      {/* ============================================================ */}
      {!selectedUser && (
        <div className="px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Messages
              </h1>
              <p className="text-xs text-gray-500">
                {users.length} {users.length === 1 ? "contact" : "contacts"} available
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-.974-.94 4.542 4.542 0 0 0 .546-1.554A8.777 8.777 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-6">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-800 shadow-xs transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Contact List */}
          <div className="space-y-2.5">
            {loadingUsers ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center gap-3.5 rounded-2xl bg-white p-3.5 shadow-xs"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded-sm bg-gray-200"></div>
                      <div className="h-3 w-1/2 rounded-sm bg-gray-100"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-white p-3.5 shadow-xs transition-all hover:border-gray-200 hover:bg-gray-50/90 hover:shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-semibold text-white shadow-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {user.email || "Tap to chat"}
                      </p>
                    </div>
                  </div>

                  {/* Start Chat Button */}
                  <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <span>Chat</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-gray-700">No users found</p>
                <p className="mt-1 text-xs text-gray-400">
                  Try searching with a different name
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ACTIVE CHAT SCREEN WITH TYPING BAR & SEND BUTTON          */}
      {/* Uses z-[70] so it sits comfortably above BottomNav (z-50)    */}
      {/* ============================================================ */}
      {selectedUser && (
        <div className="fixed inset-0 z-[70] mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col bg-white shadow-2xl">
          {/* Chat Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 active:scale-95"
                title="Back to contacts"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-semibold text-white shadow-xs">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
              </div>

              <div className="leading-tight">
                <h2 className="text-sm font-semibold text-gray-900">
                  {selectedUser.name}
                </h2>
                <span className="text-[11px] font-medium text-emerald-600">
                  Active now
                </span>
              </div>
            </div>

            {/* Refresh messages button */}
            <button
              onClick={() => fetchMessages(selectedUser._id)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              title="Refresh messages"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/70 p-4">
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-xs text-gray-400">Loading messages...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.188 49.188 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v8.018Z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800">
                  No messages yet
                </h4>
                <p className="mt-1 max-w-[220px] text-xs text-gray-500">
                  Say hi to {selectedUser.name} and kick off the conversation!
                </p>

                {/* Quick starter suggestions */}
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["👋 Hello!", "Hey, how are you?", "Let's connect!"].map(
                    (quickText, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputText(quickText);
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                      >
                        {quickText}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe =
                  (typeof msg.sender === "object"
                    ? msg.sender?._id
                    : msg.sender) === currentUserId;

                // Date separator
                const showDate =
                  index === 0 ||
                  formatDateDivider(msg.createdAt) !==
                    formatDateDivider(messages[index - 1]?.createdAt);

                return (
                  <React.Fragment key={msg._id || index}>
                    {showDate && (
                      <div className="my-3 flex items-center justify-center">
                        <span className="rounded-full bg-gray-200/70 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
                          {formatDateDivider(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <div
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 text-sm shadow-xs ${
                          isMe
                            ? "rounded-2xl rounded-tr-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "rounded-2xl rounded-tl-xs border border-gray-200/70 bg-white text-gray-900"
                        }`}
                      >
                        <p className="break-words leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                            isMe ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          <span>{formatTime(msg.createdAt)}</span>
                          {isMe && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-3 w-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ============================================================ */}
          {/* TYPING BAR & SEND BUTTON                                     */}
          {/* ============================================================ */}
          <div className="shrink-0 border-t border-gray-200 bg-white p-3 shadow-lg">
            {/* Quick Emojis Bar */}
            <div className="mb-2 flex items-center gap-1 px-1">
              <span className="text-[11px] font-medium text-gray-400">Quick:</span>
              {["👍", "❤️", "🔥", "😂", "👋", "🎉"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                    inputRef.current?.focus();
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm transition hover:bg-gray-100 active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input Form with Send Button */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />

                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dedicated Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-4 font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                title="Send message (Enter)"
              >
                {sending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span className="text-xs font-semibold">Send</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5 translate-x-0.5"
                    >
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;