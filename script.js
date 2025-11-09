// script.js

// === Telegram WebApp инициализация ===
const WebApp = window.Telegram.WebApp;
WebApp.ready();
WebApp.expand(); // раскрываем на всю высоту

// Приветствие по имени из Telegram (если запущено через бота)
const user = WebApp.initDataUnsafe?.user;
const greetingEl = document.getElementById('greeting');
if (user) {
  greetingEl.textContent = `Привет, ${user.first_name}!`;
} else {
  greetingEl.textContent = 'Привет! (Тестовый режим)';
}

// === Элементы DOM ===
const projectInput = document.getElementById('projectInput');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');

// === Состояние приложения ===
let seconds = 0;
let interval = null;
let startTime = null;
let currentProject = '';

// === Вспомогательная функция: формат времени (ЧЧ:ММ:СС) ===
function formatTime(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// === Обработчик: Старт таймера ===
startBtn.addEventListener('click', () => {
  const project = projectInput.value.trim();
  if (!project) {
    statusEl.textContent = '❗ Укажите проект или задачу';
    statusEl.classList.add('show');
    setTimeout(() => statusEl.classList.remove('show'), 3000);
    return;
  }

  // Сохраняем данные сессии
  currentProject = project;
  seconds = 0;
  startTime = new Date();

  // Запускаем таймер
  interval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);

  // Обновляем UI
  startBtn.disabled = true;
  stopBtn.disabled = false;
  statusEl.classList.remove('show'); // скрываем предыдущие сообщения
});

// === Обработчик: Стоп таймера ===
stopBtn.addEventListener('click', () => {
  if (!interval) return;

  clearInterval(interval);
  interval = null;

  const endTime = new Date();
  const durationSeconds = seconds;
  const formattedTime = formatTime(durationSeconds);

  // Логируем в консоль (позже заменим на отправку на сервер)
  console.log({
    project: currentProject,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationSeconds,
    formattedTime
  });

  // Показываем успех
  const logMessage = `✅ "${currentProject}" — ${formattedTime}`;
  statusEl.textContent = logMessage;
  statusEl.classList.add('show');

  // Автоматически скрыть через 5 секунд
  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 5000);

  // Обновляем UI
  startBtn.disabled = false;
  stopBtn.disabled = true;
});