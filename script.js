(function() {
  // DOM элементы
  const elements = {
    text: document.getElementById('sceneText'),
    card: document.getElementById('card'),
    inner: document.getElementById('inner'),
    msg: document.getElementById('msg'),
    endBtn: document.getElementById('endBtn'),
    canvas: document.getElementById('space'),
    photo: document.getElementById('photo'),
    photoFrame: document.getElementById('photoFrame')
  };

  // Конфигурация с именами и фото
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
    starCount: 150,
    users: {
      'лаура': {
        photo: 'Laura.jpg',
        text: 'Ты — самая прекрасная,\nчто делает этот мир лучше ❤️\nС днём Святого Валентина, Лаура!'
      },
      'саша': {
        photo: 'Sasha.jpg', 
        text: 'Ты — самая прекрасная,\nчто делает этот мир лучше ❤️\nС днём Святого Валентина, Саша!'
      }
    },
    defaultMessage: 'Адиль не знает такого имени)',
    musicUrl: 'love-song.mp3' // Бесплатная тестовая музыка
  };

  let currentStep = 0;
  let typingInterval = null;
  let heartInterval = null;
  let currentUser = null;
  let audio = null;
  let isMusicPlaying = false;

  // Инициализация музыки
  function initMusic() {
    audio = new Audio(CONFIG.musicUrl);
    audio.loop = true; // Зацикливаем
    audio.volume = 0.5; // Громкость 50%
    
    // Пытаемся включить музыку при первом взаимодействии
    document.addEventListener('click', function playMusic() {
      if (!isMusicPlaying && audio) {
        audio.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
        isMusicPlaying = true;
        document.removeEventListener('click', playMusic);
      }
    }, { once: true });
  }

  // Переключатель музыки (можно добавить кнопку)
  function toggleMusic() {
    if (!audio) return;
    
    if (isMusicPlaying) {
      audio.pause();
      isMusicPlaying = false;
    } else {
      audio.play().catch(e => console.log('Не удалось включить музыку:', e));
      isMusicPlaying = true;
    }
  }

  // Получаем имя из URL или prompt
  function getUserName() {
    // Сначала проверяем URL параметры (например: ?name=лаура)
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get('name');
    
    if (name) {
      name = name.toLowerCase().trim();
    } else {
      // Если нет в URL, спрашиваем через prompt
      name = prompt('Введите ваше имя:').toLowerCase().trim();
    }
    
    // Проверяем есть ли такое имя в конфиге
    if (CONFIG.users[name]) {
      currentUser = name;
      return CONFIG.users[name];
    } else {
      // Если имя не найдено
      return {
        photo: null,
        text: CONFIG.defaultMessage
      };
    }
  }

  // Инициализация
  function init() {
    const user = getUserName();
    
    if (user.photo) {
      // Если пользователь найден, показываем его фото
      updatePhoto(user.photo);
    } else {
      // Если не найден, показываем заглушку и текст
      showUnknownUser();
    }
    
    setupCanvas();
    startScenes();
    setupEventListeners();
    handleResize();
    initMusic(); // Инициализируем музыку
  }

  // Обновление фото
  function updatePhoto(photoName) {
    if (elements.photo) {
      elements.photo.src = photoName;
    }
  }

  // Показываем сообщение для неизвестного пользователя
  function showUnknownUser() {
    // Меняем текст сцен на сообщение об ошибке
    CONFIG.scenes = [
      "Хмм...",
      "Я тебя не знаю...",
      CONFIG.defaultMessage
    ];
    
    // Убираем фото или меняем на вопросительный знак
    if (elements.photoFrame) {
      elements.photo.style.display = 'none';
      elements.photoFrame.style.background = 'rgba(255, 77, 109, 0.3)';
      elements.photoFrame.style.display = 'flex';
      elements.photoFrame.style.alignItems = 'center';
      elements.photoFrame.style.justifyContent = 'center';
      elements.photoFrame.innerHTML = '❓';
      elements.photoFrame.style.fontSize = '60px';
    }
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
        let photoHtml = '';
        
        // Если есть текущий пользователь, показываем его фото
        if (currentUser && CONFIG.users[currentUser]) {
          photoHtml = `
            <div class="photo-frame" id="photoFrame">
              <img src="${CONFIG.users[currentUser].photo}" alt="Наше фото" class="photo" id="photo">
            </div>
          `;
        } else {
          // Для неизвестного пользователя показываем ?
          photoHtml = `
            <div class="photo-frame" id="photoFrame" style="display: flex; align-items: center; justify-content: center; background: rgba(255, 77, 109, 0.3);">
              <span style="font-size: 60px;">❓</span>
            </div>
          `;
        }
        
        elements.text.innerHTML = `
          ${photoHtml}
          ${CONFIG.scenes[currentStep]}
        `;
        
        // Перепривязываем элементы после обновления HTML
        elements.photo = document.getElementById('photo');
        elements.photoFrame = document.getElementById('photoFrame');
        
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
    
    elements.msg.innerHTML = ''; // Меняем на innerHTML для поддержки <br>
    let index = 0;
    
    typingInterval = setInterval(() => {
      if (index < text.length) {
        // Заменяем \n на <br> для отображения
        const char = text[index] === '\n' ? '<br>' : text[index];
        elements.msg.innerHTML += char;
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
  }

  function handleCardFlip() {
    elements.inner.classList.add('flip');
    
    // Выбираем правильный текст для пользователя
    if (currentUser && CONFIG.users[currentUser]) {
      typeText(CONFIG.users[currentUser].text);
    } else {
      typeText(CONFIG.defaultMessage + " ❓");
    }
  }

  // Финал с сердечками
  function handleFinale(event) {
    event.stopPropagation();
    startFinale();
  }

  function startFinale() {    
    if (heartInterval) clearInterval(heartInterval);
    
    heartInterval = setInterval(createHeart, CONFIG.heartInterval);
    setTimeout(() => {
      if (heartInterval) clearInterval(heartInterval);
    }, 10000);
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

  // Космос
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

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    resizeCanvas();
    draw();
  }

  function handleResize() {}

  // Запуск
  document.addEventListener('DOMContentLoaded', init);
})();