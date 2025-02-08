class Game {
    constructor() {
        this.$circle = document.querySelector('#circle');
        this.$moneyDisplay = document.getElementById('money');

        this.money = 0;
        this.clickMultiplier = 1;
        this.coinScore = 0;
        this.coinInterval = null;
        this.achievements = [];
        this.prestigeCount = 0;

        this.upgrades = [
            { name: 'Добавить 1 монету за клик', cost: 50, effect: () => { this.clickMultiplier += 1; } },
            { name: 'Удвоить скорость клика', cost: 100, effect: () => { this.clickMultiplier *= 2; } },
            { name: 'Увеличить заработок за клик', cost: 150, effect: () => { this.clickMultiplier += 1; } },
            { name: 'Добавить авто-кликер (1 в секунду)', cost: 200, effect: () => { /* Логика для авто-кликера */ } },
            { name: 'Снижение времени спавна монет', cost: 250, effect: () => { /* Логика тут */ } },
            { name: 'Увеличить скорость спавна монет', cost: 300, effect: () => { /* Логика здесь */ } },
            { name: 'Бонус за поимку монеты', cost: 350, effect: () => { this.clickMultiplier += 1; } },
            { name: 'Увеличить максимальный счет', cost: 400, effect: () => { /* Логика сюда */ } },
            { name: 'Случайная награда', cost: 450, effect: () => { this.money += Math.floor(Math.random() * 100) + 1; } },
            { name: 'Увеличить прибыль от автокликера', cost: 500, effect: () => { this.clickMultiplier += 1; } }
        ];

        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.setupCoinCollector();
        this.setupUpgrades();
        this.updatePrestigeDisplay(); // Обновляем отображение престижа
    }

    loadGame() {
        this.money = Number(localStorage.getItem('money')) || 0;
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        this.prestigeCount = Number(localStorage.getItem('prestigeCount')) || 0;
        this.updateMoneyDisplay();
    }

    setupEventListeners() {
        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        document.getElementById('restartCoinGameButton').addEventListener('click', () => this.restartCoinCollector());
        document.getElementById('resetProgress').addEventListener('click', () => this.confirmReset());
        document.getElementById('themeButton').addEventListener('click', () => this.toggleTheme());
        document.getElementById('prestigeButton').addEventListener('click', () => this.checkPrestige());
        this.setupTabSwitching();
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');

                // Убираем активный класс у всех вкладок и содержимого
                tabContents.forEach(tc => {
                    tc.classList.remove('active');
                });
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Устанавливаем новый активный класс
                const currentTabContent = document.getElementById(tabName);
                currentTabContent.classList.add('active');
                button.classList.add('active');
            });
        });
    }

    addMoney(amount) {
        if (amount < 0) return; // Проверка на отрицательные значения
        this.money += amount;
        this.checkForAchievements();
        this.updateMoneyDisplay();
    }

    updateMoneyDisplay() {
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
        this.updatePrestigeDisplay(); // Обновляем отображение престижа
    }

    checkForAchievements() {
        if (this.money >= 100 && !this.achievements.includes("Собрано 100 звёздных очков")) {
            this.achievements.push("Собрано 100 звёздных очков");
            this.showAchievement("Собрано 500 звёздных очков"); // Пример достижения
        }
        this.saveGame();
    }

    showAchievement(message) {
        const achievementList = document.getElementById('achievementList');
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement';
        achievementItem.textContent = message;
        achievementList.appendChild(achievementItem);
    }

    setupCoinCollector() {
        this.coinScore = 0;
        document.getElementById('coinScore').textContent = `Счет: ${this.coinScore}`;
        this.startCoinCollector();
    }

    startCoinCollector() {
        this.createCoin();
        this.coinInterval = setInterval(() => this.createCoin(), 2000);
    }

    createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.top = `${Math.random() * (this.getCoinGameAreaHeight() - 30)}px`;
        coin.style.left = `${Math.random() * (this.getCoinGameAreaWidth() - 30)}px`;

        coin.addEventListener('click', () => {
            this.coinScore++;
            this.addMoney(1);
            document.getElementById('coinScore').textContent = `Счет: ${this.coinScore}`;
            coin.remove();
        });

        document.getElementById('coinGameArea').appendChild(coin);
    }

    getCoinGameAreaHeight() {
        return document.getElementById('coinGameArea').clientHeight;
    }

    getCoinGameAreaWidth() {
        return document.getElementById('coinGameArea').clientWidth;
    }

    restartCoinCollector() {
        clearInterval(this.coinInterval);
        this.setupCoinCollector();
    }

    setupUpgrades() {
        const upgradeList = document.getElementById('upgradeList');
        upgradeList.innerHTML = '';

        this.upgrades.forEach((upgrade, index) => {
            const upgradeCard = document.createElement('div');
            upgradeCard.className = 'upgrade-card';
            upgradeCard.innerHTML = `
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-cost">Цена: ${upgrade.cost} Звёздных очков</div>
                <button class="upgrade-btn" data-index="${index}">Купить</button>
            `;

            upgradeCard.querySelector('.upgrade-btn').addEventListener('click', () => this.purchaseUpgrade(index));
            upgradeList.appendChild(upgradeCard);
        });
    }

    purchaseUpgrade(index) {
        const upgrade = this.upgrades[index];
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            upgrade.effect();
            this.showNotification(`Улучшение "${upgrade.name}" приобретено!`, 'success');
            this.setupUpgrades();
            this.updateMoneyDisplay();
        } else {
            this.showNotification('Недостаточно Звёздных очков для этого улучшения!', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.getElementById('notifications').appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    confirmReset() {
        const confirmed = confirm("Вы уверены, что хотите сбросить прогресс?");
        if (confirmed) {
            this.resetProgress();
        }
    }

    resetProgress() {
        this.money = 0;
        this.achievements = [];
        this.prestigeCount = 0; // Сбрасываем величину престижа
        this.saveGame();
        this.updateMoneyDisplay();
        document.getElementById('achievementList').innerHTML = '';
        this.updatePrestigeDisplay(); // Обновляем отображение
        this.showNotification('Прогресс сброшен!', 'success');
    }

    checkPrestige() {
        if (this.money >= 5000) {
            this.performPrestige();
        } else {
            this.showNotification('Нужно 5000 Звёздных очков для престижа!', 'error');
        }
    }

    performPrestige() {
        this.prestigeCount++;
        this.money = 0; // Сбросить деньги при престиже
        this.clickMultiplier += 1; // Увеличить награду за клик
        this.saveGame();
        this.updateMoneyDisplay();
        this.showNotification(`Престиж успешно выполнен! Получено +1 к награде за клик. Престиж: ${this.prestigeCount}`, 'success');
        this.updatePrestigeDisplay();
    }

    updatePrestigeDisplay() {
        const prestigeDisplay = document.getElementById('prestigeStatus');
        prestigeDisplay.innerHTML = `Престиж: ${this.prestigeCount}, Награда за клик: ${this.clickMultiplier}`;
    }

    saveGame() {
        localStorage.setItem('money', this.money);
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
        localStorage.setItem('prestigeCount', this.prestigeCount);
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const currentTheme = document.body.classList.contains('light-theme') ? '🌙' : '🌞';
        document.getElementById('themeButton').textContent = currentTheme;
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
