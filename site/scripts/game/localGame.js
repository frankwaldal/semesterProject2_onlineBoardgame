if (window.location.search.substring(1) === 'local') {
    let charOne = JSON.parse(localStorage.getItem('p1'));
    let charTwo = JSON.parse(localStorage.getItem('p2'));
    playerOne = {...playerOne, ...charOne};
    playerTwo = {...playerTwo, ...charTwo};
    popTopBar();
    decideStarter('local');
}
