let tiles = [];
let startX = 0;
let startY = 0;
let goalX = 0;
let goalY = 0;

let playerOne = {
    position: 0
}
let playerTwo = {
    position: 0
}
let charOne = JSON.parse(localStorage.getItem('p1'));
let charTwo = JSON.parse(localStorage.getItem('p2'));
playerOne = {...playerOne, ...charOne};
playerTwo = {...playerTwo, ...charTwo};
let battle = false;
let turn = 0;
let p1StartRoll = 0;
let p2StartRoll = 0;

const canvas = document.querySelector('#canvas');
let idealWidth = 1280;
let idealHeight = 850;
let width = window.innerWidth - 20;
let factor = width / idealWidth;
let height = idealHeight * factor
if (height > (window.innerHeight - 90)) {
    height = window.innerHeight - 90;
    factor = height / idealHeight;
    width = idealWidth * factor;
}
document.querySelector('#canvasBg').style.height = `${height}px`;
document.querySelector('#canvasBg').style.width = `${width}px`;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

function decideStarter() {
    document.querySelector('#gameOverlay').style.display = 'block';
    document.querySelector('#gameOverlay').innerHTML = '<button id="closeOverlay" onclick="closeOverlay();">Close</button><p>Roll for who to start.</p><p>Player 1 roll first.</p>';
    document.querySelector('#playerOne').addEventListener('click', decideStarterTwo);
}

function decideStarterTwo() {
    document.querySelector('#playerOne').removeEventListener('click', decideStarterTwo);
    let rolling = setInterval(playerOneRollingDice, 100);
    setTimeout(function() {
        clearInterval(rolling);
        let roll = _.random(1,6);
        let dices = ['assets/svg/p1OneDice.svg','assets/svg/p1TwoDice.svg','assets/svg/p1ThreeDice.svg','assets/svg/p1FourDice.svg','assets/svg/p1FiveDice.svg','assets/svg/p1SixDice.svg'];
        document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dices[roll - 1]}" alt="Player 1 Dice" class="dice">`;
        p1StartRoll = roll;
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = '<button id="closeOverlay" onclick="closeOverlay();">Close</button><p>Roll for who to start.</p><p>Player 2 roll second.</p>';
        document.querySelector('#playerTwo').addEventListener('click', decideStarterThree);
    }, 2500);
}

function decideStarterThree() {
    document.querySelector('#playerTwo').removeEventListener('click', decideStarterThree);
    let rolling = setInterval(playerTwoRollingDice, 100);
    setTimeout(function() {
        clearInterval(rolling);
        let roll = _.random(1,6);
        let dices = ['assets/svg/p2OneDice.svg','assets/svg/p2TwoDice.svg','assets/svg/p2ThreeDice.svg','assets/svg/p2FourDice.svg','assets/svg/p2FiveDice.svg','assets/svg/p2SixDice.svg'];
        document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dices[roll - 1]}" alt="Player 2 Dice" class="dice">`;
        p2StartRoll = roll;
        if (p1StartRoll > p2StartRoll) {
            turn = 1;
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = '<button id="closeOverlay" onclick="closeOverlay();">Close</button><p>Player 1 starts.</p>';
            initiateBoard(0, 0);
        } else if (p2StartRoll > p1StartRoll) {
            turn = 2;
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = '<button id="closeOverlay" onclick="closeOverlay();">Close</button><p>Player 2 starts.</p>';
            initiateBoard(0, 0);
        } else if (p1StartRoll === p2StartRoll) {
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = '<button id="closeOverlay" onclick="closeOverlay();">Close</button><p>You rolled the same, try again.</p><p>Player 1 roll first.</p>';
            document.querySelector('#playerOne').addEventListener('click', decideStarterTwo);
        }
    }, 2500);
}

function initiateBoard(positionOne, positionTwo) {
    fetch('assets/data/coords.json')
        .then(resolve => {
            resolve.json().then(data => {
                let coords = data;
                fetch('assets/data/tiles.json')
                    .then(resolve => {
                        resolve.json().then(data => {
                            tiles = _.shuffle(data);
                            goalX = canvas.width * 0.205;
                            goalY = canvas.height * 0.23;
                            startX = canvas.width * 0.6;
                            startY = canvas.height - ((canvas.height * 0.12) + 5);
                            for (let i=0;i < tiles.length;i++) {
                                tiles[i].x = canvas.width * coords[i].x;
                                tiles[i].y = canvas.height * coords[i].y;
                            }
                            playerOneTokenPlace(positionOne);
                            playerTwoTokenPlace(positionTwo);
                            document.querySelector('#playerOne').addEventListener('click', playerOneRoll);
                            document.querySelector('#playerTwo').addEventListener('click', playerTwoRoll);
                        })
                    })
                    .catch(err => {console.log(err)});
            })
        })
        .catch(err => {console.log(err)});
}

function movePieces(positionOne, positionTwo) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerOneTokenPlace(positionOne);
    playerTwoTokenPlace(positionTwo);
}

function playerOneTokenPlace(position) {
    const playerOneToken = new Image();
    playerOneToken.src = 'assets/svg/player1.svg';
    playerOneToken.onload = function() {
        let tokenWidth = canvas.width * 0.05;
        let tokenFactor = tokenWidth / playerOneToken.width;
        let tokenHeight = playerOneToken.height * tokenFactor;
        if (position === 0) {
            ctx.drawImage(playerOneToken, (startX + (tokenWidth / 2)), (startY + tokenHeight), tokenWidth, tokenHeight);
        } else if (position > 30) {
            ctx.drawImage(playerOneToken, (goalX + (tokenWidth / 2)), (goalY + tokenHeight), tokenWidth, tokenHeight);
        } else {
            let index = position - 1;
            ctx.drawImage(playerOneToken, tiles[index].x, (tiles[index].y + (tokenHeight / 1.9)), tokenWidth, tokenHeight);
        }
    }
}

function playerTwoTokenPlace(position) {
    const playerTwoToken = new Image();
    playerTwoToken.src = 'assets/svg/player2.svg';
    playerTwoToken.onload = function() {
        let tokenWidth = canvas.width * 0.05;
        let tokenFactor = tokenWidth / playerTwoToken.width;
        let tokenHeight = playerTwoToken.height * tokenFactor;
        if (position === 0) {
            ctx.drawImage(playerTwoToken, (startX + (tokenWidth)), (startY + tokenHeight), tokenWidth, tokenHeight);
        } else if (position > 30) {
            ctx.drawImage(playerTwoToken, (goalX + (tokenWidth)), (goalY + tokenHeight), tokenWidth, tokenHeight);
        } else {
            let index = position - 1;
            ctx.drawImage(playerTwoToken, tiles[index].x, (tiles[index].y - (tokenHeight / 7)), tokenWidth, tokenHeight);
        }
    }
}

decideStarter();

function playerOneRollingDice() {
    let dices = ['assets/svg/p1OneDice.svg','assets/svg/p1TwoDice.svg','assets/svg/p1ThreeDice.svg','assets/svg/p1FourDice.svg','assets/svg/p1FiveDice.svg','assets/svg/p1SixDice.svg'];
    dices = _.shuffle(dices);
    document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dices[0]}" alt="Player 1 Dice" class="dice">`;
}

function playerTwoRollingDice() {
    let dices = ['assets/svg/p2OneDice.svg','assets/svg/p2TwoDice.svg','assets/svg/p2ThreeDice.svg','assets/svg/p2FourDice.svg','assets/svg/p2FiveDice.svg','assets/svg/p2SixDice.svg'];
    dices = _.shuffle(dices);
    document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dices[0]}" alt="Player 2 Dice" class="dice">`;
}

function playerOneRoll() {
    if (turn === 1) {
        if (!battle) {
            let rolling = setInterval(playerOneRollingDice, 100);
            setTimeout(function() {
                clearInterval(rolling);
                let roll = _.random(1,6);
                let dices = ['assets/svg/p1OneDice.svg','assets/svg/p1TwoDice.svg','assets/svg/p1ThreeDice.svg','assets/svg/p1FourDice.svg','assets/svg/p1FiveDice.svg','assets/svg/p1SixDice.svg'];
                document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dices[roll - 1]}" alt="Player 1 Dice" class="dice">`;
                for (let i=0;i < roll;i++) {
                    let num = i+1;
                    playerOne.position++;
                    let pos = playerOne.position;
                    if (i === (roll-1)) {
                        setTimeout(() => {
                            movePieces(pos, playerTwo.position);
                            if (playerOne.position > 30) {

                            } else {
                                battleCheck();
                            }
                        }, 750*num);
                    } else {
                        setTimeout(() => {
                            movePieces(pos, playerTwo.position);
                        }, 750*num);
                    }
                }
                function battleCheck() {
                    if (tiles[playerOne.position - 1].battle) {
                        console.log('battle');
                    } else {
                        if (roll !== 6) {
                            turn = 2;
                        }
                    }
                }
            }, 2500);
        } else {

        }
    } else {
        alert('Player 2 turn!');
    }
}

function playerTwoRoll() {
    if (turn === 2) {
        if (!battle) {
            let rolling = setInterval(playerTwoRollingDice, 100);
            setTimeout(function() {
                clearInterval(rolling);
                let roll = _.random(1,6);
                let dices = ['assets/svg/p2OneDice.svg','assets/svg/p2TwoDice.svg','assets/svg/p2ThreeDice.svg','assets/svg/p2FourDice.svg','assets/svg/p2FiveDice.svg','assets/svg/p2SixDice.svg'];
                document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dices[roll - 1]}" alt="Player 2 Dice" class="dice">`;
                for (let i=0;i < roll;i++) {
                    let num = i+1;
                    playerTwo.position++;
                    let pos = playerTwo.position;
                    if (i === (roll-1)) {
                        setTimeout(() => {
                            movePieces(playerOne.position, pos);
                            if (playerTwo.position > 30) {

                            } else {
                                battleCheck();
                            }
                        }, 750*num);
                    } else {
                        setTimeout(() => {
                            movePieces(playerOne.position, pos);
                        }, 750*num);
                    }
                }
                function battleCheck() {
                    if (tiles[playerTwo.position - 1].battle) {
                        console.log('battle');
                    } else {
                        if (roll !== 6) {
                            turn = 1;
                        }
                    }
                }
            }, 2500);
        } else {

        }
    } else {
        alert('Player 1 turn!');
    }
}

function closeOverlay() {
    document.querySelector('#gameOverlay').style.display = 'none';
    document.querySelector('#gameOverlay').innerHTML = '';
}
