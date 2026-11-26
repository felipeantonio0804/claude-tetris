'use strict';

// Tabla de records local (localStorage, clave 'tetris.records').
// Formato: { top: [{name, score, lines, level}] (máx. 5), bestCombo, maxLines }
const Records = (() => {
  const KEY = 'tetris.records';
  const MAX_TOP = 5;
  const MAX_NAME = 10;
  const DEFAULT_NAME = 'Anónimo';

  function empty() {
    return { top: [], bestCombo: 0, maxLines: 0 };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const d = JSON.parse(raw);
      const top = Array.isArray(d.top) ? d.top.slice(0, MAX_TOP).map(e => ({
        name: String(e.name ?? '').slice(0, MAX_NAME),
        score: Number(e.score) || 0,
        lines: Number(e.lines) || 0,
        level: Number(e.level) || 1,
      })) : [];
      return { top, bestCombo: Number(d.bestCombo) || 0, maxLines: Number(d.maxLines) || 0 };
    } catch (e) {
      return empty();
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* sin almacenamiento */ }
  }

  // Registra el final de partida. Devuelve el índice (0..4) de la entrada
  // nueva en el top, o -1 si no entra. Entra con nombre por defecto; luego
  // setName() lo cambia.
  function onGameOver(score, lines, bestCombo, level) {
    const data = load();
    data.bestCombo = Math.max(data.bestCombo, bestCombo || 0);
    data.maxLines = Math.max(data.maxLines, lines || 0);
    let rank = -1;
    if (score > 0) {
      let i = data.top.findIndex(e => score > e.score);
      if (i === -1 && data.top.length < MAX_TOP) i = data.top.length;
      if (i !== -1) {
        data.top.splice(i, 0, { name: DEFAULT_NAME, score, lines, level: level || 1 });
        data.top.length = Math.min(data.top.length, MAX_TOP);
        rank = i;
      }
    }
    save(data);
    return rank;
  }

  function setName(rank, name) {
    const data = load();
    if (!data.top[rank]) return;
    data.top[rank].name = name.trim().slice(0, MAX_NAME) || DEFAULT_NAME;
    save(data);
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignorar */ }
  }

  // Pinta la tabla en `container` (vacía su contenido). Usa solo textContent.
  function render(container, highlight) {
    const data = load();
    container.textContent = '';

    const table = document.createElement('table');
    table.className = 'records-table';
    const head = table.createTHead().insertRow();
    for (const h of ['#', 'Nombre', 'Puntos', 'Líneas']) {
      const th = document.createElement('th');
      th.textContent = h;
      head.appendChild(th);
    }
    const body = table.createTBody();
    if (!data.top.length) {
      const td = body.insertRow().insertCell();
      td.colSpan = 4;
      td.className = 'records-empty';
      td.textContent = 'Sin records todavía';
    }
    data.top.forEach((e, i) => {
      const tr = body.insertRow();
      if (i === highlight) tr.className = 'highlight';
      [i + 1, e.name, e.score.toLocaleString(), e.lines].forEach(v => {
        tr.insertCell().textContent = v;
      });
    });
    container.appendChild(table);

    const stats = document.createElement('div');
    stats.className = 'records-stats';
    stats.textContent = `Mejor combo: ${data.bestCombo} · Líneas máx.: ${data.maxLines}`;
    container.appendChild(stats);
  }

  return { MAX_NAME, onGameOver, setName, reset, render };
})();
