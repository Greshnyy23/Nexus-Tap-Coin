class Game {
    constructor() {
        this.$circle = document.querySelector('#circle');
        this.$moneyDisplay = document.getElementById('money');

        this.money = 0;
        this.clickMultiplier = 1;
        this.coinScore = 0; // Счет в мини-игре
        this.coinInterval = null; // Интервал для спавна монет
        this.achievements = [];
        this.upgrades = [
            { name: 'Увеличить значение клика', cost: 50, effect: () => { this.clickMultiplier *= 2; } },
            { name: 'Удвоить скорость клика', cost: 100, effect: () => { this.clickMultiplier *= 1.5; } },
            { name: 'Увеличить заработок за клик', cost: 150, effect: () => { this.clickMultiplier += 1; } },
            { name: 'Авто-кликер (1 в секунду)', cost: 200, effect: () => { /* Логика для авто-кликера */ } },
            { name: 'Снижение времени спавна монет', cost: 250, effect: () => { /* Логика тут */ } },
            { name: 'Увеличить скорость спавна монет', cost: 300, effect: () => { /* Логика здесь */ } },
            { name: 'Бонус за поимку монеты', cost: 350, effect: () => { this.clickMultiplier += 1; } },
            { name: 'Увеличить максимальный счет', cost: 400, effect: () => { /* Можно добавить еще логику */ } },
            { name: 'Случайная награда', cost: 450, effect: () => { this.money += Math.floor(Math.random() * 100) + 1; } },
            { name: 'Увеличить прибыль от автокликера', cost: 500, effect: () => { this.clickMultiplier += 1; } }
        ];

        this.init();
    }

    init() {
        this.loadGame();
        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        document.getElementById('restartCoinGameButton').addEventListener('click', () => this.restartCoinCollector());
        document.getElementById('resetProgress').addEventListener('click', () => this.openConfirmationModal());
        this.setupTabSwitching();
        this.setupUpgrades(); // Устанавливаем улучшения при запуске
        document.getElementById('themeButton').addEventListener('click', () => this.toggleTheme());
        this.setupCoinCollector(); // Инициализируем игру с монетами
    }

    loadGame() {
        this.money = Number(localStorage.getItem('money')) || 0;
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    }

    saveGame() {
        localStorage.setItem('money', this.money);
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    addMoney(amount) {
        this.money += amount;
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
        this.checkForAchievements();
    }

    checkForAchievements() {
        if (this.money >= 100 && !this.achievements.includes("Собрано 100 звёздных очков")) {
            this.achievements.push("Собрано 100 звёздных очков");
            this.showAchievement("Собрано 100 звёздных очков");
        }
        if (this.money >= 500 && !this.achievements.includes("Собрано 500 звёздных очков")) {
            this.achievements.push("Собрано 500 звёздных очков");
            this.showAchievement("Собрано 500 звёздных очков");
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

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                tabContents.forEach(tc => tc.classList.remove('active'));
                document.getElementById(tabName).classList.add('active');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // Инициализация игры "Поймай монету"
    setupCoinCollector() {
        this.coinScore = 0;
        document.getElementById('coinScore').textContent = `Счет: ${this.coinScore}`;
        document.getElementById('coinGameArea').innerHTML = '';
        document.getElementById('restartCoinGameButton').style.display = 'none';
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
            document.getElementById('coinScore').textContent = `Счет: ${this.coinScore}`;
            coin.remove(); // Удаляем монету после клика
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
        clearInterval(this.coinInterval);  // Останавливаем интервал
        this.setupCoinCollector(); // Настраиваем заново
    }

    // Система улучшений
    setupUpgrades() {
        const upgradeList = document.getElementById('upgradeList');
        upgradeList.innerHTML = '';  // Очистка списка перед обновлением

        this.upgrades.forEach((upgrade, index) => {
            const upgradeItem = document.createElement('div');
            upgradeItem.className = 'upgrade';
            upgradeItem.innerHTML = `${upgrade.name}<br/><strong>Цена: ${upgrade.cost} Звёздных очков</strong>`;
            upgradeItem.addEventListener('click', () => this.purchaseUpgrade(index));
            upgradeList.appendChild(upgradeItem);
        });
    }

    purchaseUpgrade(index) {
        const upgrade = this.upgrades[index];
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            upgrade.effect();
            alert(`Улучшение "${upgrade.name}" приобретено!`);
            this.updateInterface();
            this.setupUpgrades(); // Обновление списка улучшений
        } else {
            alert('Недостаточно Звёздных очков для этого улучшения!');
        }
    }

    openConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        modal.style.display = 'flex';
    }

    closeConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        modal.style.display = 'none';
    }

    confirmReset() {
        this.money = 0;
        this.achievements = [];
        this.saveGame();
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
        document.getElementById('achievementList').innerHTML = '';
        this.showNotification('Прогресс сброшен!', 'success');
        this.closeConfirmationModal();
    }

    updateInterface() {
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
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

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const currentTheme = document.body.classList.contains('light-theme') ? '🌙' : '🌞';
        document.getElementById('themeButton').textContent = currentTheme;
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();

    // Закрытие модального окна
    document.querySelector('.close-modal').addEventListener('click', () => game.closeConfirmationModal());
    document.getElementById('cancelReset').addEventListener('click', () => game.closeConfirmationModal());
    document.getElementById('confirmReset').addEventListener('click', () => game.confirmReset());
});
