/**
 * static/js/assets.js - Administrador de Texturas (64x64) y Sonidos para Echoes of Oakhaven.
 * Genera placeholders en Canvas si las imágenes no existen y maneja el audio de forma tolerante a fallos.
 */

class AssetManager {
    constructor(tileSize = 64) {
        this.tileSize = tileSize;
        this.textures = {};
        this.sounds = {};
    }

    /**
     * Genera un Canvas interno con un color sólido y un borde retro como textura temporal de 64x64.
     */
    createColorPlaceholder(color, label = '') {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');

        // Fondo principal
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);

        // Borde estilizado retro
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(2, 2, this.tileSize - 4, this.tileSize - 4);

        // Etiqueta identificadora si existe
        if (label) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label.substring(0, 4).toUpperCase(), this.tileSize / 2, this.tileSize / 2);
        }

        return canvas;
    }

    /**
     * Carga una textura o asigna un placeholder si falla la descarga.
     */
    loadTexture(key, src, fallbackColor, label = '') {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                console.log(`[Assets] Textura cargada con éxito: ${key}`);
                this.textures[key] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`[Assets] No se encontró la textura '${key}' en '${src}'. Usando placeholder color (${fallbackColor}).`);
                const placeholder = this.createColorPlaceholder(fallbackColor, label);
                this.textures[key] = placeholder;
                resolve(placeholder);
            };
            img.src = src;
        });
    }

    /**
     * Intenta registrar un sonido. Si falla o no se encuentra el archivo, solo genera un Log.
     */
    loadSound(key, src) {
        const audio = new Audio();
        audio.oncanplaythrough = () => {
            console.log(`[Assets] Sonido cargado con éxito: ${key}`);
            this.sounds[key] = audio;
        };
        audio.onerror = () => {
            console.warn(`[Assets] Archivo de sonido no encontrado para '${key}' en '${src}'. Las acciones reproducirán sólo un log.`);
            this.sounds[key] = null;
        };
        audio.src = src;
    }

    /**
     * Reproduce un sonido cargado o emite un log si no está disponible.
     */
    playSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].currentTime = 0;
            this.sounds[key].play().catch(() => {
                console.log(`[Audio Log] Reproducción de '${key}' bloqueada por políticas del navegador.`);
            });
        } else {
            console.log(`[Audio Log] SFX/Música ejecutada: '${key}' (Sin archivo de audio disponible)`);
        }
    }

    /**
     * Obtiene la textura o placeholder solicitado.
     */
    getTexture(key) {
        return this.textures[key] || this.createColorPlaceholder('#FF00FF', 'ERR');
    }
}

// Instancia global accesible desde cualquier script del juego
const assets = new AssetManager(64);