import { websocket } from './socket.js'

let recordButton = document.getElementById('voice-button')
let stopButton = document.getElementById('stop-voice-button')
let cancelButton = document.getElementById('cancel-voice-button')
let container = document.getElementById('voice-control-container')


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

  recordButton.onclick = () => {      
    
    console.log('started')

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.start();
        
        recordButton.style.display = 'none'
        container.style.display = 'flex'


        let chunks = [];
        let color = localStorage.getItem('color')
        let username = localStorage.getItem('name')

        mediaRecorder.ondataavailable = (e) => {
            let id = Math.random().toString(36).substring(2, 10)
            websocket.send(e.data)
            chunks.push(e.data);
        };

        stopButton.onclick = () => {
            recordButton.style.display = 'block'
            container.style.display = 'none'
            mediaRecorder.stop();

            let sendBool = true;

            // stop the stream
            stream.getTracks().forEach(function(track) {
              track.stop();
            });

            mediaRecorder.onstop = (e) => {

              if (sendBool) {
          
                const clipContainer = document.createElement("article");
                const audio = document.createElement("audio");
              
                clipContainer.classList.add("clip");
                audio.setAttribute("controls", "");
              
                clipContainer.appendChild(audio);

                let messagesContainer = document.getElementById('messages-container')

                let messageBox = document.createElement('div')

                messageBox.classList.add('message-box')
                messageBox.classList.add('message-voice')
                messageBox.classList.add('message-sent')

                // name
                let nameEl = document.createElement('p')
                nameEl.classList.add('message-name')
                nameEl.textContent = 'You'

                messageBox.appendChild(nameEl)
                messageBox.appendChild(clipContainer)

                messagesContainer.appendChild(messageBox);
                const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                chunks = [];

                const audioURL = window.URL.createObjectURL(blob);
                audio.src = audioURL;

                sendBool = false;
              }
            }            
        };

        cancelButton.onclick = () => {
          recordButton.style.display = 'block'
          container.style.display = 'none'

          stream.getTracks().forEach(function(track) {
            track.stop();

          });
        }
      })
  
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
        alert('Please enable your mic!')
      });
    }
} else {
    console.log("getUserMedia not supported on your browser!");
    alert("mic what?")
} 