let nameInput = document.getElementById('name-input')
let saveButton = document.getElementById('save-name-button')
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

nameInput.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
        saveName()
    }
})

saveButton.addEventListener('click', saveName)
