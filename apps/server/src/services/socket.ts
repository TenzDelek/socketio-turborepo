import {Server} from 'socket.io'
import Redis from 'ioredis';

const pub=new Redis({
    host:"subtle-monkfish-59207.upstash.io",
    port:6379,
    password:process.env.UPSTASH,
    username:"default"

})
const sub=new Redis({
    host:"subtle-monkfish-59207.upstash.io",
    port:6379,
    password:process.env.UPSTASH,
    username:"default"

})
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
    public initlistener(){
        const io=this.io
        console.log("inistalized socket listener")
        io.on("connect",(socket)=>{
            console.log("new socket connected",socket.id)
            socket.on("event:message",async({message}:{message:String})=>{
                console.log("new message recieved ", message)
                //publish this message to redis
                await pub.publish('MESSAGES',JSON.stringify({
                    message
                }))//ON MESSAGES CHANNEL WE WILL PUBLISH THAT OBJECT (the server send message to redis)
            })
        })

        //when ever there is a message , we have which channel and what message
        sub.on('message',(channel,message)=>{
            if(channel==="MESSAGES"){
                io.emit("message",message) //sending to all client
            }
        })
    }
    get io(){
        return this._io
    }
}

export default SocketService