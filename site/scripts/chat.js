socket.on('joinChat', data => {
    let message = {
        nick: data,
        login: true
    }
    messages.push(message);
    pushMessages();
});
socket.on('lobbyChat', data => {
    if (inLobby) {
        messages.push(data);
        pushMessages();
        if (document.querySelector('#chat').classList.contains('hidden')) {
            for (let i=0;i < 6;i++) {
                if ((i % 2) === 0) {
                    setTimeout(() => {
                        document.querySelector('#chatToggle').style.border = '3px solid #b82525';
                        document.querySelector('#chatToggle').style.color = '#b82525';
                    }, (i + 1) * 500);
                } else {
                    setTimeout(() => {
                        document.querySelector('#chatToggle').style.border = '2px solid #c26b38';
                        document.querySelector('#chatToggle').style.color = '#ffe467';
                    }, (i + 1) * 500);
                }
                if (i === 5) {
                    chatAlert = setTimeout(() => {
                        document.querySelector('#chatToggle').style.color = '#b82525';
                    }, (i + 1) * 500);
                }
            }
        }
    }
});
socket.on('gameChat', data => {
    if (data.sessionID === sessionID) {
        messages.push(data);
        pushMessages();
        if (document.querySelector('#chat').classList.contains('hidden')) {
            for (let i=0;i < 6;i++) {
                if ((i % 2) === 0) {
                    setTimeout(() => {
                        document.querySelector('#chatToggle').style.border = '3px solid #b82525';
                        document.querySelector('#chatToggle').style.color = '#b82525';
                    }, (i + 1) * 500);
                } else {
                    setTimeout(() => {
                        document.querySelector('#chatToggle').style.border = '2px solid #c26b38';
                        document.querySelector('#chatToggle').style.color = '#ffe467';
                    }, (i + 1) * 500);
                }
                if (i === 5) {
                    chatAlert = setTimeout(() => {
                        document.querySelector('#chatToggle').style.color = '#b82525';
                    }, (i + 1) * 500);
                }
            }
        }
    }
});

const toggleChat = () => {
    if (chatAlert !== undefined) {
        clearTimeout(chatAlert);
    }
    document.querySelector('#chatToggle').style.color = '#ffe467';
    if (document.querySelector('#chat').classList.contains('hidden')) {
        document.querySelector('#chat').classList.remove('hidden');
    } else {
        document.querySelector('#chat').classList.add('hidden');
    }
}

const sendMessage = () => {
    let now = new Date();
    let time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    if (inLobby) {
        let data = {
            nick: nick,
            time: time,
            content: document.querySelector('#messageBox').value
        }
        socket.emit('lobbyChat', data);
    } else {
        let data = {
            sessionID: sessionID,
            nick: nick,
            time: time,
            content: document.querySelector('#messageBox').value
        }
        socket.emit('gameChat', data);
    }
    document.querySelector('#messageBox').value = '';
}

const pushMessages = () => {
    let chatHTML = messages.map(message => {
        if (message.login) {
            return `<p class="joinChat">${message.nick} joined the chat.`;
        } else {
            return `<div class="${message.nick === nick ? 'messageRightPush' : 'message'} flex column">
                <div class="headingMessage flex">
                    <p>${message.nick}</p><p>${message.time}</p>
                </div>
                <p class="content">${message.content}</p>
            </div>`;
        }
    });
    document.querySelector('#messages').innerHTML = chatHTML;
    document.querySelector('#chat').scrollTo({top: document.querySelector('#chat').scrollHeight});
}
