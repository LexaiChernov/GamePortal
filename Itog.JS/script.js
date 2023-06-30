const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_TOP = "https://steampay.com/games?sort=popular";

getGames(API_URL_TOP);

async function getGames(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
    })
    const respData = await resp.json();
    console.log(respData);
    showGames(respData);
}

function showGames(data) {
    const gamesEl = document.querySelector('.games');
    gamesEl.innerHTML = '';
    data.gamesI.forEach((game) => {
        const gameEl = document.createElement('div');
        gameEl.classList.add('game');
        gameEl.innerHTML = `
            <div class="game_cover_inner">
                <img src="${game.posterUrlPreview}" 
                     alt="${game.nameRu}" 
                     class="game_cover">
                <div class="game_cover_dark"></div>
            </div>
            <div class="game_info">
                <div class="game_title">${game.nameRu}</div>

                <div class="game_category">${game.genres[0]['genre']}</div>

                ${game.rating && 0<=Number(game.rating) && Number(game.rating<=10) ? 
                 `<div class="game_average game_average_${getClassByRate(game.rating)}">${game.rating}</div>` : 
                 '<div></div>'}      

            </div>
        `;
        gameEl.addEventListener('click', () => openModal(game.gameId));
        gamesEl.appendChild(gameEl);
    });
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return 'green'
    } else if (vote > 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

const API_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const form = document.querySelector('form');
const search = document.querySelector('.header_search');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_SEARCH}${search.value}`;
    if (search.value) {
        getGames(apiSearchUrl);
        search.value = '';
    }
});

const API_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

const modalEl = document.querySelector('.modal');

async function openModal(id) {

    const resp = await fetch(API_DETAILS+id, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
    })

    const respData = await resp.json();
    console.log(respData);

    modalEl.classList.add('modal_show');

    document.body.classList.add('stop_scrolling');
  
    modalEl.innerHTML =  `
        <div class="modal_card">
            <img src="${respData.posterUrlPreview}" alt="game" class="modal_game_backdrop">
            <h2>
                <span class="modal_game_title">${respData.nameRu}</span>
                <span class="modal_game_year"> - ${respData.year} </span>
            </h2>
            <ul class="modal_game_info">
                <li class="modal_game_genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
                ${respData.filmLength ? `<li class="modal_game_runtime">Время - ${respData.gameLength} минут </li>` : ''}                
                <li>Сайт: <a href="${respData.webUrl}" class="modal_game_site">${respData.webUrl}</a></li>
                <li class="modal_game_overview">Описание - ${respData.description}</li>
            </ul>
            <button class="modal_button_close">Закрыть</button>
        </div>
    `;
    const btnClose = document.querySelector('.modal_button_close');
    btnClose.addEventListener('click', () => closeModal());
    
}

function closeModal() {
    modalEl.classList.remove('modal_show');
    document.body.classList.remove('stop_scrolling');
}

window.addEventListener('click', (e) => {
    if (e.target == modalEl) {
        closeModal();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 27) {
        closeModal();
    }
});