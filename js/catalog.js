function createCatalogCard(anime) {
  const card = document.createElement('article');
  card.className = 'catalog-card glass';

  const poster = document.createElement('img');
  poster.className = 'catalog-card__poster';
  poster.src = anime.poster;
  poster.alt = 'Обложка аниме «' + anime.title + '»';
  poster.width = 300;
  poster.height = 400;

  const title = document.createElement('h2');
  title.className = 'catalog-card__title';
  title.textContent = anime.title;

  const meta = document.createElement('p');
  meta.className = 'catalog-card__meta';
  meta.textContent = anime.type + ' · ' + anime.year;

  const description = document.createElement('p');
  description.className = 'catalog-card__description';
  description.textContent = anime.description;

  const genre = document.createElement('p');
  genre.className = 'catalog-card__genre';
  genre.textContent = anime.genre;

  const copy = document.createElement('div');
  copy.className = 'catalog-card__copy';
  copy.append(title, meta, description, genre);
  card.append(poster, copy);
  return card;
}

function renderCatalog(list) {
  const grid = document.querySelector('#catalog-grid');
  grid.replaceChildren();

  for (const anime of list) {
    grid.append(createCatalogCard(anime));
  }

  document.querySelector('#catalog-count').textContent = 'Всего аниме: ' + list.length;
  document.querySelector('#catalog-empty').hidden = list.length > 0;
}

if (document.querySelector('#catalog-grid')) {
  renderCatalog(animeList);
}
