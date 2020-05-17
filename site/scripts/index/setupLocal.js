// Fetches character data and puts out HTML for character select on local game.
const localPlay = () => {
    fetch('assets/data/chars.json')
        .then(resolve => {
            resolve.json().then(data => {
                chars = data;
                let options = '';
                for (let i=0;i < chars.length;i++) {
                    options += `<option value="${i}">${chars[i].name}</option>`;
                }
                document.querySelector('main').innerHTML = `<div class="fullWidth flex">
                        <p id="error"></p>
                    </div>
                    <div class="playSelection flex column">
                        <div class="flex mobileColumn">
                            <div class="flex column inputs">
                                <label for="charOne">Player 1 character: </label>
                                <select id="charOne" onchange="charPreview(this);">
                                    ${options}
                                </select>
                            </div>
                            <div class="flex column inputs">
                                <label for="charOneNick">Player 1 name: </label>
                                <input type="text" id="charOneNick">
                            </div>
                        </div>
                        <div id="charOneSelected">
                            <h2>${chars[0].name}</h2>
                            <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                            <p><b>Class:</b> ${chars[0].class}</p>
                            <p><b>Weapon:</b> ${chars[0].weapon}</p>
                            <p><b>Gender:</b> ${chars[0].gender}</p>
                        </div>
                    </div>
                    <div class="playSelection flex column">
                        <div class="flex mobileColumn">
                            <div class="flex column inputs">
                                <label for="charTwo">Player 2 character: </label>
                                <select id="charTwo" onchange="charPreview(this);">
                                    ${options}
                                </select>
                            </div>
                            <div class="flex column inputs">
                                <label for="charTwoNick">Player 2 name: </label>
                                <input type="text" id="charTwoNick">
                            </div>
                        </div>
                        <div id="charTwoSelected">
                            <h2>${chars[0].name}</h2>
                            <img src="${chars[0].imgUrl}" alt="${chars[0].name}">
                            <p><b>Class:</b> ${chars[0].class}</p>
                            <p><b>Weapon:</b> ${chars[0].weapon}</p>
                            <p><b>Gender:</b> ${chars[0].gender}</p>
                        </div>
                    </div>
                    <div class="fullWidth flex">
                        <button onClick="location.reload();">Back</button>
                        <button onClick="startLocalGame();">Play</button>
                    </div>`;
            })
        })
        .catch(err => {console.log(err)});
}

// Checks if different characters chosen and start a local game.
const startLocalGame = () => {
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
        window.location.href = 'game.html?local';
    }
}

document.querySelector('#localPlay').addEventListener('click', localPlay);
