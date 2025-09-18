// Elementos do DOM
const btn = document.getElementById("btn");
const finalMsg = document.getElementById("finalMsg");
const countdown = document.getElementById("countdown");
const endText = document.getElementById("endText");
const risada = document.getElementById("risada");
const risadaFinal = document.getElementById("risadaFinal");

// Configurações
const frases = [
  "Quase kkk", 
  "Tá lenta hein 👀", 
  "Perdeu!", 
  "Corre mais!", 
  "Agora já era 😂"
];

let tentativas = 0;
let isGameActive = true;

// Configuração de áudio para mobile
const setupAudio = () => {
  // Permitir reprodução de áudio em dispositivos móveis
  document.addEventListener('touchstart', () => {
    risada.volume = 0.7;
    risadaFinal.volume = 0.8;
  }, { once: true });
  
  document.addEventListener('click', () => {
    risada.volume = 0.7;
    risadaFinal.volume = 0.8;
  }, { once: true });
};

// Função para mover o botão
const moveButton = () => {
  if (!isGameActive) return;
  
  const container = document.querySelector('.content');
  const containerRect = container.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  
  // Calcular posições dentro do container
  const maxX = containerRect.width - btnRect.width - 20;
  const maxY = containerRect.height - btnRect.height - 20;
  
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  btn.style.position = 'absolute';
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
  btn.style.transform = 'none';
  
  // Atualizar texto do botão
  if (tentativas < frases.length) {
    btn.textContent = frases[tentativas];
  }
  
  tentativas++;
};

// Função para criar botão falso
const createFakeButton = () => {
  const fakeBtn = document.createElement("button");
  fakeBtn.className = "btn";
  fakeBtn.textContent = "Sim!";
  fakeBtn.style.position = 'absolute';
  fakeBtn.style.zIndex = '10';
  
  // Posicionar o botão falso
  const container = document.querySelector('.content');
  const containerRect = container.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  
  const maxX = containerRect.width - btnRect.width - 20;
  const maxY = containerRect.height - btnRect.height - 20;
  
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  fakeBtn.style.left = x + 'px';
  fakeBtn.style.top = y + 'px';
  
  container.appendChild(fakeBtn);
  
  // Adicionar evento de clique no botão falso
  fakeBtn.addEventListener("click", () => {
    playRisada();
    fakeBtn.remove();
  });
  
  // Remover botão falso após 2 segundos
  setTimeout(() => {
    if (fakeBtn.parentNode) {
      fakeBtn.remove();
    }
  }, 2000);
};

// Função para reproduzir risada
const playRisada = () => {
  try {
    risada.currentTime = 0;
    risada.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
  } catch (e) {
    console.log('Erro ao reproduzir áudio:', e);
  }
};

// Função para reproduzir risada final
const playRisadaFinal = () => {
  try {
    risadaFinal.currentTime = 0;
    risadaFinal.play().catch(e => console.log('Erro ao reproduzir áudio final:', e));
  } catch (e) {
    console.log('Erro ao reproduzir áudio final:', e);
  }
};

// Função para chuva de emojis
const chuvaDeEmojis = () => {
  const emojis = ["😂", "❤️", "🍿", "🔥", "😏", "🎉", "✨", "💕"];
  const container = document.querySelector('.content');
  
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const emoji = document.createElement("div");
      emoji.className = "emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      // Posicionar emoji dentro do container
      const containerRect = container.getBoundingClientRect();
      emoji.style.left = (Math.random() * containerRect.width) + 'px';
      emoji.style.top = '0px';
      
      container.appendChild(emoji);
      
      // Remover emoji após animação
      setTimeout(() => {
        if (emoji.parentNode) {
          emoji.remove();
        }
      }, 3000);
    }, i * 150);
  }
};

// Função para iniciar contagem regressiva
const iniciarCountdown = () => {
  let tempo = 5;
  
  setTimeout(() => {
    finalMsg.style.display = "none";
    countdown.style.display = "block";
    
    const interval = setInterval(() => {
      countdown.textContent = tempo;
      tempo--;
      
      if (tempo < 0) {
        clearInterval(interval);
        countdown.style.display = "none";
        endText.style.display = "block";
      }
    }, 1000);
  }, 2000);
};

// Função para finalizar o jogo
const finalizarJogo = () => {
  isGameActive = false;
  btn.style.display = "none";
  finalMsg.style.display = "block";
  playRisadaFinal();
  chuvaDeEmojis();
  iniciarCountdown();
};

// Event listeners
const setupEventListeners = () => {
  // Evento de hover (desktop)
  btn.addEventListener("mouseover", () => {
    if (isGameActive) {
      if (tentativas < frases.length) {
        moveButton();
        createFakeButton();
      } else {
        finalizarJogo();
      }
    }
  });
  
  // Evento de touch (mobile)
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (isGameActive) {
      if (tentativas < frases.length) {
        moveButton();
        createFakeButton();
      } else {
        finalizarJogo();
      }
    }
  });
  
  // Evento de clique no botão real
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (isGameActive && tentativas >= frases.length) {
      finalizarJogo();
    }
  });
};

// Função para detectar se é dispositivo móvel
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (window.innerWidth <= 768);
};

// Função para otimizar para mobile
const optimizeForMobile = () => {
  if (isMobile()) {
    // Ajustar tamanhos para mobile
    btn.style.fontSize = '1.1rem';
    btn.style.padding = '16px 32px';
    
    // Adicionar feedback tátil se suportado
    if ('vibrate' in navigator) {
      btn.addEventListener('touchstart', () => {
        navigator.vibrate(50);
      });
    }
  }
};

// Função de inicialização
const init = () => {
  setupAudio();
  setupEventListeners();
  optimizeForMobile();
  
  // Adicionar classe para animação de entrada
  document.body.classList.add('loaded');
};

// Aguardar carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Prevenir zoom em double tap no iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Prevenir scroll em dispositivos móveis durante o jogo
document.addEventListener('touchmove', (e) => {
  if (isGameActive) {
    e.preventDefault();
  }
}, { passive: false });

// Exportar funções para uso global (se necessário)
window.gameControls = {
  reset: () => {
    tentativas = 0;
    isGameActive = true;
    btn.style.display = "block";
    btn.textContent = "Sim!";
    btn.style.position = "static";
    btn.style.left = "auto";
    btn.style.top = "auto";
    finalMsg.style.display = "none";
    countdown.style.display = "none";
    endText.style.display = "none";
  }
};

