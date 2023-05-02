const messagesDiv = document.getElementById('messages-div')
const chatInput = document.getElementById('chat-text')
let username = localStorage.getItem('name')

if (username == null) {
    window.location.href = 'index.html'
}

const websocket = new WebSocket('ws://abdullahbrashid.ddns.net:4000')

chatInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById('send-button').click()
    }
})

function sendMessage() {
    let input = chatInput.value

    if (input == '') {
        return
    }

    let message = `{"name": "${username}", "message": "${input}"}`
    let messageElement = document.createElement('p')


    websocket.send(message)
    messageElement.classList.add('message')
    messageElement.classList.add('message-sent')
    messageElement.innerHTML = `You: ${input}`
    messagesDiv.appendChild(messageElement)
    chatInput.value = ''

    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight)

    // Focus on input
    chatInput.focus()
}

websocket.addEventListener('message', (message) => {
    let obj
    try {
        obj = JSON.parse(message.data)
        console.log(obj)
    } catch (error) {
        return
    }

    usersname = obj.name
    userMessage = obj.message

    let messageElement = document.createElement('p')
    messageElement.classList.add('message')
    messageElement.classList.add('message-got')
    messageElement.innerHTML = `${usersname}: ${userMessage}`
    messagesDiv.appendChild(messageElement)
    messagesDiv.scrollTop = messagesDiv.scrollHeight

    window.scrollTo(0, document.body.scrollHeight)
});

