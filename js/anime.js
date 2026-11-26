const params = new URLSearchParams(window.location.search);
const animeId = params.get('id');
const anime = animeList.find((item) => item.id === animeId);

if (anime) {
  const poster = document.querySelector('#anime-poster');
  poster.src = anime.poster;
  poster.alt = 'Обложка аниме «' + anime.title + '»';

  document.querySelector('#anime-title').textContent = anime.title;
  document.querySelector('#anime-meta').textContent = anime.type + ' · ' + anime.year;
  document.querySelector('#anime-genre').textContent = anime.genre;
  document.querySelector('#anime-description').textContent = anime.description;
  document.title = anime.title + ' — ANIVIBES';
  document.querySelector('meta[name="description"]').content = anime.description;
  document.querySelector('#anime-details').hidden = false;
} else {
  document.querySelector('#anime-not-found').hidden = false;
  document.title = 'Аниме не найдено — ANIVIBES';
}
