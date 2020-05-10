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
let battle = false;
let turn = 0;
let p1StartRoll = 0;
let p2StartRoll = 0;
let roll = 0;
let oldPositions = {
    playerOne: 0,
    playerTwo: 0
}
let rolling;

const canvas = document.querySelector('#canvas');
const idealWidth = 1280;
const idealHeight = 850;
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
let tokenWidth = 0;
let tokenHeight = 0;

const popTopBar = () => {
    document.querySelector('#playerOneToken').innerHTML = `<img src="${playerOne.imgUrl}" alt="${playerOne.name}">`;
    document.querySelector('#playerTwoToken').innerHTML = `<img src="${playerTwo.imgUrl}" alt="${playerTwo.name}">`;
    document.querySelector('#playerOneInfo').innerHTML = `<p>Character: ${playerOne.name}</p><p>Player name: ${playerOne.nick}</p>`;
    document.querySelector('#playerTwoInfo').innerHTML = `<p>Character: ${playerTwo.name}</p><p>Player name: ${playerTwo.nick}</p>`;
}

const decideStarter = selecter => {
    document.querySelector('#gameOverlay').style.display = 'block';
    document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Roll for who to start.</p><p>${playerOne.nick} roll first.</p>`;
    if (selecter === 'p1') {
        document.querySelector('#playerOne').addEventListener('click', decideStarterTwo);
    }
}

const decideStarterTwo = () => {
    document.querySelector('#playerOne').removeEventListener('click', decideStarterTwo);
    rolling = setInterval(() => {
        rollingDice(playerOne.nr);
    }, 100);
    if (window.location.search.substring(1) === 'online') {
        let data = {
            nr: 1,
            sessionID: playerOne.sessionID
        }
        socket.emit('roll', data);
    }
    setTimeout(() => {
        clearInterval(rolling);
        let roll = _.random(1,6);
        if (window.location.search.substring(1) === 'online') {
            let data = {
                nr: 1,
                sessionID: playerOne.sessionID,
                roll: roll
            }
            socket.emit('decideRolled', data);
        }
        switchRollDecider(roll);
    }, 2500);
}

const switchRollDecider = roll => {
    let dices = ['assets/svg/p1Dice1.svg','assets/svg/p1Dice2.svg','assets/svg/p1Dice3.svg','assets/svg/p1Dice4.svg','assets/svg/p1Dice5.svg','assets/svg/p1Dice6.svg'];
    document.querySelector('#p1DiceWrapper').innerHTML = `<img src="${dices[roll - 1]}" alt="Player 1 Dice" class="dice">`;
    p1StartRoll = roll;
    document.querySelector('#gameOverlay').style.display = 'block';
    document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>Roll for who to start.</p><p>${playerTwo.nick} roll second.</p>`;
    if (window.location.search.substring(1) === 'local' || player.nr === 2) {
        document.querySelector('#playerTwo').addEventListener('click', decideStarterThree);
    }
}

const decideStarterThree = () => {
    document.querySelector('#playerTwo').removeEventListener('click', decideStarterThree);
    rolling = setInterval(() => {
        rollingDice(playerTwo.nr);
    }, 100);
    if (window.location.search.substring(1) === 'online') {
        let data = {
            nr: 2,
            sessionID: playerTwo.sessionID
        }
        socket.emit('roll', data);
    }
    setTimeout(() => {
        clearInterval(rolling);
        let roll = _.random(1,6);
        if (window.location.search.substring(1) === 'online') {
            let data = {
                nr: 2,
                sessionID: playerTwo.sessionID,
                roll: roll
            }
            socket.emit('decideRolled', data);
        }
        rollDecided(roll);
    }, 2500);
}

const rollDecided = roll => {
    let dices = ['assets/svg/p2Dice1.svg','assets/svg/p2Dice2.svg','assets/svg/p2Dice3.svg','assets/svg/p2Dice4.svg','assets/svg/p2Dice5.svg','assets/svg/p2Dice6.svg'];
    document.querySelector('#p2DiceWrapper').innerHTML = `<img src="${dices[roll - 1]}" alt="Player 2 Dice" class="dice">`;
    p2StartRoll = roll;
    if (p1StartRoll > p2StartRoll) {
        turn = 1;
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${playerOne.nick} starts.</p>`;
        if (window.location.search.substring(1) === 'local' || player.nr === 1) {
            initiateBoard();
        }
    } else if (p2StartRoll > p1StartRoll) {
        turn = 2;
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${playerTwo.nick} starts.</p>`;
        if (window.location.search.substring(1) === 'local' || player.nr === 1) {
            initiateBoard();
        }
    } else if (p1StartRoll === p2StartRoll) {
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>You rolled the same, try again.</p><p>${playerOne.nick} roll first.</p>`;
        if (window.location.search.substring(1) === 'local' || player.nr === 1) {
            document.querySelector('#playerOne').addEventListener('click', decideStarterTwo);
        }
    }
}

const initiateBoard = () => {
    fetch('assets/data/coords.json')
        .then(resolve => {
            resolve.json().then(data => {
                let coords = data;
                fetch('assets/data/tiles.json')
                    .then(resolve => {
                        resolve.json().then(data => {
                            tiles = _.shuffle(data);
                            if (window.location.search.substring(1) === 'online') {
                                let data = {
                                    sessionID: playerOne.sessionID,
                                    tiles: tiles,
                                    coords: coords
                                }
                                socket.emit('tilesData', data);
                            }
                            finishInitBoard(coords);
                        })
                    })
                    .catch(err => {console.log(err)});
            })
        })
        .catch(err => {console.log(err)});
}

const finishInitBoard = coords => {
    goalX = canvas.width * 0.205;
    goalY = canvas.height * 0.23;
    startX = canvas.width * 0.6;
    startY = canvas.height - ((canvas.height * 0.12) + 5);
    playerOneToken.src = 'assets/svg/player1.svg';
    playerOneToken.onload = () => {
        playerTwoToken.src = 'assets/svg/player2.svg';
        playerTwoToken.onload = () => {
            tokenWidth = canvas.width * 0.05;
            let tokenFactor = tokenWidth / playerTwoToken.width;
            tokenHeight = playerTwoToken.height * tokenFactor;
            playerOne['coords'] = [{x: (startX + (tokenWidth / 2)), y: (startY + tokenHeight)}];
            playerTwo['coords'] = [{x: (startX + tokenWidth), y: (startY + tokenHeight)}];
            for (let i=0;i < tiles.length;i++) {
                tiles[i].x = canvas.width * coords[i].x;
                tiles[i].y = canvas.height * coords[i].y;
                playerOne.coords.push({x: tiles[i].x, y: (tiles[i].y + (tokenHeight / 1.9))});
                playerTwo.coords.push({x: tiles[i].x, y: (tiles[i].y - (tokenHeight / 7))});
            }
            playerOne.coords.push({x: (goalX + (tokenWidth / 2)), y: (goalY + tokenHeight)});
            playerTwo.coords.push({x: (goalX + tokenWidth), y: (goalY + tokenHeight)});
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(playerOneToken, playerOne.coords[0].x, playerOne.coords[0].y, tokenWidth, tokenHeight);
            ctx.drawImage(playerTwoToken, playerTwo.coords[0].x, playerTwo.coords[0].y, tokenWidth, tokenHeight);
        }
    }
    if (window.location.search.substring(1) === 'local') {
        document.querySelector('#playerOne').addEventListener('click', playerOneRoll);
        document.querySelector('#playerTwo').addEventListener('click', playerTwoRoll);
    } else {
        if (player.nr === 1) {
            document.querySelector('#playerOne').addEventListener('click', playerOneRoll);
        } else {
            document.querySelector('#playerTwo').addEventListener('click', playerTwoRoll);
        }
    }
}

const move = (positionOne, positionTwo, p) => {
    if (p === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(playerOneToken, playerOne.coords[positionOne].x, playerOne.coords[positionOne].y, tokenWidth, tokenHeight);
        ctx.drawImage(playerTwoToken, playerTwo.coords[positionTwo].x, playerTwo.coords[positionTwo].y, tokenWidth, tokenHeight);
    } else {
        let n = 40;
        let steps = 0;
        let frameX = 0;
        let frameY = 0;
        let newX = 0;
        let newY = 0;
        if (p === 1) {
            frameX = playerOne.coords[oldPositions.playerOne].x;
            frameY = playerOne.coords[oldPositions.playerOne].y;
            newX = playerOne.coords[positionOne].x;
            newY = playerOne.coords[positionOne].y;
            oldPositions.playerOne = positionOne;
       } else {
           frameX = playerTwo.coords[oldPositions.playerTwo].x;
           frameY = playerTwo.coords[oldPositions.playerTwo].y;
           newX = playerTwo.coords[positionTwo].x;
           newY = playerTwo.coords[positionTwo].y;
           oldPositions.playerTwo = positionTwo;
       }
       let incrementX = (newX - frameX) / n;
       let incrementY = (newY - frameY) / n;
       const drawToken = () => {
           if (steps < n) {
               frameX += incrementX;
               frameY += incrementY;
               ctx.clearRect(0, 0, canvas.width, canvas.height);
               if (p === 1) {
                   ctx.drawImage(playerOneToken, frameX, frameY, tokenWidth, tokenHeight);
                   ctx.drawImage(playerTwoToken, playerTwo.coords[positionTwo].x, playerTwo.coords[positionTwo].y, tokenWidth, tokenHeight);
               } else {
                   ctx.drawImage(playerOneToken, playerOne.coords[positionOne].x, playerOne.coords[positionOne].y, tokenWidth, tokenHeight);
                   ctx.drawImage(playerTwoToken, frameX, frameY, tokenWidth, tokenHeight);
               }
               steps++;
               window.requestAnimationFrame(drawToken);
           } else {
               if (p === 1) {
                   if (positionOne > 30) {
                       winGame(playerOne);
                   }
               } else {
                   if (positionTwo > 30) {
                       winGame(playerTwo);
                   }
               }
           }
       }
       window.requestAnimationFrame(drawToken);
    }
}

const rollingDice = p => {
    let roll = _.random(1,6);
    document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="assets/svg/p${p}Dice${roll}.svg" alt="Player ${p} Dice" class="dice">`;
}

const battleRollingDice = p => {
    let roll1 = _.random(1,6);
    let roll2 = _.random(1,6);
    let roll3 = _.random(1,6);
    let roll4 = _.random(1,6);
    let roll5 = _.random(1,6);
    document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="assets/svg/p${p}Dice${roll1}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${roll2}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${roll3}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${roll4}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${roll5}.svg" alt="Player ${p} Dice" class="dice">`;
}

const playerMoveRolled = (p, roll) => {
    document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="assets/svg/p${p}Dice${roll}.svg" alt="Player ${p} Dice" class="dice">`;
    for (let i=0;i < roll;i++) {
        let num = i + 1;
        let movingPlayer;
        if (p === 1) {
            playerOne.position++;
            movingPlayer = playerOne;
        } else {
            playerTwo.position++;
            movingPlayer = playerTwo;
        }
        let pos1 = playerOne.position;
        let pos2 = playerTwo.position;
        if (i === (roll - 1)) {
            setTimeout(() => {
                battleCheck(tiles[movingPlayer.position - 1], movingPlayer, p);
            }, 750 * (num + 1));
        }
        setTimeout(() => {
            move(pos1, pos2, p);
        }, 750 * num);
    }
}

const battleRolled = (rolls, battlePlayer) => {
    let p = battlePlayer.nr;
    let tile = tiles[battlePlayer.position - 1];
    document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="assets/svg/p${p}Dice${rolls[0]}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${rolls[1]}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${rolls[2]}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${rolls[3]}.svg" alt="Player ${p} Dice" class="dice"><img src="assets/svg/p${p}Dice${rolls[4]}.svg" alt="Player ${p} Dice" class="dice">`;
    let hit = _.filter(rolls, obj => {
        return obj >= tile.roll;
    });
    if (hit.length < tile.dices) {
        move(playerOne.position, playerTwo.position, 0);
        const loss = new Image();
        loss.src = 'assets/svg/lossTile.svg';
        loss.onload = () => {
            let width = canvas.width / 2;
            let factor = width / loss.width;
            let height = loss.width * factor;
            let x = (canvas.width / 2) - (width / 2);
            let y = (canvas.height / 2) - (height / 2);
            ctx.drawImage(loss, x, y, width, height);
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${battlePlayer.nick} lost the battle.</p><p>${battlePlayer.nick} move back 2 tiles.</p>`;
            battle = false;
            for (let i=0;i < 2;i++) {
                let num = i + 1;
                if (battlePlayer.nr === 1) {
                    playerOne.position--;
                } else {
                    playerTwo.position--;
                }
                let pos1 = playerOne.position;
                let pos2 = playerTwo.position;
                setTimeout(() => {
                    move(pos1, pos2, battlePlayer.nr);
                }, 750 * num);
            }
            setTimeout(() => {
                if (roll !== 6) {
                    if (battlePlayer.nr === 1) {
                        turn = 2;
                    } else {
                        turn = 1;
                    }
                } else {
                    document.querySelector('#gameOverlay').style.display = 'block';
                    document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${battlePlayer.nick} rolled a 6, and takes another turn!</p>`;
                }
                document.querySelector(`#p${p}DiceWrapper`).style.width = '50px';
                document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="assets/svg/p${p}Dice1.svg" alt="Player ${p} Dice" class="dice">`;
            }, 2500);
        }
    } else {
        move(playerOne.position, playerTwo.position, 0);
        const win = new Image();
        win.src = 'assets/svg/winTile.svg';
        win.onload = () => {
            let width = canvas.width / 2;
            let factor = width / win.width;
            let height = win.height * factor;
            let x = (canvas.width / 2) - (width / 2);
            let y = (canvas.height / 2) - (height / 2);
            ctx.drawImage(win, x, y, width, height);
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${battlePlayer.nick} won the battle.</p><p>Congratulations!</p>`;
            battle = false;
            setTimeout(() => {
                move(playerOne.position, playerTwo.position, 0);
                if (roll !== 6) {
                    if (battlePlayer.nr === 1) {
                        turn = 2;
                    } else {
                        turn = 1;
                    }
                } else {
                    document.querySelector('#gameOverlay').style.display = 'block';
                    document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${battlePlayer.nick} rolled a 6, and takes another turn!</p>`;
                }
                document.querySelector(`#p${p}DiceWrapper`).style.width = '50px';
                document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="assets/svg/p${p}Dice1.svg" alt="Player ${p} Dice" class="dice">`;
            }, 2000);
        }
    }
}

const playerOneRoll = () => {
    if (turn === 1) {
        if (!battle) {
            rolling = setInterval(() => {
                rollingDice(playerOne.nr);
            }, 100);
            if (window.location.search.substring(1) === 'online') {
                let data = {
                    nr: 1,
                    sessionID: playerOne.sessionID
                }
                socket.emit('roll', data);
            }
            setTimeout(() => {
                clearInterval(rolling);
                roll = _.random(1,6);
                if (window.location.search.substring(1) === 'online') {
                    let data = {
                        nr: 1,
                        sessionID: playerOne.sessionID,
                        roll: roll
                    }
                    socket.emit('moveRolled', data);
                }
                playerMoveRolled(1, roll);
            }, 2500);
        } else {
            rolling = setInterval(() => {
                battleRollingDice(playerOne.nr)
            }, 100);
            if (window.location.search.substring(1) === 'online') {
                let data = {
                    nr: 1,
                    sessionID: playerOne.sessionID
                }
                socket.emit('battleRoll', data);
            }
            setTimeout(() => {
                clearInterval(rolling);
                let roll1 = _.random(1,6);
                let roll2 = _.random(1,6);
                let roll3 = _.random(1,6);
                let roll4 = _.random(1,6);
                let roll5 = _.random(1,6);
                let rolls = [roll1, roll2, roll3, roll4, roll5];
                battleRolled(rolls, playerOne);
                if (window.location.search.substring(1) === 'online') {
                    let data = {
                        player: playerOne,
                        rolls: rolls
                    }
                    socket.emit('battleRolled', data);
                }
            }, 2500);
        }
    } else {
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${playerTwo.nick}'s turn!</p>`;
    }
}

const playerTwoRoll = () => {
    if (turn === 2) {
        if (!battle) {
            rolling = setInterval(() => {
                rollingDice(playerTwo.nr);
            }, 100);
            if (window.location.search.substring(1) === 'online') {
                let data = {
                    nr: 2,
                    sessionID: playerTwo.sessionID
                }
                socket.emit('roll', data);
            }
            setTimeout(() => {
                clearInterval(rolling);
                roll = _.random(1,6);
                if (window.location.search.substring(1) === 'online') {
                    let data = {
                        nr: 2,
                        sessionID: playerTwo.sessionID,
                        roll: roll
                    }
                    socket.emit('moveRolled', data);
                }
                playerMoveRolled(2, roll);
            }, 2500);
        } else {
            rolling = setInterval(() => {
                battleRollingDice(playerTwo.nr);
            }, 100);
            if (window.location.search.substring(1) === 'online') {
                let data = {
                    nr: 2,
                    sessionID: playerTwo.sessionID
                }
                socket.emit('battleRoll', data);
            }
            setTimeout(() => {
                clearInterval(rolling);
                let roll1 = _.random(1,6);
                let roll2 = _.random(1,6);
                let roll3 = _.random(1,6);
                let roll4 = _.random(1,6);
                let roll5 = _.random(1,6);
                let rolls = [roll1, roll2, roll3, roll4, roll5];
                battleRolled(rolls, playerTwo);
                if (window.location.search.substring(1) === 'online') {
                    let data = {
                        player: playerTwo,
                        rolls: rolls
                    }
                    socket.emit('battleRolled', data);
                }
            }, 2500);
        }
    } else {
        document.querySelector('#gameOverlay').style.display = 'block';
        document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${playerOne.nick}'s turn!</p>`;
    }
}

const battleCheck = (tile, battlePlayer, n) => {
    if (tile.battle) {
        battle = true;
        battleFunction(battlePlayer, n);
    } else {
        if (roll !== 6) {
            if (n === 1) {
                turn = 2;
            } else {
                turn = 1;
            }
        } else {
            document.querySelector('#gameOverlay').style.display = 'block';
            document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${battlePlayer.nick} rolled a 6, and takes another turn!</p>`;
        }
    }
}

const battleFunction = (battlePlayer, p) => {
    let tile = tiles[battlePlayer.position - 1];
    document.querySelector(`#p${p}DiceWrapper`).style.width = '250px';
    let dice = `assets/svg/p${p}Dice1.svg`;
    document.querySelector(`#p${p}DiceWrapper`).innerHTML = `<img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice"><img src="${dice}" alt="Player ${p} Dice" class="dice">`;
    const monster = new Image();
    monster.src = tile.imgUrl;
    monster.onload = () => {
        let n = Math.round((canvas.height / 1.5) / 15);
        let width = 0;
        let height = 0;
        let factor = monster.height / monster.width;
        let steps = 0;
        const drawBattleTile = () => {
            const battleTile = new Image();
            battleTile.src = 'assets/svg/battleTile.svg';
            battleTile.onload = () => {
                let width = canvas.width / 2;
                let factor = width / battleTile.width;
                let height = battleTile.height * factor;
                let x = (canvas.width / 2) - (width / 2);
                let y = (canvas.height / 2) - (height / 2);
                ctx.drawImage(battleTile, x, y, width, height);
                document.querySelector('#gameOverlay').style.display = 'block';
                document.querySelector('#gameOverlay').innerHTML = `<div class="clearfix"><button id="closeOverlay" onclick="closeOverlay();">Close</button></div><p>${battlePlayer.nick} meet ${tile.opponent}. Get ready to battle.</p><p>${battlePlayer.nick} need to roll ${tile.dices} dice with ${tile.roll} or higher roll.</p>`;

            }
        }
        const drawMonster = () => {
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
                    ctx.drawImage(playerTwoToken, tiles[indexTwo].x, (tiles[indexTwo].y - (tokenTwoHeight / 7)), tokenTwoWidth, tokenTwoHeight);
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

const winGame = winner => {
    let timeoutIdRoof = setTimeout(';');
    for (let i=0;i < timeoutIdRoof;i++) {
        clearTimeout(i);
    }
    localStorage.setItem('winner', JSON.stringify(winner));
    if (window.location.search.substring(1) === 'local') {
        localStorage.removeItem('p1');
        localStorage.removeItem('p2');
        window.location.href = 'finish.html?local';
    } else {
        window.location.href = 'finish.html?online';
    }
}

const closeOverlay = () => {
    document.querySelector('#gameOverlay').style.display = 'none';
    document.querySelector('#gameOverlay').innerHTML = '';
}
