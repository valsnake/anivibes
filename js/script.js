const randomButton = document.querySelector('#random-button');

randomButton.addEventListener('click', () => {
  randomButton.textContent = 'Кнопка работает!';
});

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}