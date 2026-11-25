const filterKeys = ['genre', 'type', 'mood', 'duration', 'theme', 'production', 'era', 'composition', 'partState'];

const filterLabels = {
  genre: { label: 'Жанры', empty: 'Любой жанр' },
  type: { label: 'Тип', empty: 'Любой тип' },
  mood: { label: 'Настроение', empty: 'Любое' },
  duration: { label: 'Длительность', empty: 'Любая' },
  theme: { label: 'Тематика', empty: 'Любая тематика' },
  production: { label: 'Производство', empty: 'Любое производство' },
  era: { label: 'Год выхода', empty: 'Любой период' },
  composition: { label: 'Форматы в истории', empty: 'Все форматы' },
  partState: { label: 'Статус', empty: 'Любой статус' },
};

function filterAnime(list, filters) {
  return list.filter((anime) => {
    return filterKeys.every((key) => {
      return !filters[key] || anime.filters[key].includes(filters[key]);
    });
  });
}

function createFilterField(key, list) {
  const field = document.createElement('label');
  field.className = 'filter';

  const title = document.createElement('span');
  title.textContent = filterLabels[key].label;

  const select = document.createElement('select');
  select.name = key;
  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = filterLabels[key].empty;
  select.append(empty);

  const values = [...new Set(list.flatMap((anime) => anime.filters[key]))];
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  }

  field.append(title, select);
  return field;
}

function createAdvancedFilters(list) {
  const details = document.createElement('details');
  details.className = 'advanced-filters glass';
  const summary = document.createElement('summary');
  const arrow = document.createElement('img');
  arrow.className = 'disclosure-chevron';
  arrow.src = 'assets/icons/chevron-down.svg';
  arrow.alt = '';
  arrow.width = 21;
  arrow.height = 21;

  const title = document.createElement('span');
  title.textContent = 'Дополнительные фильтры';
  const action = document.createElement('span');
  action.className = 'disclosure-action';
  const closed = document.createElement('span');
  closed.className = 'when-closed';
  closed.textContent = 'Открыть';
  const open = document.createElement('span');
  open.className = 'when-open';
  open.textContent = 'Свернуть';
  action.append(closed, open);
  summary.append(arrow, title, action);

  const grid = document.createElement('div');
  grid.className = 'advanced-filters__grid';
  for (const key of filterKeys.slice(4)) {
    grid.append(createFilterField(key, list));
  }
  details.append(summary, grid);
  return details;
}

function createFilterFields(panel, list, before) {
  for (const key of filterKeys.slice(0, 4)) {
    panel.insertBefore(createFilterField(key, list), before);
  }
  panel.insertBefore(createAdvancedFilters(list), panel.querySelector('.selection-tools'));
}

function getFilterValues(panel) {
  const filters = {};
  for (const key of filterKeys) {
    filters[key] = panel.querySelector('[name="' + key + '"]').value;
  }
  return filters;
}

function resetFilterValues(panel) {
  for (const key of filterKeys) {
    panel.querySelector('[name="' + key + '"]').value = '';
  }
}