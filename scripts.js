// Инициализация сцены, камеры и рендерера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Освещение
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Платформа
const platformGeometry = new THREE.BoxGeometry(10, 0.5, 10);
const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.y = -2;
scene.add(platform);

// Персонаж
const playerGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = -1;
scene.add(player);

// Монеты
const coins = [];
const coinGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const coinMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });

function createCoin() {
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.position.x = (Math.random() - 0.5) * 8;
    coin.position.z = (Math.random() - 0.5) * 8;
    coin.position.y = 0.5;
    scene.add(coin);
    coins.push(coin);
}

for (let i = 0; i < 10; i++) {
    createCoin();
}

// Управление
const keys = {};
document.addEventListener('keydown', (event) => keys[event.code] = true);
document.addEventListener('keyup', (event) => keys[event.code] = false);

// Очки и таймер
let score = 0;
let timeLeft = 60;
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

// Анимация и логика игры
function animate() {
    requestAnimationFrame(animate);

    // Управление персонажем
    if (keys['ArrowUp']) player.position.z -= 0.1;
    if (keys['ArrowDown']) player.position.z += 0.1;
    if (keys['ArrowLeft']) player.position.x -= 0.1;
    if (keys['ArrowRight']) player.position.x += 0.1;

    // Проверка сбора монет
    coins.forEach((coin, index) => {
        if (player.position.distanceTo(coin.position) < 0.5) {
            scene.remove(coin);
            coins.splice(index, 1);
            score += 10;
            scoreElement.textContent = `Очки: ${score}`;
            createCoin();
        }
    });

    // Обновление таймера
    timeLeft -= 0.016; // Примерно 60 FPS
    timerElement.textContent = `Время: ${Math.max(0, Math.floor(timeLeft))}`;

    if (timeLeft <= 0) {
        alert(`Игра окончена! Ваш счёт: ${score}`);
        timeLeft = 60;
        score = 0;
        scoreElement.textContent = `Очки: ${score}`;
    }

    // Рендеринг сцены
    renderer.render(scene, camera);
}

// Позиция камеры
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Запуск анимации
animate();