// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Данные игры
    let coins = 0;
    let clickPower = 1;
    
    // Элементы интерфейса
    const coinCountElement = document.getElementById('coin-count');
    const clickPowerElement = document.getElementById('click-power');
    const clickerBtn = document.getElementById('clicker-btn');
    const buyButtons = document.querySelectorAll('.buy-btn');

    // Обработчик кликов
    clickerBtn.addEventListener('click', () => {
        coins += clickPower;
        updateDisplay();
        clickerBtn.classList.add('click-animation');
        setTimeout(() => clickerBtn.classList.remove('click-animation'), 200);
        saveProgress();
    });

    // Обработчики для кнопок улучшений
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            if(button.disabled) return;
            
            const cost = parseInt(button.dataset.cost);
            const power = parseInt(button.dataset.power);
            
            if(coins >= cost) {
                coins -= cost;
                clickPower += power;
                button.disabled = true;
                button.textContent = "Куплено";
                updateDisplay();
                saveProgress();
            }
        });
    });

    // Обновление интерфейса
    function updateDisplay() {
        coinCountElement.textContent = coins;
        clickPowerElement.textContent = clickPower;
    }

    // Сохранение прогресса
    function saveProgress() {
        localStorage.setItem('coins', coins);
        localStorage.setItem('clickPower', clickPower);
        localStorage.setItem('upgrades', JSON.stringify(Array.from(buyButtons).map(btn => btn.disabled)));
    }

    // Загрузка прогресса
    function loadProgress() {
        coins = parseInt(localStorage.getItem('coins')) || 0;
        clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
        const upgrades = JSON.parse(localStorage.getItem('upgrades')) || [];
        
        buyButtons.forEach((btn, index) => {
            btn.disabled = upgrades[index] || false;
            if(btn.disabled) btn.textContent = "Куплено";
        });
        
        updateDisplay();
    }

    // Инициализация
    loadProgress();
});