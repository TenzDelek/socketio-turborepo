"use client";

import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
    const { sendMessage, messages, currentSocketId } = useSocket();
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (message.trim() !== "") {
            sendMessage(message);
            setMessage(""); // Clear the input after sending the message
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage(); // Trigger send on Enter key press
        }
    };

    return (
        <div className="relative text-center h-screen flex items-center justify-center flex-col bg-background text-white">
            <div className="w-full max-w-md">
                <h1 className="mb-4">Messages</h1>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                    {messages.map((data) => (
                        <div
                            key={uuidv4()}
                            className={`p-2 rounded-md w-fit ${
                                data.socketId === currentSocketId
                                    ? 'bg-blue-600 self-end ml-auto'
                                    : 'bg-green-600 mr-auto'
                            }`}
                        >
                            {data.text}
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-gray-600 p-2 flex rounded-lg absolute bottom-2 w-full max-w-md">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    type="text"
                    className="w-full bg-transparent border-hidden outline-none"
                    placeholder="Enter message"
                />
                <button 
                    onClick={handleSendMessage} 
                    className="ml-2 bg-white text-black px-4 py-1 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}