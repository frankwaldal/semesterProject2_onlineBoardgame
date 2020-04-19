var canvas = document.querySelector('#canvas');
let idealWidth = 1280;
let idealHeight = 850;
let width = window.innerWidth - 20;
let factor = width / idealWidth;
let height = idealHeight * factor
if (height > window.innerHeight) {
    height = window.innerHeight - 20;
    factor = height / idealHeight;
    width = idealWidth * factor;
}
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');


const bgImg = new Image();
bgImg.src = 'assets/imgs/mountainPath.jpg';
bgImg.onload = function() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    drawTiles();
}

function drawTiles() {
    const goalTile = new Image();
    goalTile.src = 'assets/svg/goalTile.svg';
    goalTile.onload = function() {
        let x = canvas.width * 0.2;
        let y = canvas.height * 0.2;
        let tileWidth = canvas.width * 0.12;
        let tileFactor = tileWidth / goalTile.width;
        let tileHeight = goalTile.height * tileFactor;
        ctx.drawImage(goalTile, x, y, tileWidth, tileHeight);
    }

    const startTile = new Image();
    startTile.src = 'assets/svg/startTile.svg';
    startTile.onload = function() {
        let x = canvas.width * 0.6;
        let tileWidth = canvas.width * 0.12;
        let tileFactor = tileWidth / goalTile.width;
        let tileHeight = goalTile.height * tileFactor;
        let y = canvas.height - (tileHeight + 5);
        ctx.drawImage(startTile, x, y, tileWidth, tileHeight);
    }
}
