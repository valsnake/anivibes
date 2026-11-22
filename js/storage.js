const storageKey = 'anivibes-lists-v1';
let storageMessage = '';

function readLists() {
  const empty = { saved: [], watched: [] };
  try {
    const value = localStorage.getItem(storageKey);
    if (value === null) return empty;
    const data = JSON.parse(value);
    if (!data || !Array.isArray(data.saved) || !Array.isArray(data.watched)) {
      throw new Error('Invalid lists');
    }
    const validIds = animeList.map((anime) => anime.id);
    const watched = [...new Set(data.watched.filter((id) => validIds.includes(id)))];
    const saved = [...new Set(data.saved.filter((id) => validIds.includes(id) && !watched.includes(id)))];
    return { saved, watched };
  } catch {
    storageMessage = 'Не удалось загрузить сохранённые списки. Можно пользоваться списками в этой вкладке.';
    return empty;
  }
}

const lists = readLists();

function saveLists() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(lists));
    storageMessage = '';
    return true;
  } catch {
    storageMessage = 'Браузер не сохранил списки. Отметки останутся только до перезагрузки страницы.';
    return false;
  }
}

function toggleSaved(id) {
  if (lists.saved.includes(id)) {
    lists.saved = lists.saved.filter((item) => item !== id);
  } else {
    lists.watched = lists.watched.filter((item) => item !== id);
    lists.saved.push(id);
  }
  saveLists();
}

function toggleWatched(id) {
  if (lists.watched.includes(id)) {
    lists.watched = lists.watched.filter((item) => item !== id);
  } else {
    lists.saved = lists.saved.filter((item) => item !== id);
    lists.watched.push(id);
  }
  saveLists();
}
