let nameInput = document.getElementById('name-text')
if (localStorage.getItem('name') != null) {
    window.location.href = 'app.html'
}

nameInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById('name-button').click()
    }
})

function saveName() {
    let name = nameInput.value;

    if (name == '') {
        name = 'Anonymous'
    }

    localStorage.setItem('name', name)

    window.location.href = 'app.html'
}