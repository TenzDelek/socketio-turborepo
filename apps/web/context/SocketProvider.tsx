'use client'

import { createContext, FC, ReactNode, useCallback, useEffect } from "react"
import {io} from "socket.io-client"
interface socketproviderprop {
    children?: ReactNode
}

interface isocketcontext{
    sendMessage:(msg:string)=>any  

}
const SocketContext=createContext<isocketcontext | null>(null)

export const SocketProvider:FC<socketproviderprop>=({children})=>{
    const sendMessage:isocketcontext['sendMessage']=useCallback((msg)=>{
        console.log(`send message ${msg}`)
    },[])
    useEffect(()=>{
        const _socket=io('http://localhost:3000') //backend address
        return ()=>{
            _socket.disconnect() //re-render so it should be disconnected during that
        }
    },[])
    return (
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}