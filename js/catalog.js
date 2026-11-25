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

  document.querySelector('#catalog-count').textContent = 'Найдено: ' + list.length + ' из ' + animeList.length;
  document.querySelector('#catalog-empty').hidden = list.length > 0;
}

const catalogFilters = document.querySelector('#catalog-filters');

if (catalogFilters) {
  for (const key of filterKeys) {
    const values = [...new Set(animeList.flatMap((anime) => anime.filters[key]))];
    for (const value of values) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      catalogFilters.querySelector('[name="' + key + '"]').append(option);
    }
  }

  function readCatalogFilters() {
    const filters = {};
    for (const key of filterKeys) {
      filters[key] = catalogFilters.querySelector('[name="' + key + '"]').value;
    }
    return filters;
  }

  function updateCatalog() {
    const matches = filterAnime(animeList, readCatalogFilters());
    renderCatalog(matches);
  }

  catalogFilters.addEventListener('change', updateCatalog);
  document.querySelector('#reset-catalog').addEventListener('click', () => {
    for (const key of filterKeys) {
      catalogFilters.querySelector('[name="' + key + '"]').value = '';
    }
    updateCatalog();
  });
  updateCatalog();
}
