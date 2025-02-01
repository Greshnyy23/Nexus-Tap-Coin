class Game {
    constructor() {
        this.$circle = document.querySelector('#circle');
        this.$moneyDisplay = document.getElementById('money');
        this.$levelDisplay = document.getElementById('levelDisplay');
        this.$clickSpeedButton = document.getElementById('clickSpeedButton');
        this.$autoClickButton = document.getElementById('autoClickButton');
        this.$multiplierButton = document.getElementById('multiplierButton');

        this.money = 100;
        this.level = 1;
        this.autoClickerActive = false;
        this.clickMultiplier = 1;
        this.autoClickerInterval;

        this.upgrades = {
            clickSpeed: { cost: 50, baseCost: 50 },
            autoClick: { cost: 100, baseCost: 100 },
            multiplier: { cost: 150, baseCost: 150 }
        };

        this.achievements = [];
        this.minigameScore = 0;
        this.isMinigameActive = false;

        this.init();
    }

    init() {
        this.loadGame();
        this.updateUpgradeInterface();
        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        this.$clickSpeedButton.addEventListener('click', () => this.buyUpgrade('clickSpeed'));
        this.$autoClickButton.addEventListener('click', () => this.buyUpgrade('autoClick'));
        this.$multiplierButton.addEventListener('click', () => this.buyUpgrade('multiplier'));
        document.getElementById('startMinigameButton').addEventListener('click', () => this.startMinigame());
        document.getElementById('restartMinigameButton').addEventListener('click', () => this.restartMinigame());
        document.getElementById('resetProgress').addEventListener('click', () => this.resetProgress());
        this.setupTabSwitching();
        
        setInterval(() => {
            this.saveGame();
        }, 10000); // Save every 10 seconds
    }

    loadGame() {
        this.money = Number(localStorage.getItem('money')) || 0;
        this.upgrades = {
            clickSpeed: { cost: Number(localStorage.getItem('clickSpeedCost')) || 50, baseCost: 50 },
            autoClick: { cost: Number(localStorage.getItem('autoClickCost')) || 100, baseCost: 100 },
            multiplier: { cost: Number(localStorage.getItem('multiplierCost')) || 150, baseCost: 150 }
        };
    }

    saveGame() {
        localStorage.setItem('money', this.money);
        localStorage.setItem('clickSpeedCost', this.upgrades.clickSpeed.cost);
        localStorage.setItem('autoClickCost', this.upgrades.autoClick.cost);
        localStorage.setItem('multiplierCost', this.upgrades.multiplier.cost);
    }

    addMoney(amount) {
        this.money += amount;
        this.$moneyDisplay.textContent = `${this.money}`;
    }

    updateUpgradeInterface() {
        document.getElementById('clickSpeedCost').textContent = this.upgrades.clickSpeed.cost;
        document.getElementById('autoClickCost').textContent = this.upgrades.autoClick.cost;
        document.getElementById('multiplierCost').textContent = this.upgrades.multiplier.cost;
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            if (upgradeType === 'clickSpeed') {
                this.clickMultiplier++;
            } else if (upgradeType === 'autoClick') {
                this.autoClickerActive = true;
                this.startAutoClicker();
            } else if (upgradeType === 'multiplier') {
                this.clickMultiplier *= 2;
            }

            upgrade.cost = Math.round(upgrade.baseCost * 1.15);
            this.updateUpgradeInterface();
            this.$moneyDisplay.textContent = `${this.money}`;
            this.showNotification(`${upgradeType} куплено!`, 'success');
        } else {
            this.showNotification('Недостаточно монет!', 'error');
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

    startAutoClicker() {
        this.autoClickerInterval = setInterval(() => {
            this.addMoney(1);
        }, 1000);
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

    startMinigame() {
        this.isMinigameActive = true;
        this.minigameScore = 0;
        this.spawnFallingObject();
        this.updateMinigameScore();
        document.getElementById('minigameArea').style.display = 'block';
        document.getElementById('restartMinigameButton').style.display = 'none';
    }

    spawnFallingObject() {
        const fallingObject = document.getElementById('fallingObject');
        fallingObject.style.left = Math.random() * (this.$circle.offsetWidth - 30) + 'px';
        fallingObject.style.top = '0px';
        fallingObject.style.display = 'block';

        let fallInterval = setInterval(() => {
            let currentTop = parseInt(fallingObject.style.top);
            if (currentTop >= this.$circle.offsetHeight - 30) {
                clearInterval(fallInterval);
                fallingObject.style.display = 'none';
                this.endMinigame();
            } else {
                fallingObject.style.top = (currentTop + 5) + 'px';
            }
        }, 100);
    }

    updateMinigameScore() {
        document.getElementById('minigameScore').textContent = `Счет: ${this.minigameScore}`;
    }

    endMinigame() {
        this.isMinigameActive = false;
        document.getElementById('fallingObject').style.display = 'none';
        document.getElementById('finalScore').textContent = `Ваш финальный счет: ${this.minigameScore}`;
        document.getElementById('minigameEnd').style.display = 'block';
    }

    restartMinigame() {
        this.startMinigame();
        document.getElementById('minigameEnd').style.display = 'none';
    }

    resetProgress() {
        if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
            this.money = 0;
            this.upgrades = {
                clickSpeed: { cost: 50, baseCost: 50 },
                autoClick: { cost: 100, baseCost: 100 },
                multiplier: { cost: 150, baseCost: 150 }
            };
            this.saveGame();
            this.updateUpgradeInterface();
            this.$moneyDisplay.textContent = `${this.money}`;
            this.showNotification('Прогресс сброшен!', 'success');
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
