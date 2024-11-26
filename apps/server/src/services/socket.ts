import {Server} from 'socket.io'

class SocketService {
    private _io:Server; 
    constructor() {
        console.log("init socket io server completed")
        this._io=new Server()
    }
    public initlistener(){
        const io=this.io
        console.log("inistalized socket listener")
        io.on("connect",(socket)=>{
            console.log("new socket connected",socket.id)
            socket.on("event:message",async({message}:{message:String})=>{
                console.log("new message recieved ", message)
            })
        })

    }
    get io(){
        return this._io
    }
}

export default SocketService