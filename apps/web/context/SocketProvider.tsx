'use client'

import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import {io, Socket} from "socket.io-client"
interface socketproviderprop {
    children?: ReactNode
}

interface isocketcontext{
    sendMessage:(msg:string)=>any  

}
const SocketContext=createContext<isocketcontext | null>(null)

export const useSocket=()=>{
    const state=useContext(SocketContext)
    if (!state) throw new Error('state is not defined lil bro')
    
    return state

}
export const SocketProvider:FC<socketproviderprop>=({children})=>{
    const [socket,setsocket]=useState<Socket>()
    const sendMessage:isocketcontext['sendMessage']=useCallback((msg)=>{
        console.log(`send message ${msg}`)
        if(socket)
        {
            socket.emit('event:message',{message:msg})
        }
    },[socket])
    useEffect(()=>{
        const _socket=io('http://localhost:3002') //backend address
        setsocket(_socket)
        return ()=>{
            _socket.disconnect() //re-render so it should be disconnected during that
            setsocket(undefined)
        }
    },[])
    return (
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}