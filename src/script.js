const input = document.getElementById('input');
const sendButton = document.getElementById('send-button');
currentSite = 'http://localhost:5000'
const socket = io(currentSite)
var userName = localStorage.getItem('userName');

if(!userName) {
    localStorage.setItem('userName', window.prompt('Please enter your name: ').toUpperCase());
    userName = localStorage.getItem('userName');
}

if(userName.length > 14) {
  alert('Your username cannot be longer than 14 characters.')
  localStorage.clear();
  window.location.reload();
}

let timeout = false;


const url = window.location.href;
const urlSplitted = url.split('#');
const msg = urlSplitted[1];
if(msg) {
  alert(msg);
}



function displayMessage(time, userName, msg) {
    const messageContainer = document.querySelector('.message-container')
    const div = document.createElement('div');
    div.className = 'message';
    const spanHead = document.createElement('span');
    spanHead.className = 'msg-header';
    spanHead.innerText = userName + ' • ' + time;
    const spanMain = document.createElement('span');
    spanMain.className = 'msg-main';
    spanMain.innerText = msg;
    div.append(spanHead, spanMain);
    messageContainer.append(div);

    const messageSound = document.querySelector('.hidden');
    messageSound.play();
    var height = document.body.scrollHeight
    window.scroll(0, height);

}



// String to test swear words filter

function initialMessage() {
  const timeArr = new Date().toLocaleTimeString().split(':')
  const time = timeArr[0] + ':' + timeArr[1]
  displayMessage(time, userName, 'You joined the chat')
} initialMessage();


socket.on('chat-message', data => {
    displayMessage(data.time, data.userName, data.msg)
});
socket.on('new-user', (user) => {
    const timeArr = new Date().toLocaleTimeString().split(':')
    const time = timeArr[0] + ':' + timeArr[1]
    displayMessage(time, 'CHAT-MODERATOR', `${user} just joined the chat.`);
});
socket.emit('new-user', userName);
socket.on('messagesArr', messages => {
    messages.forEach(message => {
        displayMessage(message.time, message.userName, message.msg);
    })
})
socket.on("chatCleared", () => {
  window.location.replace('/msg?msg=The moderator has cleared the chat...');
})

sendButton.addEventListener('click', e => {
    const msg = input.value;
    const timeArr = new Date().toLocaleTimeString().split(':')
    const time = timeArr[0] + ':' + timeArr[1]
    if (msg.length > 100) {
      alert('Your message exceeds the character limit of 100')
      input.value = ''
      return
    }
    if(timeout) {
        alert('Please wait for atelast 5 seconds before sending a new message..')
        return;
    }

    
    if (msg === '' || msg === ' ') {
        alert('Please type in a message first!')
        return
    }
    displayMessage(time, userName, msg);

    socket.emit('chat-message', {
      userName: userName,
      time: time,
      msg: msg,
    })
    input.value = ''
    timeout=true;
    setTimeout(() => {
      timeout=false
    }, 5000)
    
})
document.addEventListener('keypress', (event) => {
    if(event.key !== 'Enter') {
        return;
    }
    if(timeout) {
        alert('Please wait for atelast 5 seconds before sending a new message..')
        return;
    }

     const msg = input.value
     const timeArr = new Date().toLocaleTimeString().split(':')
     const time = timeArr[0] + ':' + timeArr[1]

     if (msg.length > 100) {
       alert('Your message exceeds the character limit of 100')
       input.value = ''
       return
     }

     displayMessage(time, userName, msg)
     input.value = ''
     socket.emit('chat-message', {
       userName: userName,
       time: time,
       msg: msg,
     })
     timeout=true;
     setTimeout(() => {
       timeout=false
     }, 5000)
})

setInterval(() => {
  console.log(timeout)
}, 500)