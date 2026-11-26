'use strict';

// Skins visuales. Cada skin define:
//  - name:   etiqueta para el selector
//  - colors: índices 1..9 (igual que PIECES; 8 = tuerca, 9 = bomba), índice 0 = null
//  - grid:   color de la cuadrícula; null = usar el color del tema claro/oscuro
//  - drawBlock(context, x, y, idx, size, alpha)
const SKINS = {
  retro: {
    name: 'Retro',
    colors: [null, '#4dd0e1', '#ffd54f', '#ba68c8', '#81c784', '#e57373', '#9fa8da', '#ffb74d', '#b0bec5', '#ff5722'],
    grid: null,
    drawBlock(context, x, y, idx, size, alpha) {
      context.globalAlpha = alpha;
      context.fillStyle = this.colors[idx];
      context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
      context.fillStyle = 'rgba(255,255,255,0.12)';
      context.fillRect(x * size + 1, y * size + 1, size - 2, 4);
      context.globalAlpha = 1;
    },
  },

  neon: {
    name: 'Neón',
    colors: [null, '#00f0ff', '#fff700', '#d500f9', '#39ff14', '#ff1744', '#448aff', '#ff9100', '#e0e0ff', '#ff3d00'],
    grid: '#1c1c2e',
    drawBlock(context, x, y, idx, size, alpha) {
      const color = this.colors[idx];
      context.save();
      context.globalAlpha = alpha;
      context.shadowColor = color;
      context.shadowBlur = 12;
      context.fillStyle = color + '55'; // relleno translúcido
      context.fillRect(x * size + 3, y * size + 3, size - 6, size - 6);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.strokeRect(x * size + 3, y * size + 3, size - 6, size - 6);
      context.restore();
      // restore() ya revierte sombra y alpha; se resetea explícitamente por seguridad
      context.shadowBlur = 0;
      context.shadowColor = 'transparent';
      context.globalAlpha = 1;
    },
  },

  pastel: {
    name: 'Pastel',
    colors: [null, '#a8e6ef', '#fff1b8', '#d9b8f0', '#b9e8bd', '#f5b5b5', '#c5cbf0', '#ffd6a5', '#d5dde1', '#ffab91'],
    grid: null,
    drawBlock(context, x, y, idx, size, alpha) {
      const px = x * size + 2, py = y * size + 2, s = size - 4, r = 7;
      context.globalAlpha = alpha;
      context.fillStyle = this.colors[idx];
      context.beginPath();
      context.moveTo(px + r, py);
      context.arcTo(px + s, py, px + s, py + s, r);
      context.arcTo(px + s, py + s, px, py + s, r);
      context.arcTo(px, py + s, px, py, r);
      context.arcTo(px, py, px + s, py, r);
      context.closePath();
      context.fill();
      // brillo suave
      context.fillStyle = 'rgba(255,255,255,0.35)';
      context.beginPath();
      context.arc(px + s * 0.3, py + s * 0.3, s * 0.12, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
    },
  },

  pixel: {
    name: 'Pixel art',
    colors: [null, '#29b6f6', '#fdd835', '#8e24aa', '#43a047', '#e53935', '#3949ab', '#fb8c00', '#78909c', '#d84315'],
    grid: null,
    drawBlock(context, x, y, idx, size, alpha) {
      const px = x * size, py = y * size;
      const p = Math.floor(size / 5); // tamaño de "píxel" (6 con size 30)
      context.globalAlpha = alpha;
      context.fillStyle = this.colors[idx];
      context.fillRect(px + 1, py + 1, size - 2, size - 2);
      // tablero de píxeles claros/oscuros
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if ((i + j) % 2) continue;
          const edge = i === 0 || j === 0;
          context.fillStyle = edge ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.18)';
          context.fillRect(px + 1 + i * p, py + 1 + j * p, Math.min(p, size - 2 - i * p), Math.min(p, size - 2 - j * p));
        }
      }
      // borde oscuro
      context.strokeStyle = 'rgba(0,0,0,0.55)';
      context.lineWidth = 1;
      context.strokeRect(px + 1.5, py + 1.5, size - 3, size - 3);
      context.globalAlpha = 1;
    },
  },
};

const DEFAULT_SKIN = 'retro';
