const chatDiv = document.getElementById('chat-div')
const chatInput = document.getElementById('chat-text')
let username = localStorage.getItem('name')

// Check if user is logged in

if (username == null) {
    window.location.href = 'index.html'
}

// Add a color picker

let colorPicker = document.getElementById('color-picker')


if (localStorage.getItem('color') == null) {
    localStorage.setItem('color', '#000000')
} else {
    colorPicker.value = localStorage.getItem('color')
}

// Div overflow scroll

chatDiv.style.overflowY = 'scroll'
chatDiv.style.scrollBehavior = 'smooth'
chatDiv.style.height = '75vh'

// Connect to websocket

const websocket = new WebSocket('ws://abdullahbrashid.ddns.net:4000')

// Enter to send function

chatInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById('send-button').click()
    }
})

function changeColor() {
    // change color of mine sent text with color picker
    let color = document.getElementById('color-picker').value
    localStorage.setItem('color', color)
    // change color of previous messages sent by me
    let messageSent = document.getElementsByClassName('message-sent')
    for (let i = 0; i < messageSent.length; i++) {
        messageSent[i].style.color = color
    }
    let message = `{"type": "color", "name": "${username}", "color": "${color}"}`
    websocket.send(message)
}

function sendMessage() {
    let input = chatInput.value
    let color = localStorage.getItem('color')

    if (input == '') {
        return
    }

    let message = `{"type": "message", "name": "${username}", "message": "${input}"}`
    let messageElement = document.createElement('p')


    websocket.send(message)

    let colorMessage = `{"type": "color", "name": "${username}", "color": "${color}"}`
    websocket.send(colorMessage)
    messageElement.classList.add('message')
    messageElement.classList.add('message-sent')

    if (color == null) {
        messageElement.style.color = '#000000'
    } else {
        messageElement.style.color = color
    }
    messageElement.innerHTML = `You: ${input}`
    chatDiv.appendChild(messageElement)
    chatInput.value = ''

    // Scroll to bottom
    toBottom()

    // Focus on input
    chatInput.focus()
}

websocket.addEventListener('message', (message) => {
    let obj
    try {
        obj = JSON.parse(message.data)
    } catch (error) {
        return
    }

    if (obj.type == 'color') {
        let color = obj.color
        let name = obj.name
        
        // change color of previous messages sent by name
        let messageSent = document.getElementsByClassName(name)
        for (let i = 0; i < messageSent.length; i++) {
            if (messageSent[i].innerHTML.includes(name)) {
                messageSent[i].style.color = color
            }
        }
        return
    }

    usersname = obj.name
    userMessage = obj.message

    let messageElement = document.createElement('p')
    messageElement.classList.add('message')
    messageElement.classList.add('message-got')
    messageElement.classList.add(usersname)
    messageElement.innerHTML = `${usersname}: ${userMessage}`
    chatDiv.appendChild(messageElement)
});

// add button to logout 

let button = document.createElement('button')
button.setAttribute('id', 'back-button')
button.setAttribute('onclick', 'goBack()')
button.innerHTML = 'logout'

document.getElementById('header').appendChild(button)

function goBack() {
    localStorage.removeItem('name')
    localStorage.removeItem('color')
    window.location.href = 'index.html'
}

function toBottom() {
    chatDiv.scrollTo(0, document.body.scrollHeight)
}

// if user not at bottom of page show to bottom button

chatDiv.addEventListener('scroll', () => {
    if (chatDiv.scrollTop + chatDiv.clientHeight >= chatDiv.scrollHeight) {
        document.getElementById('to-bottom').style.display = 'none'
    } else {
        document.getElementById('to-bottom').style.display = 'block'
    }
})

// to bottom button

let toBottomButton = document.createElement('button')
toBottomButton.setAttribute('id', 'to-bottom')
toBottomButton.setAttribute('onclick', 'toBottom()')
toBottomButton.innerHTML = 'To Bottom'

document.getElementById('chat-input').appendChild(toBottomButton)