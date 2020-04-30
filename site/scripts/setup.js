let chars = [];

function localPlay() {
    fetch('assets/data/chars.json')
        .then(resolve => {
            resolve.json().then(data => {
                chars = data;
                let options = '';
                for (let i=0;i < chars.length;i++) {
                    options += `<option value="${i}">${chars[i].name}</option>`;
                }
                document.querySelector('main').innerHTML = `<div class="fullWidth">
                        <p id="error"></p>
                    </div>
                    <div class="playSelection">
                        <label for="charOne">Player 1 character: </label>
                        <select id="charOne" onchange="charPreview(this);">
                            ${options}
                        </select>
                        <label for="charOneNick">Player 1 name: </label>
                        <input type="text" id="charOneNick">
                        <div id="charOneSelected">
                            <h2>${chars[0].name}</h2>
                            <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                            <p><b>Class:</b> ${chars[0].class}</p>
                            <p><b>Weapon:</b> ${chars[0].weapon}</p>
                            <p><b>Gender:</b> ${chars[0].gender}</p>
                        </div>
                    </div>
                    <div class="playSelection">
                        <label for="charTwo">Player 2 character: </label>
                        <select id="charTwo" onchange="charPreview(this);">
                            ${options}
                        </select>
                        <label for="charTwoNick">Player 2 name: </label>
                        <input type="text" id="charTwoNick">
                        <div id="charTwoSelected">
                            <h2>${chars[0].name}</h2>
                            <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                            <p><b>Class:</b> ${chars[0].class}</p>
                            <p><b>Weapon:</b> ${chars[0].weapon}</p>
                            <p><b>Gender:</b> ${chars[0].gender}</p>
                        </div>
                    </div>
                    <div class="fullWidth">
                        <button onClick="location.reload();">Back</button>
                        <button onClick="startGame();">Play</button>
                    </div>`;
                    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
            })
        })
        .catch(err => {console.log(err)});
}

function onlinePlay() {
    document.querySelector('main').innerHTML = '<h2>We are sorry, but we do not support online play yet.</h2><button class="center" onClick="location.reload();">Back</button>';
}

function charPreview(e) {
    document.querySelector(`#${e.id}Selected`).innerHTML = `<h2>${chars[e.value].name}</h2>
        <img src="${chars[e.value].imgUrl}" alt="${chars[e.value].name}">
        <p><b>Class:</b> ${chars[e.value].class}</p>
        <p><b>Weapon:</b> ${chars[e.value].weapon}</p>
        <p><b>Gender:</b> ${chars[e.value].gender}</p>`;
}

function startGame() {
    let playerOne = document.querySelector('#charOne');
    let playerTwo = document.querySelector('#charTwo');
    if (playerOne.value === playerTwo.value) {
        document.querySelector('#error').innerHTML = `Both players can't select the same character.`;
        window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
        let charOne = chars[playerOne.value];
        let charTwo = chars[playerTwo.value];
        charOne['nick'] = document.querySelector('#charOneNick').value;
        charTwo['nick'] = document.querySelector('#charTwoNick').value;
        localStorage.setItem('p1', JSON.stringify(charOne));
        localStorage.setItem('p2', JSON.stringify(charTwo));
        window.location.href = 'game.html';
    }
}

document.querySelector('#localPlay').addEventListener('click', localPlay);
document.querySelector('#onlinePlay').addEventListener('click', onlinePlay);
