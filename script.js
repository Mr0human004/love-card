(function() {
  // DOM элементы
  const elements = {
    text: document.getElementById('sceneText'),
    card: document.getElementById('card'),
    inner: document.getElementById('inner'),
    msg: document.getElementById('msg'),
    endBtn: document.getElementById('endBtn'),
    canvas: document.getElementById('space')
  };

  // Конфигурация
  const CONFIG = {
    scenes: [
      "В бесконечной вселенной...",
      "Среди миллиардов людей...", 
      "Я нашёл самое ценное..."
    ],
    typingSpeed: 40,
    animationDuration: 800,
    sceneDelay: 2000,
    heartInterval: 120,
    starCount: 150
  };

  let currentStep = 0;
  let typingInterval = null;
  let heartInterval = null;
  let speechQueue = [];

  // Инициализация
  function init() {
    setupCanvas();
    startScenes();
    setupEventListeners();
    handleResize();
  }

  // Обработчики событий
  function setupEventListeners() {
    elements.inner.addEventListener('click', handleCardFlip);
    elements.endBtn.addEventListener('click', handleFinale);
    window.addEventListener('resize', handleResize);
  }

  // Сцены
  function startScenes() {
    nextScene();
  }

  function nextScene() {
    if (currentStep < CONFIG.scenes.length) {
      fadeOutText(() => {
        elements.text.textContent = CONFIG.scenes[currentStep];
        fadeInText();
        currentStep++;
        setTimeout(nextScene, CONFIG.sceneDelay);
      });
    } else {
      setTimeout(showCard, 1500);
    }
  }

  // Работа с текстом
  function fadeOutText(callback) {
    elements.text.style.opacity = '0';
    setTimeout(callback, CONFIG.animationDuration);
  }

  function fadeInText() {
    elements.text.style.opacity = '1';
  }

  function typeText(text) {
    if (typingInterval) clearInterval(typingInterval);
    
    elements.msg.textContent = '';
    let index = 0;
    
    typingInterval = setInterval(() => {
      if (index < text.length) {
        elements.msg.textContent += text[index];
        index++;
      } else {
        clearInterval(typingInterval);
        typingInterval = null;
      }
    }, CONFIG.typingSpeed);
  }

  // Открытка
  function showCard() {
    fadeOutText();
    elements.card.classList.remove('hidden');
    speakText('Это для тебя');
  }

  function handleCardFlip() {
    elements.inner.classList.add('flip');
    typeText("Ты — самое прекрасное, что случилось со мной ❤️");
  }

  // Голосовой синтез
  function speakText(text) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    utterance.onend = () => {
      speechQueue.shift();
      if (speechQueue.length > 0) {
        speechSynthesis.speak(speechQueue[0]);
      }
    };

    if (speechSynthesis.speaking) {
      speechQueue.push(utterance);
    } else {
      speechSynthesis.speak(utterance);
    }
  }

  // Финал с сердечками
  function handleFinale(event) {
    event.stopPropagation();
    startFinale();
  }

  function startFinale() {
    speakText('Я люблю тебя');
    
    if (heartInterval) clearInterval(heartInterval);
    
    heartInterval = setInterval(createHeart, CONFIG.heartInterval);
    setTimeout(() => {
      if (heartInterval) clearInterval(heartInterval);
    }, 10000); // Останавливаем через 10 секунд
  }

  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'love';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = 2 + Math.random() * 4 + 's';
    heart.style.fontSize = 20 + Math.random() * 30 + 'px';
    heart.style.opacity = 0.5 + Math.random() * 0.5;
    
    document.body.appendChild(heart);
    
    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }

  // Космос (оптимизированный)
  function setupCanvas() {
    const ctx = elements.canvas.getContext('2d');
    let stars = [];
    let animationFrame = null;

    function initStars() {
      stars = Array.from({ length: CONFIG.starCount }, () => ({
        x: Math.random() * elements.canvas.width,
        y: Math.random() * elements.canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2
      }));
    }

    function resizeCanvas() {
      elements.canvas.width = window.innerWidth;
      elements.canvas.height = window.innerHeight;
      initStars();
    }

    function draw() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);

      ctx.fillStyle = 'white';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > elements.canvas.height) {
          star.y = 0;
          star.x = Math.random() * elements.canvas.width;
        }
      });

      animationFrame = requestAnimationFrame(draw);
    }

    function start() {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      draw();
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    resizeCanvas();
    start();
  }

  function handleResize() {
    // Дополнительная обработка ресайза при необходимости
  }

  // Запуск приложения
  document.addEventListener('DOMContentLoaded', init);
})();
