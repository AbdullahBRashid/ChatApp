import { createPopup } from 'https://unpkg.com/@picmo/popup-picker@latest/dist/index.js?module';

let emojiButton = document.getElementById('emoji-picker')
let textChat = document.getElementById('chat-text-box')

// Create emoji picker

const popup = createPopup({
    rootElement: emojiButton,
    position: 'top',
    autoFocus: 'search',
    emojisize: '90px',
}, {
    referenceElement: emojiButton,
    triggerElement: emojiButton,
});

// Open emoji picker

emojiButton.addEventListener('click', () => {
    popup.open()
})

// Add emoji to text box

popup.addEventListener('emoji:select', (event) => {
    textChat.value += event.emoji;
    textChat.focus()
})

// Ctrl+/ focuses on text box 

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '/') {
        textChat.focus()
}})

// Ctrl+Shift+E opens emoji picker

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        popup.toggle()
}})