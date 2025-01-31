let currency = 82863.87; // Кредиты по умолчанию
let diamonds = 152703; // Начальное количество алмазов
const tasks = {
    mergeDale: 0,
    mergeAway: 0,
    doodleGod: 0
};

document.getElementById('currency').textContent = currency.toFixed(2);
document.getElementById('diamonds').textContent = diamonds;

// Обработчик события нажатия на кнопку "Заработать кредиты"
document.getElementById('earnButton').addEventListener('click', earnCredits);

// Функция для зарабатывания кредитов
function earnCredits() {
    const earned = Math.floor(Math.random() * 100) + 1; // Случайное количество кредитов
    currency += earned;
    document.getElementById('currency').textContent = currency.toFixed(2);
    
    // Увеличиваем прогресс задания
    if (tasks.mergeDale < 40) tasks.mergeDale++;
    updateQuestProgress();
}

// Функция для обновления прогресса заданий
function updateQuestProgress() {
    document.getElementById('mergeDaleProgress').textContent = `${tasks.mergeDale}/40`;
    document.getElementById('mergeAwayProgress').textContent = `${tasks.mergeAway}/40`;
    document.getElementById('doodleGodProgress').textContent = `${tasks.doodleGod}/40`;
}