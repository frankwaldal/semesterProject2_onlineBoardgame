if (window.location.search.substring(1) === 'local') {
    let charOne = JSON.parse(localStorage.getItem('p1'));
    let charTwo = JSON.parse(localStorage.getItem('p2'));
    playerOne = {...playerOne, ...charOne};
    playerTwo = {...playerTwo, ...charTwo};
    playerOne['nr'] = 1;
    playerTwo['nr'] = 2;
    popTopBar();
    decideStarter('p1');
}
