// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Состояние игры
    let state = {
        coins: 0,
        clickPower: 1,
        upgrades: [false, false, false]
    };

    // Элементы интерфейса
    const elements = {
        coins: document.getElementById('coin-count'),
        power: document.getElementById('click-power'),
        clicker: document.getElementById('clicker-btn'),
        upgrades: document.querySelectorAll('.buy-btn')
    };

    // Инициализация игры
    function init() {
        loadProgress();
        setupEventListeners();
        updateUI();
    }

    // Обработчики событий
    function setupEventListeners() {
        elements.clicker.addEventListener('click', handleClick);
        elements.upgrades.forEach((btn, index) => {
            btn.addEventListener('click', () => handleUpgrade(index));
        });
    }

    // Основной клик
    function handleClick() {
        state.coins += state.clickPower;
        elements.clicker.classList.add('click-effect');
        setTimeout(() => elements.clicker.classList.remove('click-effect'), 200);
        updateUI();
        saveProgress();
    }

    // Покупка улучшения
    function handleUpgrade(index) {
        const btn = elements.upgrades[index];
        const cost = parseInt(btn.dataset.cost);
        const power = parseInt(btn.dataset.power);

        if (state.coins >= cost && !state.upgrades[index]) {
            state.coins -= cost;
            state.clickPower += power;
            state.upgrades[index] = true;
            btn.disabled = true;
            btn.textContent = "Куплено";
            updateUI();
            saveProgress();
        }
    }

    // Обновление интерфейса
    function updateUI() {
        elements.coins.textContent = state.coins;
        elements.power.textContent = state.clickPower;
    }

    // Сохранение прогресса
    function saveProgress() {
        localStorage.setItem('clickerGame', JSON.stringify(state));
    }

    // Загрузка прогресса
    function loadProgress() {
        const saved = localStorage.getItem('clickerGame');
        if (saved) {
            state = JSON.parse(saved);
            elements.upgrades.forEach((btn, index) => {
                if (state.upgrades[index]) {
                    btn.disabled = true;
                    btn.textContent = "Куплено";
                }
            });
        }
    }

    // Запуск игры
    init();
});