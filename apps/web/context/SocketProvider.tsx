'use client'

import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import {io, Socket} from "socket.io-client"
interface socketproviderprop {
    children?: ReactNode
}

interface isocketcontext{
    sendMessage:(msg:string)=>any  
    messages:string[]

}
const SocketContext=createContext<isocketcontext | null>(null)

export const useSocket=()=>{
    const state=useContext(SocketContext)
    if (!state) throw new Error('state is not defined lil bro')
    
    return state

}
export const SocketProvider:FC<socketproviderprop>=({children})=>{
    const [socket,setsocket]=useState<Socket>()
    const [messages,setmessages]=useState<string[]>([])
    const sendMessage:isocketcontext['sendMessage']=useCallback((msg)=>{
        console.log(`send message ${msg}`)
        if(socket)
        {
            socket.emit('event:message',{message:msg})
        }
    },[socket])
    
    const messageRecieved=useCallback((msg:string)=>{
        console.log('from server message recieved:',msg)
        const {message}=JSON.parse(msg) as {message:string}
        setmessages(prev=>[...prev,message]) //spread old and add message
    },[])
    useEffect(()=>{
        const _socket=io('http://localhost:3002') //backend address
        _socket.on('message',messageRecieved) //when ever message come trigger this
        setsocket(_socket)
        return ()=>{
            _socket.disconnect() //re-render so it should be disconnected during that
            _socket.off('message',messageRecieved)
            setsocket(undefined)
            
        }
    },[])
    return (
        <SocketContext.Provider value={{sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}