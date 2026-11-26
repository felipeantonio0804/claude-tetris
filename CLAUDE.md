# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Tetris clásico en JavaScript vanilla + HTML5 Canvas + CSS. No hay `package.json`, bundler, linter ni tests: no existen comandos de build/lint/test.

## Ejecutar

Abrir `index.html` directamente en el navegador (`start index.html` en Windows), o servir la carpeta con `python -m http.server 8000`.

## Arquitectura

Todo el juego está en `game.js` (script único, `'use strict'`, estado en variables globales de módulo). `index.html` define los elementos que `game.js` busca por id (`board`, `next-canvas`, `score`, `lines`, `level`, `overlay`, `overlay-title`, `overlay-score`, `restart-btn`); si se renombra un id hay que actualizar ambos archivos.

- **Modelo**: `board` es una matriz `ROWS×COLS` de enteros; `0` = vacío y `1..9` = índice de pieza, que también indexa `COLORS` y `PIECES` (ambos con `null` en el índice 0). El índice 8 (`NUT`) es la "tuerca" 3×3 con hueco central; `randomPiece()` la genera con probabilidad `NUT_CHANCE` (0.07). El índice 9 (`BOMB`) es la "bomba" 1×1 (`BOMB_CHANCE` 0.05): en `lockPiece()` no se hace `merge()` sino `explode(x, y)`, que borra el área 3×3 centrada en ella (sin que caigan bloques), suma `BOMB_POINTS` por bloque destruido y registra un destello en `explosions` (pintado por `drawExplosions()` desde `draw()`). Las otras 7 piezas salen de forma uniforme. Una pieza es `{type, shape, x, y}` con `shape` como matriz cuadrada.
- **Flujo de una pieza**: `spawn()` toma `next` y genera otra; si colisiona al aparecer llama a `endGame()`. `lockPiece()` = `merge()` → `clearLines()` → `spawn()`. Tanto la gravedad (`loop`) como `softDrop`/`hardDrop` terminan en `lockPiece()`.
- **Bucle**: `loop` (`requestAnimationFrame`) acumula `dropAccum` y baja la pieza cuando supera `dropInterval`; `dropInterval` lo recalcula `clearLines()` según el nivel (`max(100, 1000 - (level-1)*90)`). Pausa y fin de partida cancelan el frame con `cancelAnimationFrame(animId)`; `init()` también cancela antes de reiniciar.
- **Colisión/rotación**: `collide(shape, ox, oy)` es la única comprobación de límites/ocupación; `tryRotate` rota en sentido horario y prueba kicks horizontales `[0, -1, 1, -2, 2]`.
- **Puntuación**: líneas según `LINE_SCORES` × nivel; soft drop +1 por celda y hard drop +2 por celda; el nivel sube cada 10 líneas.
- **Render**: `draw()` repinta todo cada frame (cuadrícula, tablero, pieza fantasma con alpha 0.2, pieza actual); `drawNext()` solo se llama desde `spawn()`. Los elementos del HUD se actualizan con `updateHUD()`.
- **Entrada**: un único listener `keydown` (←/→/↓, ↑ o X para rotar, Espacio hard drop, P o Escape abren/cierran el menú de pausa `#pause-menu`, gestionado por `pause.js`; `startLevel` fija el nivel de la próxima partida).

## Notas

- El `README.md` (en español) describe el juego y los controles, pero su árbol de archivos muestra una carpeta `03-tetris/` que no coincide con la real.
- El panel de controles de `index.html` solo lista ↑ para rotar, aunque `game.js` también acepta X.
