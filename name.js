let nameInput = document.getElementById('name-text')
if (localStorage.getItem('name') != null) {
    window.location.href = 'app.html'
}


function saveName() {
    let name = nameInput.value; 

    if (name == '') {
        name = 'Anonymous'
    }


    localStorage.setItem('name', name)

    window.location.href = 'app.html'
}