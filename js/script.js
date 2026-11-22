const filterKeys = ['genre', 'type', 'mood', 'duration', 'theme', 'production', 'era', 'composition', 'partState'];

function filterAnime(list, filters) {
  return list.filter((anime) => {
    return filterKeys.every((key) => {
      return !filters[key] || anime.filters[key].includes(filters[key]);
    });
  });
}

function getRandomAnime(list, currentId) {
  if (list.length === 0) return null;
  const otherAnime = list.filter((anime) => anime.id !== currentId);
  const choices = otherAnime.length > 0 ? otherAnime : list;
  return choices[Math.floor(Math.random() * choices.length)];
}

function renderAnime(anime) {
  const card = document.querySelector('#featured-anime');
  const empty = document.querySelector('#selection-empty');
  card.hidden = anime === null;
  empty.hidden = anime !== null;
  if (anime === null) return;

  const poster = document.querySelector('#featured-poster');
  poster.src = anime.poster;
  poster.alt = 'Обложка аниме «' + anime.title + '»';
  document.querySelector('#featured-title').textContent = anime.title;
  document.querySelector('#anime-description').textContent = anime.description;
  document.querySelector('#featured-meta').textContent = anime.type + ' · ' + anime.year + ' · ' + anime.genre;
}

const selectionForm = document.querySelector('#selection-form');

if (selectionForm) {
  let currentAnime = animeList.find((anime) => !lists.watched.includes(anime.id)) || null;
  const status = document.querySelector('#selection-status');
  const count = document.querySelector('#match-count');
  const saveButton = document.querySelector('#save-anime');
  const watchButton = document.querySelector('#watch-anime');

  function updateCardButtons() {
    const saved = currentAnime !== null && lists.saved.includes(currentAnime.id);
    const watched = currentAnime !== null && lists.watched.includes(currentAnime.id);
    saveButton.disabled = currentAnime === null;
    watchButton.disabled = currentAnime === null;
    saveButton.textContent = saved ? 'Убрать из отложенного' : 'Отложить';
    watchButton.textContent = watched ? 'Снять отметку просмотра' : 'Просмотрено';
    saveButton.setAttribute('aria-pressed', String(saved));
    watchButton.setAttribute('aria-pressed', String(watched));
  }

  function renderList(kind) {
    const list = document.querySelector('#' + kind + '-list');
    list.replaceChildren();
    document.querySelector('#' + kind + '-empty').hidden = lists[kind].length > 0;
    for (const id of lists[kind]) {
      const anime = animeList.find((item) => item.id === id);
      const item = document.createElement('li');
      const title = document.createElement('span');
      title.textContent = anime.title;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'text-button';
      button.textContent = kind === 'saved' ? 'Убрать' : 'Вернуть в подбор';
      button.setAttribute('aria-label', button.textContent + ': ' + anime.title);
      button.addEventListener('click', () => {
        if (kind === 'saved') toggleSaved(id);
        else toggleWatched(id);
        renderLibrary();
        status.textContent = 'Отметка снята: ' + anime.title;
      });
      item.append(title, button);
      list.append(item);
    }
  }

function renderLibrary() {
    renderList('saved');
    renderList('watched');
    document.querySelector('#library-count').textContent = lists.saved.length + lists.watched.length;
    const storageStatus = document.querySelector('#storage-status');
    storageStatus.textContent = storageMessage;
    storageStatus.hidden = storageMessage === '';
    updateCardButtons();
    updateCount();
  }

  for (const key of filterKeys) {
    const values = [...new Set(animeList.flatMap((anime) => anime.filters[key]))];
    for (const value of values) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      selectionForm.querySelector('[name="' + key + '"]').append(option);
    }
  }

  function readFilters() {
    const filters = {};
    for (const key of filterKeys) {
      filters[key] = selectionForm.querySelector('[name="' + key + '"]').value;
    }
    return filters;
  }

  function updateCount() {
    const available = animeList.filter((anime) => !lists.watched.includes(anime.id));
    const matches = filterAnime(available, readFilters());
    count.textContent = 'Подходит: ' + matches.length + ' из ' + animeList.length;
    return matches;
  }

  function selectAnime() {
    const matches = updateCount();
    currentAnime = getRandomAnime(matches, currentAnime ? currentAnime.id : null);
    renderAnime(currentAnime);
    updateCardButtons();
    status.textContent = currentAnime
      ? 'Подобрано: ' + currentAnime.title
      : 'По выбранным условиям ничего не найдено в учебном наборе.';
  }

  selectionForm.addEventListener('change', () => {
    updateCount();
    status.textContent = 'Условия изменены. Нажмите «Подобрать аниме», чтобы обновить карточку.';
  });

  document.querySelector('#random-button').addEventListener('click', selectAnime);

  saveButton.addEventListener('click', () => {
    if (!currentAnime) return;
    toggleSaved(currentAnime.id);
    renderLibrary();
    status.textContent = lists.saved.includes(currentAnime.id)
      ? 'Добавлено в отложенное: ' + currentAnime.title
      : 'Убрано из отложенного: ' + currentAnime.title;
  });

  watchButton.addEventListener('click', () => {
    if (!currentAnime) return;
    toggleWatched(currentAnime.id);
    renderLibrary();
    status.textContent = lists.watched.includes(currentAnime.id)
      ? 'Отмечено как просмотренное: ' + currentAnime.title
      : 'Отметка просмотра снята: ' + currentAnime.title;
  });

  function resetFilters() {
    for (const key of filterKeys) {
      selectionForm.querySelector('[name="' + key + '"]').value = '';
    }
    selectAnime();
    status.textContent = 'Фильтры сброшены. Показана рекомендация без ограничений.';
  }

  selectionForm.querySelector('.text-button').addEventListener('click', resetFilters);
  document.querySelector('#reset-empty').addEventListener('click', resetFilters);
  renderAnime(currentAnime);
  renderLibrary();
}

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
  }