let socket = io();
let player;
let sessionID = '';
let socketID = '';

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
socket.on('p1Roll', () => {
    if (player.nr === 2) {
        rolling = setInterval(playerOneRollingDice, 100);
    }
});
socket.on('p1Rolled', data => {
    if (player.nr === 2) {
        clearInterval(rolling);
        let dices = ['assets/svg/p1OneDice.svg','assets/svg/p1TwoDice.svg','assets/svg/p1ThreeDice.svg','assets/svg/p1FourDice.svg','assets/svg/p1FiveDice.svg','assets/svg/p1SixDice.svg'];
        document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dices[data.roll - 1]}" alt="Player 1 Dice" class="dice">`;
        p1StartRoll = data.roll;
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Roll for who to start.</p><p>${playerTwo.nick} roll second.</p>`;
        document.querySelector('#playerTwo').addEventListener('click', decideStarterThree);
    }
});
socket.on('p2Roll', () => {
    if (player.nr === 1) {
        rolling = setInterval(playerTwoRollingDice, 100);
    }
});
socket.on('p2Rolled', data => {
    if (player.nr === 1) {
        clearInterval(rolling);
        let dices = ['assets/svg/p2OneDice.svg','assets/svg/p2TwoDice.svg','assets/svg/p2ThreeDice.svg','assets/svg/p2FourDice.svg','assets/svg/p2FiveDice.svg','assets/svg/p2SixDice.svg'];
        document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dices[data.roll - 1]}" alt="Player 2 Dice" class="dice">`;
        p2StartRoll = data.roll;
        if (p1StartRoll > p2StartRoll) {
            turn = 1;
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${playerOne.nick} starts.</p>`;
            initiateBoard(0, 0);
        } else if (p2StartRoll > p1StartRoll) {
            turn = 2;
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${playerTwo.nick} starts.</p>`;
            initiateBoard(0, 0);
        } else if (p1StartRoll === p2StartRoll) {
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You rolled the same, try again.</p><p>${playerOne.nick} roll first.</p>`;
            document.querySelector('#playerOne').addEventListener('click', decideStarterTwo);
        }
    }
});
socket.on('p1MoveRolled', data => {
    if (player.nr === 2) {
        clearInterval(rolling);
        playerOneMoveRolled(data.roll);
    }
});
socket.on('p2MoveRolled', data => {
    if (player.nr === 1) {
        clearInterval(rolling);
        playerTwoMoveRolled(data.roll);
    }
});
socket.on('p1BattleRoll', data => {
    if (player.nr === 2) {
        rolling = setInterval(playerOneBattleRollingDice, 100);
    }
});
socket.on('p2BattleRoll', data => {
    if (player.nr === 1) {
        rolling = setInterval(playerTwoBattleRollingDice, 100);
    }
});
socket.on('p1BattleRolled', data => {
    if (player.nr === 2) {
        clearInterval(rolling);
        playerOneBattleRolled(data.rolls, playerOne);
    }
});
socket.on('p2BattleRolled', data => {
    if (player.nr === 1) {
        clearInterval(rolling);
        playerTwoBattleRolled(data.rolls, playerTwo);
    }
});

if (window.location.search.substring(1) === 'online') {
    document.querySelector('body').innerHTML += `<div id="chat" class="hidden">
        <div id="messages">
        </div>
        <div class="sendBox">
            <textarea id="messageBox" onkeydown="if (event.keyCode === 13){event.preventDefault(); document.querySelector('#sendMessage').click();}"></textarea>
            <button id="sendMessage" onClick="sendMessage();">Send</button>
        </div>
    </div>
    <button id="chatToggle" onClick="toggleChat();">Chat</button>`;
    player = JSON.parse(localStorage.getItem('player'));
    if (player.nr === 1) {
        playerOne = {...playerOne, ...player};
        let data = {...playerOne};
        socket.emit('joinRoom', playerOne.sessionID);
        socket.emit('getPlayerInfo', data);
        playerOne['you'] = true;
        sessionID = playerOne.sessionID;
        socketID = playerOne.socketID;
        nick = playerOne.nick;
        document.querySelector('#playerTwoWrapper').innerHTML = `<div class="diceWrapper" id="p2DiceWrapper">
                <img src="assets/svg/p2OneDice.svg" alt="Player 2 Dice" class="dice">
            </div>
            <div id="playerTwoInfo" class="playerInfo">
            </div>
            <img src="assets/svg/player2.svg" alt="Player 2 Token" class="token" id="p2Token">
            <div id="playerTwoToken" class="playerToken">
            </div>`;
    } else {
        playerTwo = {...playerTwo, ...player};
        playerTwo['you'] = true;
        sessionID = playerTwo.sessionID;
        socketID = playerTwo.socketID;
        nick = playerTwo.nick;
        socket.emit('joinRoom', playerTwo.sessionID);
        document.querySelector('#playerOneWrapper').innerHTML = `<div id="playerOneToken" class="playerToken">
            </div>
            <img src="assets/svg/player1.svg" alt="Player 1 Token" class="token" id="p1Token">
            <div id="playerOneInfo" class="playerInfo">
            </div>
            <div class="diceWrapper" id="p1DiceWrapper">
                <img src="assets/svg/p1OneDice.svg" alt="Player 1 Dice" class="dice">
            </div>`;
    }
}
