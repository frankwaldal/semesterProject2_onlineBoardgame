let socket = io();
let inLobby = false;
let messages = [];
let chatAlert;
let nick = '';
let sessionID = '';
let socketID = '';

let winner = JSON.parse(localStorage.getItem('winner'));
if (winner) {
    // Checking if local or online game to decide how to populate the HTML.
    if (window.location.search.substring(1) === 'local') {
        document.querySelector('#result').innerHTML = `<h1>Congratulations!</h1>
            <div class="fullWidth flex column">
                <h2>${winner.nick}</h2>
                <p>${winner.name}</p>
                <div><img src="${winner.imgUrl}" alt="${winner.name}"></div>
            </div>
            <p>You won the game!</p>
            <p class="extraMarginTop">Do you want to play another game?</p>
            <div><button id="restart">Go!</button></div>`;
    } else {
        let player = JSON.parse(localStorage.getItem('player'));
        socket.emit('joinRoom', player.sessionID);
        sessionID = player.sessionID;
        socketID = player.socketID;
        nick = player.nick;
        document.querySelector('body').innerHTML += `<div id="chat" class="hidden">
            <div id="messages">
            </div>
            <div class="sendBox flex">
                <textarea id="messageBox" onkeydown="if (event.keyCode === 13){event.preventDefault(); document.querySelector('#sendMessage').click();}"></textarea>
                <button id="sendMessage" onClick="sendMessage();">Send</button>
            </div>
        </div>
        <button id="chatToggle" onClick="toggleChat();">Chat</button>`;
        messages = JSON.parse(localStorage.getItem('chatLog'));
        // Displays different landing screen depending on if you win or lose.
        if (winner.nick === player.nick) {
            document.querySelector('#result').innerHTML = `<h1>Congratulations!</h1>
                <div class="fullWidth flex column">
                    <h2>${winner.nick}</h2>
                    <p>${winner.name}</p>
                    <div><img src="${winner.imgUrl}" alt="${winner.name}"></div>
                </div>
                <p>You won the game!</p>
                <p class="extraMarginTop">Do you want to play another game?</p>
                <div><button id="restart">Go!</button></div>`;
        } else {
            document.querySelector('#result').innerHTML = `<h1>Sorry!</h1>
                <div class="fullWidth flex column">
                    <h2>${player.nick}</h2>
                    <p>${player.name}</p>
                    <div><img src="${player.imgUrl}" alt="${player.name}"></div>
                </div>
                <p>You lost the game!</p>
                <p class="extraMarginTop">Do you want to play another game?</p>
                <div><button id="restart">Go!</button></div>`;
        }
    }
    localStorage.clear();
}

// Only loads chat if online game, and after the js-file for the chat functionality is loaded.
const loadChat = () => {
    if (window.location.search.substring(1) === 'online') {
        pushMessages();
    }
}

document.querySelector('#restart').addEventListener('click', () => {window.location.href = 'index.html';});
