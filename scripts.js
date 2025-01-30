// Данные игры
let coins = 0;
let clickPower = 1;
let autoClickerPower = 0;
let multiplier = 1;

// Элементы интерфейса
const coinCountElement = document.getElementById('coin-count');
const clickerBtn = document.getElementById('clicker-btn');
const buyButtons = document.querySelectorAll('.buy-btn');

// Загрузка сохраненного прогресса
function loadProgress() {
    const savedCoins = localStorage.getItem('coins');
    const savedClickPower = localStorage.getItem('clickPower');
    const savedAutoClickerPower = localStorage.getItem('autoClickerPower');
    const savedMultiplier = localStorage.getItem('multiplier');

    if (savedCoins) {
        coins = parseInt(savedCoins);
        coinCountElement.textContent = coins;
    }

    if (savedClickPower) {
        clickPower = parseInt(savedClickPower);
    }

    if (savedAutoClickerPower) {
        autoClickerPower = parseInt(savedAutoClickerPower);
    }

    if (savedMultiplier) {
        multiplier = parseInt(savedMultiplier);
    }
}

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('autoClickerPower', autoClickerPower);
    localStorage.setItem('multiplier', multiplier);
}

// Клик по кнопке
clickerBtn.addEventListener('click', () => {
    coins += clickPower * multiplier;
    coinCountElement.textContent = coins;
    clickerBtn.classList.add('click-animation');
    setTimeout(() => clickerBtn.classList.remove('click-animation'), 200);
    saveProgress();
});

// Автоматический доход
setInterval(() => {
    coins += autoClickerPower * multiplier;
    coinCountElement.textContent = coins;
    saveProgress();
}, 1000);

// Покупка улучшений
buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cost = parseInt(button.getAttribute('data-cost'));
        const power = parseInt(button.getAttribute('data-power'));

        if (coins >= cost) {
            coins -= cost;
            if (button.parentElement.id.includes('auto-clicker')) {
                autoClickerPower += power;
            } else if (button.parentElement.id.includes('multiplier')) {
                multiplier *= power;
            } else {
                clickPower += power;
            }
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
