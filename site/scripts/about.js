function expandInfo(e) {
    console.log(e);
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

document.querySelectorAll('.segment h2').forEach(item => {
    item.addEventListener('click', expandInfo);
});
