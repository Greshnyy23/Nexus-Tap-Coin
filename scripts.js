// Данные игры
let coins = 0;
let clickPower = 1;

// Элементы интерфейса
const coinCountElement = document.getElementById('coin-count');
const clickerBtn = document.getElementById('clicker-btn');
const buyButtons = document.querySelectorAll('.buy-btn');

// Загрузка сохраненного прогресса
function loadProgress() {
    const savedCoins = localStorage.getItem('coins');
    const savedClickPower = localStorage.getItem('clickPower');

    if (savedCoins) {
        coins = parseInt(savedCoins);
        coinCountElement.textContent = coins;
    }

    if (savedClickPower) {
        clickPower = parseInt(savedClickPower);
    }
}

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('clickPower', clickPower);
}

// Клик по кнопке
clickerBtn.addEventListener('click', () => {
    coins += clickPower;
    coinCountElement.textContent = coins;
    clickerBtn.classList.add('click-animation');
    setTimeout(() => clickerBtn.classList.remove('click-animation'), 200);
    saveProgress();
});

// Покупка улучшений
buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cost = parseInt(button.getAttribute('data-cost'));
        const power = parseInt(button.getAttribute('data-power'));

        if (coins >= cost) {
            coins -= cost;
            clickPower += power;
            coinCountElement.textContent = coins;
            button.disabled = true;
            button.textContent = "Куплено";
            saveProgress();
        } else {
            alert("Недостаточно монет!");
        }
    });
});

// Инициализация игры
loadProgress();
