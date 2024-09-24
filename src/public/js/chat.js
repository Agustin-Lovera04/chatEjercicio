const socket = io()

let inputMensaje = document.getElementById('mensaje')
let divMensajes = document.getElementById('mensajes')

Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nickname",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick:false
}).then(resultado =>{
    
    socket.emit('id', resultado.value)
    inputMensaje.focus()
    document.title = resultado.value
    
    socket.on('newUser' , nombre=>{    
        
     
        Swal.fire({
            text:`${nombre.nombre} se ha conectado!`,
            toast:true,
            position:"top-right"
        })

    })

    inputMensaje.addEventListener('keyup', (e)=>{
        if(e.code === "Enter" && e.target.value.trim().length > 0){
            socket.emit('mensaje' , {emisor: resultado.value, mensaje: e.target.value.trim()})
            e.target.value = ''
        }
    })

    socket.on('newMensaje' , datos =>{
        let parrafo = document.createElement('p')
        parrafo.innerHTML =  `<strong>${datos.emisor}:</strong><br>
        <i>${datos.mensaje} </i>`

        parrafo.classList.add('mensaje')
        let hr = document.createElement('hr')
        divMensajes.append(parrafo, hr)


        divMensajes.scrollTop=divMensajes.scrollHeight;
    })


    socket.on("hello", mensajes =>{
        mensajes.forEach(mensaje => {
            let parrafo = document.createElement('p')
            parrafo.innerHTML =  `<strong>${mensaje.emisor}:</strong><br>
            <i>${mensaje.mensaje} </i>`
    
            parrafo.classList.add('mensaje')
            let hr = document.createElement('hr')
            divMensajes.append(parrafo, hr)
    
    
            divMensajes.scrollTop=divMensajes.scrollHeight;
        });
    })


    socket.on('userDisconnect' , nombre =>{
        Swal.fire({
            text:`${nombre} se ha DESCONECTO!`,
            toast:true,
            position:"top-right"
        })
    })
})
