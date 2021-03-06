let socket = io();
let player;
let inLobby = false;
let messages = [];
let chatAlert;
let nick = '';
let sessionID = '';
let socketID = '';

// socket.io listener for initiating game.
socket.on('getPlayerInfo', data => {
    if (data.nr !== player.nr) {
        if (data.nr === 1) {
            playerOne = {...playerOne, ...data};
            socket.emit('getPlayerInfo', playerTwo);
            popTopBar();
            decideStarter('p2');
        } else {
            playerTwo = {...playerTwo, ...data};
            popTopBar();
            decideStarter('p1');
        }
    }
});
// socket.io listener for rolling dice.
socket.on('roll', data => {
    if (player.nr !== data.nr) {
        rolling = setInterval(() => {
            rollingDice(data.nr);
        }, 100);
    }
});
// socket.io listener for rolling to decide starter.
socket.on('decideRolled', data => {
    if (player.nr !== data.nr) {
        clearInterval(rolling);
        if (data.nr === 1) {
            switchRollDecider(data.roll);
        } else {
            rollDecided(data.roll);
        }
    }
});
// socket.io listener to retrive tiles data from player 1.
socket.on('tilesData', data => {
    if (player.nr === 2) {
        tiles = data.tiles;
        finishInitBoard(data.coords);
    }
});
// socket.io listener for roll result.
socket.on('moveRolled', data => {
    if (player.nr !== data.nr) {
        clearInterval(rolling);
        roll = data.roll;
        playerMoveRolled(data.nr, data.roll);
    }
});
// socket.io listener for rolling dice.
socket.on('battleRoll', data => {
    if (data.nr !== player.nr) {
        rolling = setInterval(() => {
            battleRollingDice(data.nr);
        }, 100);
    }
});
// socket.io listener for roll result.
socket.on('battleRolled', data => {
    if (data.player.nr !== player.nr) {
        clearInterval(rolling);
        battleRolled(data.rolls, data.player);
    }
});

// Initate the game for online play.
if (window.location.search.substring(1) === 'online') {
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
    player = JSON.parse(localStorage.getItem('player'));
    if (player.nr === 1) {
        playerOne = {...playerOne, ...player};
        let data = {...playerOne};
        socket.emit('joinRoom', playerOne.sessionID);
        socket.emit('getPlayerInfo', data);
        sessionID = playerOne.sessionID;
        socketID = playerOne.socketID;
        nick = playerOne.nick;
        document.querySelector('#playerTwoWrapper').innerHTML = `<div class="diceWrapper" id="p2DiceWrapper">
                <img src="assets/svg/p2Dice1.svg" alt="Player 2 Dice" class="dice">
            </div>
            <div id="playerTwoInfo" class="playerInfo">
            </div>
            <img src="assets/svg/player2.svg" alt="Player 2 Token" class="token" id="p2Token">
            <div id="playerTwoToken" class="playerToken flex">
            </div>`;
    } else {
        playerTwo = {...playerTwo, ...player};
        sessionID = playerTwo.sessionID;
        socketID = playerTwo.socketID;
        nick = playerTwo.nick;
        socket.emit('joinRoom', playerTwo.sessionID);
        document.querySelector('#playerOneWrapper').innerHTML = `<div id="playerOneToken" class="playerToken flex">
            </div>
            <img src="assets/svg/player1.svg" alt="Player 1 Token" class="token" id="p1Token">
            <div id="playerOneInfo" class="playerInfo">
            </div>
            <div class="diceWrapper" id="p1DiceWrapper">
                <img src="assets/svg/p1Dice1.svg" alt="Player 1 Dice" class="dice">
            </div>`;
    }
}

// Loads chat when in online game.
const loadChat = () => {
    if (window.location.search.substring(1) === 'online') {
        pushMessages();
    }
}
