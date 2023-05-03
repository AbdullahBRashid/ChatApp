let nameInput = document.getElementById('name-text')
if (localStorage.getItem('name') != null && localStorage.getItem('password') == 'ABD1357') {
    window.location.href = 'app.html'
}


function saveName() {
    let name = nameInput.value;
    let password = document.getElementById('password-text').value

    if (name == '') {
        name = 'Anonymous'
    }

    if (password == 'ABD1357') {
        localStorage.setItem('password', password)
    }

    localStorage.setItem('name', name)

    window.location.href = 'app.html'
}