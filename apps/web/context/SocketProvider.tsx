'use client'

import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

interface SocketProviderProp {
    children?: ReactNode
}

interface Message {
    text: string;
    socketId: string;
}

interface ISocketContext {
    sendMessage: (msg: string) => void;
    messages: Message[];
    currentSocketId: string;
}

const SocketContext = createContext<ISocketContext | null>(null)

export const useSocket = () => {
    const state = useContext(SocketContext)
    if (!state) throw new Error('state is not defined lil bro')
    return state
}

export const SocketProvider: FC<SocketProviderProp> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<Message[]>([])
    const [currentSocketId, setCurrentSocketId] = useState<string>('')

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log(`send message ${msg}`)
        if (socket) {
            socket.emit('event:message', { message: msg, socketId: currentSocketId })
        }
    }, [socket, currentSocketId])

    const messageReceived = useCallback((msg: string) => {
        console.log('from server message received:', msg)
        const { message, socketId } = JSON.parse(msg) as { message: string, socketId: string }
        setMessages(prev => [...prev, { text: message, socketId }])
    }, [])

    useEffect(() => {
        const _socket = io('http://localhost:3002')
        
        // Store the current socket ID when connection is established
        _socket.on('connect', () => {
            setCurrentSocketId(_socket.id || '')
        })

        _socket.on('message', messageReceived)
        setSocket(_socket)

        return () => {
            _socket.disconnect()
            _socket.off('message', messageReceived)
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, messages, currentSocketId }}>
            {children}
        </SocketContext.Provider>
    )
}