import express from 'express'
import __dirname from './utils.js'
import {engine} from 'express-handlebars'
import { router as chatRouter} from './routes/chat.router.js'
import { router as vistasRouter} from './routes/vistasRouter.js'
import {Server} from 'socket.io'
const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

app.engine('handlebars' , engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
 

app.use('/api/chat' , chatRouter)
app.use('/' , vistasRouter)


const server=app.listen(PORT, () => {
    console.log(`Server Online ${PORT}`)
})

//COMO NO VAMOS A LEER EL HISTORIAL, INIZIALIZAMOS EL CHAT VACIO
let usuarios = []
let mensajes = []

const io = new Server(server)

io.on('connection', socket =>{
    console.log('Se conecto un cliente id: '+ socket.id)

    socket.on('id', nombre =>{

        usuarios.push({nombre, id:socket.id})
        socket.broadcast.emit('newUser',  {nombre: nombre})
        socket.emit("hello", mensajes)
    })

    
    socket.on('mensaje' , datos=>{
        mensajes.push(datos)
        io.emit('newMensaje' , datos)
        
    })

    socket.on('disconnect', () => {

        let userDisconnect  = usuarios.find(u => u.id === socket.id)

        if(userDisconnect){
            io.emit('userDisconnect', userDisconnect.nombre)
        }
    })
})