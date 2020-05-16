let socket = io();
const textCheck = /[A-Za-z0-9\- .]+/;
let sessionID = '';
let socketID = '';
let onlinePlayer = {};
let inLobby = false;
let messages = [];
let chatAlert;
let nick = '';

socket.on('socketID', data => {
    socketID = data;
});
socket.on('charUpdate', data => {
    if (data.socketID !== socketID) {
        document.querySelector(`#${data.event.id}`).innerHTML = `${data.nick} character: `;
        charPreview(data.event);
    }
});
socket.on('charCheck', data => {
    if (onlinePlayer.nr !== data.nr) {
        if (onlinePlayer.nr === 1) {
            if (onlinePlayer.name === data.name) {
                document.querySelector('#error').innerHTML = `Both players can't select the same character.`;
                window.scrollTo({top: 0, behavior: 'smooth'});
            } else {
                socket.emit('startGame', sessionID);
                window.location.href = 'game.html?online';
            }
        } else {
            startOnlineGame();
        }
    }
});
socket.on('startGame', data => {
    if(onlinePlayer.nr === 2) {
        window.location.href = 'game.html?online';
    }
});

const onlinePlay = () => {
    document.querySelector('main').innerHTML = `<div class="fullWidth flex column">
            <p class="extraMargin">Please sign in with a username.</p>
            <div class="mobileColumn">
                <label for="username">Your username: </label>
                <input type="text" id="username">
                <button onClick="login();">Confirm</button>
            </div>
        </div>
        <p id="error" class="centerText"></p>
        <div class="fullWidth flex">
            <button class="center" onClick="location.reload();">Back</button>
        </div>`;
}

const login = () => {
    if (textCheck.test(document.querySelector('#username').value)) {
        nick = document.querySelector('#username').value;
        fetch('assets/data/chars.json')
            .then(resolve => {
                resolve.json().then(data => {
                    chars = data;
                    document.querySelector('main').innerHTML = `<div class="fullWidth flex column">
                            <p id="error"></p>
                            <p class="extraMargin">Either use the lobby chat, button in lower righthand corner, to find someone to play with and agree on Game session ID. If you have a Game session ID allready, use the box below to create or connect to a Game session.</p>
                            <div class="mobileColumn">
                                <label for="sessionID">Game session ID: </label>
                                <input type="text" id="sessionID">
                                <button onClick="gameConnect();">Confirm</button>
                            </div>
                        </div>
                        <div id="chat" class="hidden">
                            <div id="messages">
                            </div>
                            <div class="sendBox flex">
                                <textarea id="messageBox" onkeydown="if (event.keyCode === 13){event.preventDefault(); document.querySelector('#sendMessage').click();}"></textarea>
                                <button id="sendMessage" onClick="sendMessage();">Send</button>
                            </div>
                        </div>
                        <button id="chatToggle" onClick="toggleChat();">Chat</button>
                        <div class="fullWidth flex">
                            <button onClick="location.reload();">Back</button>
                        </div>`;
                    inLobby = true;
                    socket.emit('joinChat', nick);
                })
            })
            .catch(err => {console.log(err)});
    } else {
        document.querySelector('#error').innerHTML = 'Please provide an username.';
    }
}

const gameConnect = () => {
    if (textCheck.test(sessionID = document.querySelector('#sessionID').value)) {
        sessionID = document.querySelector('#sessionID').value;
        socket.emit('getUsers', sessionID);
        socket.on('currentUsers', data => {
            if (data === null || data.length < 2) {
                if (data === null) {
                    onlinePlayer = {
                        nr: 1,
                        nick: nick,
                        sessionID: sessionID
                    }
                } else {
                    onlinePlayer = {
                        nr: 2,
                        nick: nick,
                        sessionID: sessionID
                    }
                }
                socket.emit('joinRoom', sessionID);
                inLobby = false;
                messages = [];
                let options = '';
                for (let i=0;i < chars.length;i++) {
                    options += `<option value="${i}">${chars[i].name}</option>`;
                }
                if (onlinePlayer.nr === 1) {
                    document.querySelector('main').innerHTML = `<div class="fullWidth flex">
                            <p id="error"></p>
                        </div>
                        <div class="playSelection flex column">
                            <label for="charOne">${onlinePlayer.nick} character: </label>
                            <select id="charOne" onchange="onlineCharPreview(this);">
                                ${options}
                            </select>
                            <div id="charOneSelected">
                                <h2>${chars[0].name}</h2>
                                <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                                <p><b>Class:</b> ${chars[0].class}</p>
                                <p><b>Weapon:</b> ${chars[0].weapon}</p>
                                <p><b>Gender:</b> ${chars[0].gender}</p>
                            </div>
                        </div>
                        <div class="playSelection flex column">
                            <p id="charTwo">Player 2 character: </p>
                            <div id="charTwoSelected">
                                <h2>${chars[0].name}</h2>
                                <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                                <p><b>Class:</b> ${chars[0].class}</p>
                                <p><b>Weapon:</b> ${chars[0].weapon}</p>
                                <p><b>Gender:</b> ${chars[0].gender}</p>
                            </div>
                        </div>
                        <div id="chat" class="hidden">
                            <div id="messages">
                            </div>
                            <div class="sendBox flex">
                                <textarea id="messageBox" onkeydown="if (event.keyCode === 13){event.preventDefault(); document.querySelector('#sendMessage').click();}"></textarea>
                                <button id="sendMessage" onClick="sendMessage();">Send</button>
                            </div>
                        </div>
                        <button id="chatToggle" onClick="toggleChat();">Chat</button>
                        <div class="fullWidth flex">
                            <button onClick="location.reload();">Back</button>
                            <button onClick="startOnlineGame();">Play</button>
                        </div>`;
                } else {
                    document.querySelector('main').innerHTML = `<div class="fullWidth flex">
                            <p id="error"></p>
                        </div>
                        <div class="playSelection flex column">
                            <p id="charOne">Player 1 character: </p>
                            <div id="charOneSelected">
                                <h2>${chars[0].name}</h2>
                                <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                                <p><b>Class:</b> ${chars[0].class}</p>
                                <p><b>Weapon:</b> ${chars[0].weapon}</p>
                                <p><b>Gender:</b> ${chars[0].gender}</p>
                            </div>
                        </div>
                        <div class="playSelection flex column">
                            <label for="charTwo">${onlinePlayer.nick} character: </label>
                            <select id="charTwo" onchange="onlineCharPreview(this);">
                                ${options}
                            </select>
                            <div id="charTwoSelected">
                                <h2>${chars[0].name}</h2>
                                <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                                <p><b>Class:</b> ${chars[0].class}</p>
                                <p><b>Weapon:</b> ${chars[0].weapon}</p>
                                <p><b>Gender:</b> ${chars[0].gender}</p>
                            </div>
                        </div>
                        <div id="chat" class="hidden">
                            <div id="messages">
                            </div>
                            <div class="sendBox flex">
                                <textarea id="messageBox" onkeydown="if (event.keyCode === 13){event.preventDefault(); document.querySelector('#sendMessage').click();}"></textarea>
                                <button id="sendMessage" onClick="sendMessage();">Send</button>
                            </div>
                        </div>
                        <button id="chatToggle" onClick="toggleChat();">Chat</button>
                        <div class="fullWidth flex">
                            <button onClick="location.reload();">Back</button>
                        </div>`;
                }
            } else {
                document.querySelector('#error').innerHTML = 'Game session is full, please join a different ID.';
            }
        });
    } else {
        document.querySelector('#error').innerHTML = 'Please provide a Game session ID.';
    }
}

const onlineCharPreview = e => {
    charPreview(e);
    let event = {
        value: e.value,
        id: e.id
    }
    let data = {
        sessionID: sessionID,
        socketID: socketID,
        nick: nick,
        event: event
    }
    socket.emit('charUpdate', data);
}

const startOnlineGame = () => {
    let char;
    if (onlinePlayer.nr === 1) {
        char = document.querySelector('#charOne');
        socket.emit('startGetUsers', sessionID);
        socket.on('startCurrentUsers', data => {
            console.log(data);
            if (data.length < 2) {
                document.querySelector('#error').innerHTML = 'Please wait for second player.';
            } else {
                onlinePlayer = {...onlinePlayer, ...chars[char.value]};
                onlinePlayer['socketID'] = socketID;
                socket.emit('charCheck', onlinePlayer);
                localStorage.setItem('player', JSON.stringify(onlinePlayer));
                localStorage.setItem('chatLog', JSON.stringify(messages));
            }
        });
    } else {
        char = document.querySelector('#charTwo');
        onlinePlayer = {...onlinePlayer, ...chars[char.value]};
        onlinePlayer['socketID'] = socketID;
        socket.emit('charCheck', onlinePlayer);
        localStorage.setItem('player', JSON.stringify(onlinePlayer));
        localStorage.setItem('chatLog', JSON.stringify(messages));
    }
}

document.querySelector('#onlinePlay').addEventListener('click', onlinePlay);
