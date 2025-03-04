document.addEventListener('DOMContentLoaded', () => {
    let resources = 0;
    let level = 1;
    let prestigeLevel = 0; // Уровень престижа
    let upgradeCost = 0;
    let miningRate = 1; // Количество ресурсов за клик
    let autoMineInterval;
    let autoMineRate = 0;  // Ресурсы, получаемые автоматически
    let clickMultiplier = 1; // Множитель для клика
    let magnetActive = false; // Активировать магнит
    let magnetDuration = 0; // Время активации магнита в секундах
    let autoMineCost = 100; // Стоимость автодобычи
    let multiplierCost = 200; // Стоимость множителя
    let magnetCost = 500; // Стоимость магнита

    // Загружаем данные из sessionStorage
    function loadGame() {
        const savedResources = sessionStorage.getItem('resources');
        const savedLevel = sessionStorage.getItem('level');
        const savedPrestigeLevel = sessionStorage.getItem('prestigeLevel');
        const savedUpgradeCost = sessionStorage.getItem('upgradeCost');
        const savedMiningRate = sessionStorage.getItem('miningRate');
        const savedAutoMineRate = sessionStorage.getItem('autoMineRate');
        const savedClickMultiplier = sessionStorage.getItem('clickMultiplier');
        
        if (savedResources !== null) resources = parseInt(savedResources);
        if (savedLevel !== null) level = parseInt(savedLevel);
        if (savedPrestigeLevel !== null) prestigeLevel = parseInt(savedPrestigeLevel);
        if (savedUpgradeCost !== null) upgradeCost = parseInt(savedUpgradeCost);
        if (savedMiningRate !== null) miningRate = parseInt(savedMiningRate);
        if (savedAutoMineRate !== null) autoMineRate = parseInt(savedAutoMineRate);
        if (savedClickMultiplier !== null) clickMultiplier = parseFloat(savedClickMultiplier);

        updateResourceCount();
        document.getElementById('level').innerText = level;
        document.getElementById('prestigeLevel').innerText = prestigeLevel;
        document.getElementById('upgradeButton').innerText = `Улучшить (${upgradeCost})`;
        document.getElementById('autoMineButton').innerText = `Автовыработка (${autoMineCost})`;
        document.getElementById('multiplierButton').innerText = `Увеличить клик (${multiplierCost})`;
        document.getElementById('magnetButton').innerText = `Магнит (${magnetCost})`;
    }

    // Сохраняем данные в sessionStorage
    function saveGame() {
        sessionStorage.setItem('resources', resources);
        sessionStorage.setItem('level', level);
        sessionStorage.setItem('prestigeLevel', prestigeLevel);
        sessionStorage.setItem('upgradeCost', upgradeCost);
        sessionStorage.setItem('miningRate', miningRate);
        sessionStorage.setItem('autoMineRate', autoMineRate);
        sessionStorage.setItem('clickMultiplier', clickMultiplier);
    }

    // Обработчик клика по кораблю
    const mineButton = document.getElementById('mineButton');
    if (mineButton) {
        mineButton.addEventListener('click', () => {
            resources += miningRate * clickMultiplier;
            updateResourceCount();
            checkAchievements();
            saveGame();

            // Проверка на достижение 150 уровня
            if (level === 150) {
                promptPrestige();
            }
        });
    }

    // Обработчик улучшения
    const upgradeButton = document.getElementById('upgradeButton');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', () => {
            if (resources >= upgradeCost) {
                resources -= upgradeCost;
                miningRate++;
                level++;
                upgradeCost = Math.ceil(level * 10); // Обновление стоимости улучшения
                document.getElementById('upgradeButton').innerText = `Улучшить (${upgradeCost})`;
                updateResourceCount();
                document.getElementById('level').innerText = level;

                // Начнем автоматическую добычу после улучшения
                if (!autoMineInterval) {
                    startAutoMine();
                }
                saveGame();
            } else {
                showNotification('Недостаточно ресурсов для улучшения!');
            }
        });
    }

    // Автовыработка
    const autoMineButton = document.getElementById('autoMineButton');
    if (autoMineButton) {
        autoMineButton.addEventListener('click', () => {
            if (resources >= autoMineCost) {
                resources -= autoMineCost;
                autoMineRate += 1; // Увеличиваем скорость автодобычи
                autoMineCost = Math.ceil(autoMineCost * 1.5); // Увеличиваем цену
                document.getElementById('autoMineButton').innerText = `Автовыработка (${autoMineCost})`;
                updateResourceCount();
                saveGame();

                // Запускаем автодобычу, если она ещё не запущена
                if (!autoMineInterval) {
                    startAutoMine();
                }
            } else {
                showNotification('Недостаточно ресурсов для автовыработки!');
            }
        });
    }

    // Увеличение клика
    const multiplierButton = document.getElementById('multiplierButton');
    if (multiplierButton) {
        multiplierButton.addEventListener('click', () => {
            if (resources >= multiplierCost) {
                resources -= multiplierCost;
                clickMultiplier++;
                multiplierCost = Math.ceil(multiplierCost * 1.5); // Увеличиваем цену
                document.getElementById('multiplierButton').innerText = `Увеличить клик (${multiplierCost})`;
                updateResourceCount();
                saveGame();
            } else {
                showNotification('Недостаточно ресурсов для увеличения клика!');
            }
        });
    }

    // Магнит
    const magnetButton = document.getElementById('magnetButton');
    if (magnetButton) {
        magnetButton.addEventListener('click', () => {
            if (resources >= magnetCost) {
                resources -= magnetCost;
                magnetActive = true;
                magnetDuration = 10; // Активируем магнит на 10 секунд
                document.getElementById('magnetButton').style.display = 'none'; // Скрыть кнопку
                updateResourceCount();
                saveGame();

                // Сброс активности магнита через 10 секунд
                setTimeout(() => {
                    magnetActive = false;
                    document.getElementById('magnetButton').style.display = 'inline-block'; // Показать кнопку назад
                }, magnetDuration * 1000);
            } else {
                showNotification('Недостаточно ресурсов для магнита!');
            }
        });
    }

    function updateResourceCount() {
        document.getElementById('resourceCount').innerText = resources;
    }

    function checkAchievements() {
        const achievementList = document.getElementById('achievementList');
        achievementList.innerHTML = ''; // Очистить достижения
        if (resources >= 10) {
            achievementList.innerHTML += "<p>Достигнуто: 10 ресурсов</p>";
        }
        if (resources >= 50) {
            achievementList.innerHTML += "<p>Достигнуто: 50 ресурсов</p>";
        }
        if (resources >= 100) {
            achievementList.innerHTML += "<p>Достигнуто: 100 ресурсов</p>";
        }
    }

    function startAutoMine() {
        autoMineInterval = setInterval(() => {
            resources += autoMineRate;
            updateResourceCount();
            checkAchievements();
            saveGame();
        }, 5000); // Каждые 5 секунд
    }

    // Очищаем интервал при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        saveGame();
        clearInterval(autoMineInterval);
    });

    // Функция для переключения между вкладками
    window.openTab = function openTab(evt, tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(tab => {
            tab.style.display = 'none';
        });

        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.style.display = 'block';
        } else {
            console.error("Tab not found:", tabName);
        }

        const clickedButton = evt.currentTarget;
        if (clickedButton) {
            clickedButton.classList.add('active');
        } else {
            console.error("Clicked button not found");
        }
    }

    // Открыть вкладку "Добыча" по умолчанию при загрузке страницы
    openTab(event, 'mineTab');

    // Автообновление интерфейса каждую секунду
    setInterval(() => {
        updateResourceCount();
    }, 1000);

    // Всплывающее уведомление
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.innerText = message;
        notification.style.display = 'block';

        // Скрыть сообщение после 3 секунд
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Описание для престижа
    function promptPrestige() {
        document.getElementById('prestigePrompt').style.display = 'block';
    }

    document.getElementById('confirmPrestige').addEventListener('click', () => {
        prestigeLevel++;
        level = 1; // Сброс уровня
        miningRate = 1; // Сброс скорости добычи
        resources += 100; // Бонус за престиж

        document.getElementById('prestigeLevel').innerText = prestigeLevel;
        document.getElementById('level').innerText = level;
        saveGame();
        document.getElementById('prestigePrompt').style.display = 'none';
    });

    document.getElementById('cancelPrestige').addEventListener('click', () => {
        document.getElementById('prestigePrompt').style.display = 'none'; // Скрыть уведомление
    });
});
