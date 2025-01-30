// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Данные игры
    let coins = 0;
    let clickPower = 1;
    
    // Элементы интерфейса
    const coinCountElement = document.getElementById('coin-count');
    const clickerBtn = document.getElementById('clicker-btn');
    const buyButtons = document.querySelectorAll('.buy-btn');

    // Обработчик кликов
    clickerBtn.addEventListener('click', () => {
        coins += clickPower;
        updateDisplay();
        clickerBtn.classList.add('click-animation');
        setTimeout(() => clickerBtn.classList.remove('click-animation'), 200);
    });

    // Обработчики для кнопок улучшений
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cost = parseInt(button.dataset.cost);
            const power = parseInt(button.dataset.power);
            
            if(coins >= cost) {
                coins -= cost;
                clickPower += power;
                button.disabled = true;
                button.textContent = "Куплено";
                updateDisplay();
            }
        });
    });

    // Обновление интерфейса
    function updateDisplay() {
        coinCountElement.textContent = coins;
    }

    // Инициализация
    updateDisplay();
});