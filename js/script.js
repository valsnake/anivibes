function getRandomAnime(list, shownIds) {
  const choices = list.filter((anime) => !shownIds.has(anime.id));
  if (choices.length === 0) return null;
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
  document.querySelector('#anime-details-link').href = 'anime.html?id=' + encodeURIComponent(anime.id);
}

const selectionForm = document.querySelector('#selection-form');

if (selectionForm) {
  let currentAnime = animeList.find((anime) => !lists.watched.includes(anime.id)) || null;
  const status = document.querySelector('#selection-status');
  const count = document.querySelector('#match-count');
  const saveButton = document.querySelector('#save-anime');
  const watchButton = document.querySelector('#watch-anime');
  const previousButton = document.querySelector('#previous-anime');
  const nextButton = document.querySelector('#next-anime');
  const restartButton = document.querySelector('#restart-button');
  const shown = new Set(currentAnime ? [currentAnime.id] : []);

  function updateCardButtons() {
    const saved = currentAnime !== null && lists.saved.includes(currentAnime.id);
    const watched = currentAnime !== null && lists.watched.includes(currentAnime.id);
    saveButton.disabled = currentAnime === null;
    watchButton.disabled = currentAnime === null;
    saveButton.textContent = saved ? 'Убрать из отложенного' : 'Отложить';
    watchButton.textContent = watched ? 'Снять отметку просмотра' : 'Просмотрено';
    saveButton.setAttribute('aria-pressed', String(saved));
    watchButton.setAttribute('aria-pressed', String(watched));
    updateNavigationButtons();
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

  createFilterFields(selectionForm, animeList, document.querySelector('#random-button'));
  let appliedFilters = readFilters();

  function readFilters() {
    return getFilterValues(selectionForm);
  }

  function getMatches(filters) {
    const available = animeList.filter((anime) => !lists.watched.includes(anime.id));
    return filterAnime(available, filters);
  }

  function updateCount() {
    const matches = getMatches(readFilters());
    count.textContent = 'Подходит: ' + matches.length + ' из ' + animeList.length;
    return matches;
  }

  function selectAnime(startOver = false) {
    const filters = readFilters();
    if (startOver || currentAnime === null || JSON.stringify(filters) !== JSON.stringify(appliedFilters)) {
      shown.clear();
    }
    appliedFilters = filters;
    const matches = updateCount();

    if (matches.length === 0) {
      currentAnime = null;
      restartButton.hidden = true;
      renderAnime(currentAnime);
      updateCardButtons();
      status.textContent = 'По выбранным условиям ничего не найдено.';
      return;
    }

    const nextAnime = getRandomAnime(matches, shown);
    if (nextAnime === null) {
      restartButton.hidden = false;
      status.textContent = 'Все подходящие варианты уже показаны. Можно начать заново или изменить условия.';
      updateCardButtons();
      return;
    }

    currentAnime = nextAnime;
    shown.add(currentAnime.id);
    restartButton.hidden = true;
    renderAnime(currentAnime);
    updateCardButtons();
    status.textContent = matches.length === 1
      ? 'По этим условиям найден один вариант.'
      : 'Подобрано: ' + currentAnime.title;
  }

  function updateNavigationButtons() {
    const canSwitch = getMatches(appliedFilters).length > 1;
    previousButton.disabled = !canSwitch;
    nextButton.disabled = !canSwitch;
  }

  function switchAnime(direction) {
    const matches = getMatches(appliedFilters);
    if (matches.length < 2) return;
    const currentIndex = matches.findIndex((anime) => anime.id === currentAnime?.id);
    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : matches.length - 1)
      : (currentIndex + direction + matches.length) % matches.length;
    currentAnime = matches[nextIndex];
    shown.add(currentAnime.id);
    renderAnime(currentAnime);
    updateCardButtons();
    status.textContent = 'Подобрано: ' + currentAnime.title;
  }

  previousButton.addEventListener('click', () => switchAnime(-1));
  nextButton.addEventListener('click', () => switchAnime(1));

  selectionForm.addEventListener('change', () => {
    updateCount();
    status.textContent = 'Условия изменены. Нажмите «Подобрать аниме», чтобы обновить карточку.';
  });

  document.querySelector('#random-button').addEventListener('click', () => selectAnime());
  restartButton.addEventListener('click', () => selectAnime(true));

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
    resetFilterValues(selectionForm);
    selectAnime(true);
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
