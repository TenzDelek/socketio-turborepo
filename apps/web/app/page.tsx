"use client";

import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage(""); // Clear the input after sending the message
    }
  };

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(); // Trigger send on Enter key press
    }
  };

  return (
    <div className="relative text-center h-screen flex items-center justify-center flex-col bg-background text-white">
      <div>
        <h1>All Messages will appear here</h1>
        <div className="space-y-3">
          {messages.map((data) => (
            <div
              className="border-2 border-gray-700 p-2 rounded-md w-fit"
              key={uuidv4()}
            >
              {data}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-600 p-2 rounded-lg absolute bottom-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for key press events
          type="text"
          className="w-96 bg-transparent border-hidden outline-none"
          placeholder="Enter message"
        />
        <button onClick={handleSendMessage} className="ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
