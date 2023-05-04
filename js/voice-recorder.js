let recordButton = document.getElementById('voice-button')
let stopButton = document.getElementById('stop-voice-button')
let cancelButton = document.getElementById('cancel-voice-button')

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    cancelButton.onclick = () => {
        recordButton.style.display = 'block'
        stopButton.style.display = 'none'
        cancelButton.style.display = 'none'

        mediaRecorder.stop()
    }

    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true,
        }
      )
  
      // Success callback
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        recordButton.onclick = () => {
            // recordButton.style.display = 'none'
            stopButton.style.display = 'block'
            // cancelButton.style.display = 'block'

            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            recordButton.style.background = "red";
            recordButton.style.color = "black";
        };

        let chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };

        stopButton.onclick = () => {
            recordButton.style.display = 'block'
            stopButton.style.display = 'none'
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            recordButton.style.background = "";
            recordButton.style.color = "";
        };

        mediaRecorder.onstop = (e) => {
            console.log("recorder stopped");
          
            const clipName = prompt("Enter a name for your sound clip");
          
            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");
          
            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.innerHTML = "Delete";
            clipLabel.innerHTML = clipName;
          
            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);

            let clipsContainer = document.getElementById('clips-container')

            clipsContainer.appendChild(clipContainer);
          
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
          
            deleteButton.onclick = (e) => {
              let evtTgt = e.target;
              evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            };
          };
          
          


      })
  
      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

