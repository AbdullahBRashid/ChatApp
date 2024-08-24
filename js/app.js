// Author: AbdullahBRashid
// Description: Main javascript file for the chat app

import { URL } from "./config.js";

// Change the address to your server address
const address = URL;

let socket = new WebSocket(address)

// Get elements
let headerEl = document.getElementById('header')

const nameEl = document.getElementById('name-p')
let logoutButton = document.getElementById('logout-button')

let colorChangeButton = document.getElementById('name-color-picker')

let mainEl = document.getElementById('main')
const chatDiv = document.getElementById('messages-container')

let chatInputBox = document.getElementById('chat-input')
const chatText = document.getElementById('chat-text-box')
let sendButton = document.getElementById('send-button')


// Check if user is logged in
let username = localStorage.getItem('name')

if (username == null) {
    window.location.href = 'index.html'
}


// Set username
nameEl.innerText = username


// Check if color is stored

if (localStorage.getItem('color') == null) {
    localStorage.setItem('color', '#000000')
} else {
    colorChangeButton.value = localStorage.getItem('color')
}



// Enter to send function

chatText.addEventListener('keyup', (event) => {
    if (event.keyCode == '13') {
        event.preventDefault()
        document.getElementById('send-button').click()
    }
})


// Change color of mine sent text with color picker

colorChangeButton.onchange = () => {
    let color = document.getElementById('name-color-picker').value
    localStorage.setItem('color', color)

    // Change color of previous messages sent by me
    let messagesSent = document.getElementsByClassName('message-sent')
    for (let i = 0; i < messagesSent.length; i++) {
        messagesSent[i].querySelector('.message-name').style.color = color
    }

    // Send color to server
    let message = JSON.stringify({
        type: "color",
        name: username,
        color: color
    });
    socket.send(message);
}





sendButton.onclick =  () => {
    // Collect input
    let input = chatText.value
    let color = localStorage.getItem('color')


    // Empty Verification
    if (input.trim() == '') {
        return
    }

    // Make message
    let message = JSON.stringify({
        type: "message",
        name: username,
        message: input,
        color: color
    });
    // Send message
    socket.send(message)
    
    // Create message element
    let messageBox = document.createElement('div')

    // Add classes
    messageBox.classList.add('message-box')
    messageBox.classList.add('message-sent')
    
    // Add message
    let messageNameEl = document.createElement('h4')
    messageNameEl.classList.add('message-name')
    messageNameEl.textContent = `You`
    
    let messageTextEl = document.createElement('p')
    messageTextEl.classList.add('message-text')

    // Verify if link with regex and put in a tag
    if (input.includes('http' || 'https')) {
        let link = document.createElement('a')
        link.setAttribute('href', input)
        link.textContent = input
        messageTextEl.append(link)
    } else {
        messageTextEl.textContent = input
    }
    
    // Add color
    if (color == null) {
        messageNameEl.style.color = '#000000'
    } else {
        messageNameEl.style.color = color
    }

    messageBox.appendChild(messageNameEl)
    messageBox.appendChild(messageTextEl)
    chatDiv.appendChild(messageBox)

    // Empty input
    chatText.value = ''

    // Scroll to bottom
    toBottom()

    // Focus on input
    chatText.focus()
}

// On websocket open
socket.addEventListener('message', (message) => {
    let obj = JSON.parse(message.data);

    // Check if message or color
    if (obj.type === 'color') {
        let color = obj.color
        let name = obj.name
        
        // change color of previous messages sent by name
        let messagesGot = document.getElementsByClassName('message-got');
        for (let i = 0; i < messagesGot.length; i++) {
            if (messagesGot[i].innerHTML.includes(name)) {
                messagesGot[i].querySelector('.message-name').style.color = color
            }
        }
        return
    }


    if (obj.type != 'message') {
        return
    }

    // Get message
    let usersname = obj.name
    let userMessage = obj.message
    let messageColor = obj.color

    // Create message element
    let messageBox = document.createElement('div')
    messageBox.classList.add('message-box')
    messageBox.classList.add('message-got')

    let messageNameEl = document.createElement('h4')
    messageNameEl.classList.add('message-name')
    messageNameEl.textContent = `${usersname}`
    messageNameEl.style.color = messageColor

    // if link then make it a link
    
    let messageTextEl = document.createElement('p')
    messageTextEl.classList.add('message-text')

    if (userMessage.includes('http' || 'https')) {
        let link = document.createElement('a')
        link.setAttribute('href', userMessage)
        link.textContent = userMessage
        messageTextEl.append(link)
    } else {
        messageTextEl.textContent = userMessage
    }

    messageBox.appendChild(messageNameEl)
    messageBox.appendChild(messageTextEl)
    chatDiv.appendChild(messageBox)

    // Send notification
    if (document.hidden) {
        // Send a sound notification
        let audio = new Audio('/static/notification.mp3')
        audio.play()
        let notification = new Notification('New Message', {
            body: `${usersname}: ${userMessage}`
        })

        notification.onclick = () => {
            window.focus()
        }
    }

    // Scroll to bottom
    toBottom()
});


// Logout function
function logout() {
    localStorage.removeItem('name')
    localStorage.removeItem('color')
    window.location.href = 'index.html'
}

let toBottomButton = document.getElementById('to-bottom-button')
// To bottom function
function toBottom() {
    chatDiv.scrollTo(0, chatDiv.scrollHeight)
}
toBottomButton.onclick = () => {
    toBottom()
}

// If user not at bottom of page show to bottom button

chatDiv.addEventListener('scroll', () => {
    // if scroll hasnt started then hide the button
    if (chatDiv.scrollTop == 0) {
        document.getElementById('to-bottom-button').style.display = 'none'
    }

    // if user is at bottom hide the button
    if (chatDiv.scrollTop + chatDiv.clientHeight >= chatDiv.scrollHeight - 1) {
        document.getElementById('to-bottom-button').style.display = 'none'
    } else {
        document.getElementById('to-bottom-button').style.display = 'block'
    }
})

// Logout Button
logoutButton.onclick = () => {
    logout()
}

socket.onclose = () => {
    console.log("Reconnected");
    socket = new WebSocket(address);
}


let logoEl = document.getElementById('logo')
let titleEl = document.getElementById('title')




// Set height of main div
mainEl.style.height = window.innerHeight - headerEl.offsetHeight + 'px'
chatDiv.style.height = mainEl.offsetHeight - chatInputBox.offsetHeight - 5 + 'px'


// If zoom changes resize main div
window.onresize = () => {
    mainEl.style.height = window.innerHeight - headerEl.offsetHeight + 'px'
    chatDiv.style.height = mainEl.offsetHeight - chatInputBox.offsetHeight - 5 + 'px'

    // If mobile hide logo and title
    if (window.innerHeight < 500) {
        logoEl.style.display = 'none'
        titleEl.style.display = 'none'
    } else {
        logoEl.style.display = 'block'
        titleEl.style.display = 'block'
    }
}