'use client'

import { createContext, FC, ReactNode, useCallback } from "react"

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
    return (
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}