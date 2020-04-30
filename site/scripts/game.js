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
let roll = 0;

document.querySelector('#playerOneToken').innerHTML = `<img src="${playerOne.imgUrl}" alt="${playerOne.name}">`;
document.querySelector('#playerTwoToken').innerHTML = `<img src="${playerTwo.imgUrl}" alt="${playerTwo.name}">`;
document.querySelector('#playerOneInfo').innerHTML = `<p>Character: ${playerOne.name}</p><p>Player name: ${playerOne.nick}</p>`;
document.querySelector('#playerTwoInfo').innerHTML = `<p>Character: ${playerTwo.name}</p><p>Player name: ${playerTwo.nick}</p>`;

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
const playerOneToken = new Image();
const playerTwoToken = new Image();

function decideStarter() {
    document.querySelector('#gameOverlay').style.display = 'block';
    document.querySelector('#gameOverlay').innerHTML = '<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Roll for who to start.</p><p>Player 1 roll first.</p>';
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
        document.querySelector('#gameOverlay').innerHTML = '<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Roll for who to start.</p><p>Player 2 roll second.</p>';
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
            document.querySelector('#gameOverlay').innerHTML = '<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Player 1 starts.</p>';
            initiateBoard(0, 0);
        } else if (p2StartRoll > p1StartRoll) {
            turn = 2;
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = '<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Player 2 starts.</p>';
            initiateBoard(0, 0);
        } else if (p1StartRoll === p2StartRoll) {
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = '<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You rolled the same, try again.</p><p>Player 1 roll first.</p>';
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

    playerOneToken.src = 'assets/svg/player1.svg';
    playerOneToken.onload = function() {
        let tokenWidth = canvas.width * 0.05;
        let tokenFactor = tokenWidth / playerOneToken.width;
        let tokenHeight = playerOneToken.height * tokenFactor;
        if (position === 0) {
            ctx.drawImage(playerOneToken, (startX + (tokenWidth / 2)), (startY + tokenHeight), tokenWidth, tokenHeight);
        } else if (position > 30) {
            ctx.drawImage(playerOneToken, (goalX + (tokenWidth / 2)), (goalY + tokenHeight), tokenWidth, tokenHeight);
            winGame(playerOne);
        } else {
            let index = position - 1;
            ctx.drawImage(playerOneToken, tiles[index].x, (tiles[index].y + (tokenHeight / 1.9)), tokenWidth, tokenHeight);
        }
    }
}

function playerTwoTokenPlace(position) {

    playerTwoToken.src = 'assets/svg/player2.svg';
    playerTwoToken.onload = function() {
        let tokenWidth = canvas.width * 0.05;
        let tokenFactor = tokenWidth / playerTwoToken.width;
        let tokenHeight = playerTwoToken.height * tokenFactor;
        if (position === 0) {
            ctx.drawImage(playerTwoToken, (startX + (tokenWidth)), (startY + tokenHeight), tokenWidth, tokenHeight);
        } else if (position > 30) {
            ctx.drawImage(playerTwoToken, (goalX + (tokenWidth)), (goalY + tokenHeight), tokenWidth, tokenHeight);
            winGame(playerTwo);
        } else {
            let index = position - 1;
            ctx.drawImage(playerTwoToken, tiles[index].x, (tiles[index].y - (tokenHeight / 7)), tokenWidth, tokenHeight);
        }
    }
}

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

function playerOneBattleRollingDice() {
    let dices = ['assets/svg/p1OneDice.svg','assets/svg/p1TwoDice.svg','assets/svg/p1ThreeDice.svg','assets/svg/p1FourDice.svg','assets/svg/p1FiveDice.svg','assets/svg/p1SixDice.svg'];
    let dice1 = _.shuffle(dices);
    let dice2 = _.shuffle(dices);
    let dice3 = _.shuffle(dices);
    let dice4 = _.shuffle(dices);
    let dice5 = _.shuffle(dices);
    document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dice1[0]}" alt="Player 1 Dice" class="dice"><img src="${dice2[0]}" alt="Player 1 Dice" class="dice"><img src="${dice3[0]}" alt="Player 1 Dice" class="dice"><img src="${dice4[0]}" alt="Player 1 Dice" class="dice"><img src="${dice5[0]}" alt="Player 1 Dice" class="dice">`;
}

function playerTwoBattleRollingDice() {
    let dices = ['assets/svg/p2OneDice.svg','assets/svg/p2TwoDice.svg','assets/svg/p2ThreeDice.svg','assets/svg/p2FourDice.svg','assets/svg/p2FiveDice.svg','assets/svg/p2SixDice.svg'];
    let dice1 = _.shuffle(dices);
    let dice2 = _.shuffle(dices);
    let dice3 = _.shuffle(dices);
    let dice4 = _.shuffle(dices);
    let dice5 = _.shuffle(dices);
    document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dice1[0]}" alt="Player 2 Dice" class="dice"><img src="${dice2[0]}" alt="Player 2 Dice" class="dice"><img src="${dice3[0]}" alt="Player 2 Dice" class="dice"><img src="${dice4[0]}" alt="Player 2 Dice" class="dice"><img src="${dice5[0]}" alt="Player 2 Dice" class="dice">`;
}

function playerOneRoll() {
    if (turn === 1) {
        if (!battle) {
            let rolling = setInterval(playerOneRollingDice, 100);
            setTimeout(function() {
                clearInterval(rolling);
                roll = _.random(1,6);
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
                        battle = true;
                        battleFunction(playerOne, 1);
                    } else {
                        if (roll !== 6) {
                            turn = 2;
                        }
                    }
                }
            }, 2500);
        } else {
            let tile = tiles[playerOne.position - 1];
            let rolling = setInterval(playerOneBattleRollingDice, 100);
            setTimeout(function() {
                clearInterval(rolling);
                let roll1 = _.random(1,6);
                let roll2 = _.random(1,6);
                let roll3 = _.random(1,6);
                let roll4 = _.random(1,6);
                let roll5 = _.random(1,6);
                let dices = ['assets/svg/p1OneDice.svg','assets/svg/p1TwoDice.svg','assets/svg/p1ThreeDice.svg','assets/svg/p1FourDice.svg','assets/svg/p1FiveDice.svg','assets/svg/p1SixDice.svg'];
                document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dices[roll1 - 1]}" alt="Player 1 Dice" class="dice"><img src="${dices[roll2 - 1]}" alt="Player 1 Dice" class="dice"><img src="${dices[roll3 - 1]}" alt="Player 1 Dice" class="dice"><img src="${dices[roll4 - 1]}" alt="Player 1 Dice" class="dice"><img src="${dices[roll5 - 1]}" alt="Player 1 Dice" class="dice">`;
                let rolls = [roll1, roll2, roll3, roll4, roll5];
                let hit = _.filter(rolls, obj => {
                    return obj >= tile.roll;
                });
                if (hit.length < tile.dices) {
                    movePieces(playerOne.position, playerTwo.position);
                    const loss = new Image();
                    loss.src = 'assets/svg/lossTile.svg';
                    loss.onload = function() {
                        let width = canvas.width / 2;
                        let factor = width / loss.width;
                        let height = loss.height * factor;
                        let x = (canvas.width / 2) - (width / 2);
                        let y = (canvas.height / 2) - (height / 2);
                        ctx.drawImage(loss, x, y, width, height);
                        document.querySelector('#gameOverlay').style.display = 'block';
                        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You lost the battle.</p><p>You move back 2 tiles.</p>`;
                        battle = false;
                        for (let i=0;i < 2;i++) {
                            let num = i+1;
                            playerOne.position--;
                            let pos = playerOne.position;
                            setTimeout(() => {
                                movePieces(pos, playerTwo.position);
                            }, 750*num);
                        }
                        setTimeout(function() {
                            if (roll !== 6) {
                                turn = 2;
                            }
                            document.querySelector(`#p1DiceWrapper`).style.width = '50px';
                            document.querySelector(`#p1DiceWrapper`).innerHTML = '<img src="assets/svg/p1OneDice.svg" alt="Player 1 Dice" class="dice">';
                        }, 2000);
                    }
                } else {
                    movePieces(playerOne.position, playerTwo.position);
                    const win = new Image();
                    win.src = 'assets/svg/winTile.svg';
                    win.onload = function() {
                        let width = canvas.width / 2;
                        let factor = width / win.width;
                        let height = win.height * factor;
                        let x = (canvas.width / 2) - (width / 2);
                        let y = (canvas.height / 2) - (height / 2);
                        ctx.drawImage(win, x, y, width, height);
                        document.querySelector('#gameOverlay').style.display = 'block';
                        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You won the battle.</p><p>Congratulations!</p>`;
                        battle = false;
                        setTimeout(function() {
                            movePieces(playerOne.position, playerTwo.position);
                            if (roll !== 6) {
                                turn = 2;
                            }
                            document.querySelector(`#p1DiceWrapper`).style.width = '50px';
                            document.querySelector(`#p1DiceWrapper`).innerHTML = '<img src="assets/svg/p1OneDice.svg" alt="Player 1 Dice" class="dice">';
                        }, 2000);
                    }
                }
            }, 2500);
        }
    } else {
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Player 2s turn!</p>`;
    }
}

function playerTwoRoll() {
    if (turn === 2) {
        if (!battle) {
            let rolling = setInterval(playerTwoRollingDice, 100);
            setTimeout(function() {
                clearInterval(rolling);
                roll = _.random(1,6);
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
                        battle = true;
                        battleFunction(playerTwo, 2);
                    } else {
                        if (roll !== 6) {
                            turn = 1;
                        }
                    }
                }
            }, 2500);
        } else {
            let tile = tiles[playerTwo.position - 1];
            let rolling = setInterval(playerTwoBattleRollingDice, 100);
            setTimeout(function() {
                clearInterval(rolling);
                let roll1 = _.random(1,6);
                let roll2 = _.random(1,6);
                let roll3 = _.random(1,6);
                let roll4 = _.random(1,6);
                let roll5 = _.random(1,6);
                let dices = ['assets/svg/p2OneDice.svg','assets/svg/p2TwoDice.svg','assets/svg/p2ThreeDice.svg','assets/svg/p2FourDice.svg','assets/svg/p2FiveDice.svg','assets/svg/p2SixDice.svg'];
                document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dices[roll1 - 1]}" alt="Player 2 Dice" class="dice"><img src="${dices[roll2 - 1]}" alt="Player 2 Dice" class="dice"><img src="${dices[roll3 - 1]}" alt="Player 2 Dice" class="dice"><img src="${dices[roll4 - 1]}" alt="Player 2 Dice" class="dice"><img src="${dices[roll5 - 1]}" alt="Player 2 Dice" class="dice">`;
                let rolls = [roll1, roll2, roll3, roll4, roll5];
                let hit = _.filter(rolls, obj => {
                    return obj >= tile.roll;
                });
                if (hit.length < tile.dices) {
                    movePieces(playerOne.position, playerTwo.position);
                    const loss = new Image();
                    loss.src = 'assets/svg/lossTile.svg';
                    loss.onload = function() {
                        let width = canvas.width / 2;
                        let factor = width / loss.width;
                        let height = loss.height * factor;
                        let x = (canvas.width / 2) - (width / 2);
                        let y = (canvas.height / 2) - (height / 2);
                        ctx.drawImage(loss, x, y, width, height);
                        document.querySelector('#gameOverlay').style.display = 'block';
                        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You lost the battle.</p><p>You move back 2 tiles.</p>`;
                        battle = false;
                        for (let i=0;i < 2;i++) {
                            let num = i+1;
                            playerTwo.position--;
                            let pos = playerTwo.position;
                            setTimeout(() => {
                                movePieces(playerOne.position, pos);
                            }, 750*num);
                        }
                        setTimeout(function() {
                            if (roll !== 6) {
                                turn = 1;
                            }
                            document.querySelector(`#p2DiceWrapper`).style.width = '50px';
                            document.querySelector(`#p2DiceWrapper`).innerHTML = '<img src="assets/svg/p2OneDice.svg" alt="Player 2 Dice" class="dice">';
                        }, 2000);
                    }
                } else {
                    movePieces(playerOne.position, playerTwo.position);
                    const win = new Image();
                    win.src = 'assets/svg/winTile.svg';
                    win.onload = function() {
                        let width = canvas.width / 2;
                        let factor = width / win.width;
                        let height = win.height * factor;
                        let x = (canvas.width / 2) - (width / 2);
                        let y = (canvas.height / 2) - (height / 2);
                        ctx.drawImage(win, x, y, width, height);
                        document.querySelector('#gameOverlay').style.display = 'block';
                        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You won the battle.</p><p>Congratulations!</p>`;
                        battle = false;
                        setTimeout(function() {
                            movePieces(playerOne.position, playerTwo.position);
                            if (roll !== 6) {
                                turn = 1;
                            }
                            document.querySelector(`#p2DiceWrapper`).style.width = '50px';
                            document.querySelector(`#p2DiceWrapper`).innerHTML = '<img src="assets/svg/p2OneDice.svg" alt="Player 2 Dice" class="dice">';
                        }, 2000);
                    }
                }
            }, 2500);
        }
    } else {
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Player 1s turn!</p>`;
    }
}

function battleFunction(player, p) {
    let tile = tiles[player.position - 1];
    document.querySelector(`#p${p}DiceWrapper`).style.width = '250px';
    let dice = `assets/svg/p${p}OneDice.svg`;
    document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice">`;
    const monster = new Image();
    monster.src = tile.imgUrl;
    monster.onload = function() {
        let n = Math.round((canvas.height / 1.5) / 15);
        let width = 0;
        let height = 0;
        let factor = monster.height / monster.width;
        let steps = 0;
        function drawBattleTile() {
            const battleTile = new Image();
            battleTile.src = 'assets/svg/battleTile.svg';
            battleTile.onload = function() {
                let width = canvas.width / 2;
                let factor = width / battleTile.width;
                let height = battleTile.height * factor;
                let x = (canvas.width / 2) - (width / 2);
                let y = (canvas.height / 2) - (height / 2);
                ctx.drawImage(battleTile, x, y, width, height);
                document.querySelector('#gameOverlay').style.display = 'block';
                document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You meet ${tile.opponent}. Get ready to battle.</p><p>You need to roll ${tile.dices} dice with ${tile.roll} or higher roll.</p>`;
            }
        }
        function drawMonster() {
            if (steps < n) {
                height += 15;
                width += 15 / factor;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let tokenOneWidth = canvas.width * 0.05;
                let tokenOneFactor = tokenOneWidth / playerOneToken.width;
                let tokenOneHeight = playerOneToken.height * tokenOneFactor;
                if (playerOne.position === 0) {
                    ctx.drawImage(playerOneToken, (startX + (tokenOneWidth / 2)), (startY + tokenOneHeight), tokenOneWidth, tokenOneHeight);
                } else {
                    let indexOne = playerOne.position - 1;
                    ctx.drawImage(playerOneToken, tiles[indexOne].x, (tiles[indexOne].y + (tokenOneHeight / 1.9)), tokenOneWidth, tokenOneHeight);
                }
                let tokenTwoWidth = canvas.width * 0.05;
                let tokenTwoFactor = tokenTwoWidth / playerTwoToken.width;
                let tokenTwoHeight = playerTwoToken.height * tokenTwoFactor;
                if (playerTwo.position === 0) {
                    ctx.drawImage(playerTwoToken, (startX + (tokenTwoWidth)), (startY + tokenTwoHeight), tokenTwoWidth, tokenTwoHeight);
                } else {
                    let indexTwo = playerTwo.position - 1;
                    ctx.drawImage(playerTwoToken, tiles[indexTwo].x, (tiles[indexTwo].y + (tokenTwoHeight / 1.9)), tokenTwoWidth, tokenTwoHeight);
                }
                ctx.drawImage(monster, (canvas.width - width), (canvas.height - height), width, height);
                steps++;
                window.requestAnimationFrame(drawMonster);
            } else {
                drawBattleTile();
            }
        }
        window.requestAnimationFrame(drawMonster);
    }
}

function winGame(player) {
    let timeoutIdRoof = setTimeout(';');
    for (let i=0;i < timeoutIdRoof;i++) {
        clearTimeout(i);
    }
    localStorage.setItem('winner', JSON.stringify(player));
    localStorage.removeItem('p1');
    localStorage.removeItem('p2');
    window.location.href = 'finish.html';
}

function closeOverlay() {
    document.querySelector('#gameOverlay').style.display = 'none';
    document.querySelector('#gameOverlay').innerHTML = '';
}

decideStarter();
