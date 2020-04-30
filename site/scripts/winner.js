let winner = JSON.parse(localStorage.getItem('winner'));
if (winner) {
    document.querySelector('#playerInfo').innerHTML = `<h2>${winner.name}</h2>
        <p>${winner.nick}</p>
        <div><img src="${winner.imgUrl}" alt="${winner.name}"></div>`;
    localStorage.clear();
}

document.querySelector('#restart').addEventListener('click', () => {window.location.href = 'index.html';});
