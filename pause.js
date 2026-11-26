'use strict';

// Menú de pausa: maneja solo la UI de #pause-menu.
// La lógica del juego (togglePause, init, setStartLevel) vive en game.js
// y se invoca de forma diferida desde los handlers, por eso el orden de carga no importa.
const PauseMenu = (() => {
  const MAX_START_LEVEL = 15;
  const menu = document.getElementById('pause-menu');
  const resumeBtn = document.getElementById('pause-resume');
  const restartBtn = document.getElementById('pause-restart');
  const controlsBtn = document.getElementById('pause-controls-btn');
  const controlsList = document.getElementById('pause-controls');
  const levelSelect = document.getElementById('pause-level');

  for (let i = 1; i <= MAX_START_LEVEL; i++) {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = String(i);
    levelSelect.appendChild(opt);
  }

  function show() {
    menu.classList.remove('hidden');
    document.activeElement && document.activeElement.blur(); // Espacio/flechas no activan botones
  }

  function hide() {
    menu.classList.add('hidden');
    controlsList.classList.add('hidden');
    controlsBtn.textContent = 'Ver controles';
    document.activeElement && document.activeElement.blur();
  }

  resumeBtn.addEventListener('click', () => togglePause());
  restartBtn.addEventListener('click', () => init());
  controlsBtn.addEventListener('click', () => {
    const hidden = controlsList.classList.toggle('hidden');
    controlsBtn.textContent = hidden ? 'Ver controles' : 'Ocultar controles';
    controlsBtn.blur();
  });
  levelSelect.addEventListener('change', () => {
    setStartLevel(parseInt(levelSelect.value, 10));
    levelSelect.blur(); // evita que las flechas cambien el selector al reanudar
  });

  return { show, hide };
})();
