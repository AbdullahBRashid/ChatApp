let messagesDiv = document.getElementById('messages-div')
let chatInput = document.getElementById('chat-text')

let websocket = new WebSocket('ws://abdullahbrashid.ddns.net:4000')
// var socket=io()
// // make connection with server from user side
// socket.on('connect', function(){
//   console.log('Connected to Server')
 
// });

function sendMessage() {
    let message = chatInput.value
    let messageElement = document.createElement('p')

    websocket.send(message)
    messageElement.classList.add('message')
    messageElement.classList.add('message-sent')
    messageElement.innerHTML = `You: ${message}`
    messagesDiv.appendChild(messageElement)
    chatInput.value = ''
}

websocket.addEventListener('message', (message) => {
    
    let messageElement = document.createElement('p')
    messageElement.classList.add('message')
    messageElement.classList.add('message-got')
    messageElement.innerHTML = `Them: ${message.data}`
    messagesDiv.appendChild(messageElement)
});

