let chars = [];

// Expands info segments on front page.
const expandInfo = e => {
    if (e.target.tagName === 'H2') {
        let id = e.target.id.slice(0,-7);
        if (document.querySelector(`#${id}`).classList.contains('closed')) {
            document.querySelector(`#${e.target.id} img`).style.transform = 'rotateX(180deg)';
            document.querySelector(`#${id}`).classList.remove('closed');
            document.querySelector(`#${id}`).classList.add('open');
            document.querySelector(`#${id}`).style.height = `${document.querySelector(`#${id}`).scrollHeight}px`;
        } else {
            document.querySelector(`#${e.target.id} img`).style.transform = 'rotateX(0deg)';
            document.querySelector(`#${id}`).classList.remove('open');
            document.querySelector(`#${id}`).classList.add('closed');
            document.querySelector(`#${id}`).style.height = '34px';
        }
    } else {
        let id = e.target.parentNode.id.slice(0,-7);
        if (document.querySelector(`#${id}`).classList.contains('closed')) {
            document.querySelector(`#${e.target.parentNode.id} img`).style.transform = 'rotateX(180deg)';
            document.querySelector(`#${id}`).classList.remove('closed');
            document.querySelector(`#${id}`).classList.add('open');
            document.querySelector(`#${id}`).style.height = `${document.querySelector(`#${id}`).scrollHeight}px`;
        } else {
            document.querySelector(`#${e.target.parentNode.id} img`).style.transform = 'rotateX(0deg)';
            document.querySelector(`#${id}`).classList.remove('open');
            document.querySelector(`#${id}`).classList.add('closed');
            document.querySelector(`#${id}`).style.height = '34px';
        }
    }
}

// Previews chosen character in selection screen.
const charPreview = e => {
    document.querySelector(`#${e.id}Selected`).innerHTML = `<h2>${chars[e.value].name}</h2>
        <img src="${chars[e.value].imgUrl}" alt="${chars[e.value].name}">
        <p><b>Class:</b> ${chars[e.value].class}</p>
        <p><b>Weapon:</b> ${chars[e.value].weapon}</p>
        <p><b>Gender:</b> ${chars[e.value].gender}</p>`;
}


document.querySelectorAll('.segment h2').forEach(item => {
    item.addEventListener('click', expandInfo);
});
