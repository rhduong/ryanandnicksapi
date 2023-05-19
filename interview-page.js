var recognition, isRecording = false
var qCounter = 0

function startRecording() 
{

   const muteButton = document.getElementById("mute-button");
   const result = document.querySelector(".textbox-answer");
   result.value = "";
 
   if (!isRecording) 
   {
     muteButton.className = "bi-mic";
 
     isRecording = true;
 
     recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
     recognition.interimResults = true;
     recognition.lang = "en-US"; // stick with only english for now
 
     recognition.onresult = (event) => 
     {
       const transcript = event.results[event.results.length - 1][0].transcript;
       result.value = transcript; // assign transcript to textbox-answer.value
     };
 
     recognition.speechend = () => // update values when speech recognition stops picking up audio
     {
       if (isRecording)
       {
         isRecording = false;
       }
       muteButton.className = "bi-mic-mute";
       
     };

     recognition.start();

  }

}

function submitRecording() {
  let messages = []
  const chatLog = document.getElementById('chat-log');
  const message = document.querySelector('.textbox-answer');
            const messageText = message.value;
            const newMessage = {"role": "user", "content": `${messageText}`}
            message.value = '';
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add('message--sent');
            messageElement.innerHTML = `
                <div class="message__text">${messageText}</div>
            `;
            chatLog.appendChild(messageElement);
            chatLog.scrollTop = chatLog.scrollHeight;
            messages.push(newMessage)


            fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages
                })

            })
            .then (res => res.json())
            .then (data => {
                let newAssistantMessage = {"role": "assistant", "content": `${data.completion.content}`}
                messages.push(newAssistantMessage);
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.classList.add('message--received');
                messageElement.innerHTML = `
                    <div class="message__text">${data.completion.content}</div>
                `;
                chatLog.appendChild(messageElement);
                chatLog.scrollTop = chatLog.scrollHeight;

                const messageElemento = document.createElement('div');
                messageElemento.classList.add('message');
                messageElemento.innerHTML = `
                <div class="message__text">${qCounter}</div>
                `;
                chatLog.appendChild(messageElemento);
                chatLog.scrollTop = chatLog.scrollHeight;
                qCounter++;

            })

            if (qCounter > 1) {

                messageElement.classList.add('message');
                messageElement.classList.add('message--received');
                messageElement.innerHTML = `
                    <div class="message__text"> END </div>
                `;

            }

        

}