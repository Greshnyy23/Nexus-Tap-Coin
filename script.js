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
        this.lastSaveTime = Date.now();
        this.onlineTime = 0;
        this.offlineTime = 0;

        this.upgrades = {
            clickSpeed: { cost: 50, baseCost: 50 },
            autoClick: { cost: 100, baseCost: 100 },
            multiplier: { cost: 150, baseCost: 150 }
        };

        this.init();
    }

    init() {
        this.loadGame();
        this.updateUpgradeInterface();
        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        this.$clickSpeedButton.addEventListener('click', () => this.buyUpgrade('clickSpeed'));
        this.$autoClickButton.addEventListener('click', () => this.buyUpgrade('autoClick'));
        this.$multiplierButton.addEventListener('click', () => this.buyUpgrade('multiplier'));
        this.setupTabSwitching();
        
        setInterval(() => {
            this.lastSaveTime = Date.now();
            this.offlineTime += 1000;
            this.saveGame();
        }, 1000);
        
        document.addEventListener('DOMContentLoaded', this.startAutoClicker.bind(this));
    }

    startAutoClicker() {
        if (this.autoClickerActive) {
            this.autoClickerInterval = setInterval(() => {
                this.addMoney(1); // Automatically earn money
            }, 1000);
        }
    }

    loadGame() {
        this.money = Number(localStorage.getItem('money')) || 0;
        this.lastSaveTime = Number(localStorage.getItem('lastSaveTime')) || Date.now();
        this.offlineTime = Number(localStorage.getItem('offlineTime')) || 0;

        const currentTime = Date.now();
        this.onlineTime += Math.floor((currentTime - this.lastSaveTime) / 1000);
        this.money += this.onlineTime * 5; // Earn money based on time spent in the game
        this.setMoney(this.money);

        const offlineSeconds = Math.floor(this.offlineTime / 1000);
        this.money += Math.floor(offlineSeconds / 5); // Earn money while offline
        this.setMoney(this.money);
    }

    saveGame() {
        localStorage.setItem('money', this.money);
        localStorage.setItem('lastSaveTime', this.lastSaveTime);
        localStorage.setItem('offlineTime', this.offlineTime);
    }

    setMoney(newMoney) {
        this.money = newMoney;
        localStorage.setItem('money', this.money);
        this.$moneyDisplay.textContent = `${this.money}`;
    }

    addMoney(amount) {
        this.setMoney(this.money + amount);
        this.showNotification(`Вы получили ${amount} монет!`, 'success');
        this.animateClickEffect();
    }

    animateClickEffect() {
        const clickEffect = document.getElementById('clickEffect');
        clickEffect.classList.add('animate');
        setTimeout(() => {
            clickEffect.classList.remove('animate');
        }, 300);
    }

    updateUpgradeInterface() {
        document.getElementById('clickSpeedCost').textContent = this.upgrades.clickSpeed.cost;
        document.getElementById('autoClickCost').textContent = this.upgrades.autoClick.cost;
        document.getElementById('multiplierCost').textContent = this.upgrades.multiplier.cost;
    }

    increaseUpgradeCost(upgrade) {
        return Math.round(upgrade.baseCost * 1.15);
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (this.checkResources(upgrade.cost)) {
            if (upgradeType === 'clickSpeed') {
                this.clickMultiplier++;
            } else if (upgradeType === 'autoClick' && !this.autoClickerActive) {
                this.autoClickerActive = true;
                this.startAutoClicker();
            } else if (upgradeType === 'multiplier') {
                this.clickMultiplier *= 2; // Дважды увеличить множитель
            }
            upgrade.cost = this.increaseUpgradeCost(upgrade); // Увеличение цены
            this.updateUpgradeInterface();
            this.showNotification(`${upgradeType} улучшение куплено!`, 'success');
        } else {
            this.showNotification('Недостаточно монет для улучшения!', 'error');
        }
    }

    checkResources(cost) {
        return this.money >= cost;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.getElementById('notifications').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                const content = document.getElementById(tabName);
                
                // Сворачивает и разворачивает вкладки
                tabContents.forEach(tc => tc.classList.remove('active'));
                content.classList.add('active');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
}

// Инициализация игры
const game = new Game();
