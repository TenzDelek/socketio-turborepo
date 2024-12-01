import {Server} from 'socket.io'
import Redis from 'ioredis';
const pub=new Redis(process.env.UPSTASHREDIS!)//or paste your redisurl here with ""
const sub=new Redis(process.env.UPSTASHREDIS!)
class SocketService {
    private _io:Server; 
    constructor() {
        console.log("init socket io server completed")
        this._io=new Server({
            cors:{
                allowedHeaders:['*'],
                origin:"*"
            }
        })
        sub.subscribe('MESSAGES')
    }

    public initlistener() {
        const io = this.io
        console.log("initialized socket listener")
        io.on("connect", (socket) => {
            console.log("new socket connected", socket.id)
            socket.on("event:message", async ({ message, socketId }: { message: string, socketId: string }) => {
                console.log("new message received ", message)
                // Publish message with socket ID
                await pub.publish('MESSAGES', JSON.stringify({
                    message,
                    socketId
                }))
            })
        })

        // When there is a message, we have which channel and what message
        sub.on('message', (channel, message) => {
            if (channel === "MESSAGES") {
                io.emit("message", message) // sending to all clients
            }
        })
    }

    get io() {
        return this._io
    }
}

export default SocketService