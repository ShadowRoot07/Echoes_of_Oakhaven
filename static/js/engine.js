/**
 * static/js/engine.js - Motor de renderizado en Canvas para la grilla 2D.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // 1. Cargar catálogo de Texturas Base
    await Promise.all([
        assets.loadTexture('player', '/static/assets/sprites/player.png', '#0033AA', 'HERO'),
        assets.loadTexture('enemy', '/static/assets/sprites/enemy.png', '#8b0000', 'FOE'),
        assets.loadTexture('npc', '/static/assets/sprites/npc.png', '#daa520', 'NPC'),
        assets.loadTexture('grass', '/static/assets/tilesets/grass.png', '#2e8b57', 'GRAS'),
        assets.loadTexture('wall', '/static/assets/tilesets/wall.png', '#4a4a4a', 'WALL'),
        assets.loadTexture('water', '/static/assets/tilesets/water.png', '#1e90ff', 'WATR'),
        assets.loadTexture('door', '/static/assets/tilesets/door.png', '#8b4513', 'DOOR'),
    ]);

    // 2. Intentar cargar audios (Registrarán advertencias/logs si no existen)
    assets.loadSound('sword_slash', '/static/assets/audio/sword.wav');
    assets.loadSound('item_get', '/static/assets/audio/item.wav');
    assets.loadSound('bgm_oakhaven', '/static/assets/audio/oakhaven_theme.mp3');

    // 3. Matriz de prueba (Representación del primer mapa de Oakhaven - 10x8 tiles de 64px)
    const mapGrid = [
        ['wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall'],
        ['wall',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'water', 'water', 'wall'],
        ['wall',  'grass', 'npc',   'grass', 'grass', 'grass', 'grass', 'water', 'water', 'wall'],
        ['wall',  'grass', 'grass', 'grass', 'enemy', 'grass', 'grass', 'grass', 'grass', 'wall'],
        ['wall',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
        ['wall',  'grass', 'water', 'water', 'grass', 'grass', 'grass', 'grass', 'door',  'wall'],
        ['wall',  'grass', 'water', 'water', 'grass', 'grass', 'grass', 'grass', 'grass', 'wall'],
        ['wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall',  'wall'],
    ];

    // Posición del Jugador en grilla (x: 2, y: 4)
    let playerPos = { x: 2, y: 4 };

    function renderMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Renderizar Tiles
        for (let r = 0; r < mapGrid.length; r++) {
            for (let c = 0; c < mapGrid[r].length; c++) {
                const key = mapGrid[r][c];
                const texture = assets.getTexture(key);
                ctx.drawImage(texture, c * 64, r * 64, 64, 64);
            }
        }

        // Renderizar Jugador arriba del suelo
        const playerTex = assets.getTexture('player');
        ctx.drawImage(playerTex, playerPos.x * 64, playerPos.y * 64, 64, 64);
    }

    // Dibujar pantalla inicial
    renderMap();

    // 4. Captura de teclas y simulación de interacción
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Space' || e.key === ' ') {
            assets.playSound('sword_slash');
        } else if (e.key === 'e' || e.key === 'E') {
            assets.playSound('item_get');
        }
    });

    console.log('[Echoes of Oakhaven] Motor iniciado. Presiona ESPACIO para atacar o "E" para interactuar (mira los logs de audio en la consola).');
});