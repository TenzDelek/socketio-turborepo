"use client"

import { useState } from "react"
import { useSocket } from "../context/SocketProvider"

export default function Page() {
  const {sendMessage,messages}=useSocket()
  const [message,setmessage]=useState('')
  return (
    <div className=" relative text-center h-screen flex items-center justify-center flex-col bg-background text-white">
      <div>
        <h1>All Messages will appear here</h1>
        {
          messages.map(e=><li>{e}</li>)
        }
      </div>
      <div className=" bg-gray-600 p-2 rounded-lg absolute bottom-2">
        <input onChange={(e)=>setmessage(e.target.value)} type="text" className=" w-96 bg-transparent border-hidden outline-none" placeholder="enter message" />
        <button onClick={(e)=>sendMessage(message)}>send</button>
      </div>
    </div>
  )
}