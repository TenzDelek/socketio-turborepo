import http from 'http'
import SocketService from './services/socket'
async function init(){
    const socketService=new SocketService() //calling the class 
    const httpserver=http.createServer()
    socketService.io.attach(httpserver)
    const PORT=process.env.PORT || 3000

    httpserver.listen(PORT,()=>{
        console.log(`server is listening on port ${PORT}`)
    })
    socketService.initlistener()
}
init()