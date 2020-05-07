let winner = JSON.parse(localStorage.getItem('winner'));
if (winner) {
    if (window.location.search.substring(1) === 'local') {
        document.querySelector('#result').innerHTML = `<h1>Congratulations!</h1>
            <div class="fullWidth column">
                <h2>${winner.name}</h2>
                <p>${winner.nick}</p>
                <div><img src="${winner.imgUrl}" alt="${winner.name}"></div>
            </div>
            <p>You won the game!</p>
            <p class="extraMarginTop">Do you want to play another game?</p>
            <div><button id="restart">Go!</button></div>`;
    } else {
        let player = JSON.parse(localStorage.getItem('player'));
        if (winner.nick === player.nick) {
            document.querySelector('#result').innerHTML = `<h1>Congratulations!</h1>
                <div class="fullWidth column">
                    <h2>${winner.name}</h2>
                    <p>${winner.nick}</p>
                    <div><img src="${winner.imgUrl}" alt="${winner.name}"></div>
                </div>
                <p>You won the game!</p>
                <p class="extraMarginTop">Do you want to play another game?</p>
                <div><button id="restart">Go!</button></div>`;
        } else {
            document.querySelector('#result').innerHTML = `<h1>Sorry!</h1>
                <div class="fullWidth column">
                    <h2>${player.name}</h2>
                    <p>${player.nick}</p>
                    <div><img src="${player.imgUrl}" alt="${player.name}"></div>
                </div>
                <p>You lost the game!</p>
                <p class="extraMarginTop">Do you want to play another game?</p>
                <div><button id="restart">Go!</button></div>`;
        }
    }
    localStorage.clear();
}

document.querySelector('#restart').addEventListener('click', () => {window.location.href = 'index.html';});
