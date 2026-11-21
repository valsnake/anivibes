const animeList = [
  {
    "id": "anime-the-apothecary-diaries",
    "title": "Монолог фармацевта",
    "description": "Маомао оказывается при императорском дворе и раскрывает опасные тайны благодаря знаниям о лекарствах и ядах.",
    "type": "Сериал",
    "genre": "Драма",
    "poster": "assets/images/posters/The-apothecary-diaries.jpeg"
  }
]

const randomButton = document.querySelector('#random-button');
if (randomButton) {
  let currentAnime = animeList.length > 0 ? animeList[0] : null;
  renderAnime(currentAnime);
  randomButton.disabled = currentAnime === null;

  randomButton.addEventListener('click', () => {
    currentAnime = getRandomAnime(animeList, currentAnime ? currentAnime.id : null);
    renderAnime(currentAnime);
    if (currentAnime) {
      document.querySelector('#selection-status').textContent = 'Подобрано: ' + currentAnime.title;
    }
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}