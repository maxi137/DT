(function (Scratch) {
  'use strict';

  class NGBSNDeltaTime {
    constructor() {
      this.lastTime = performance.now();
      this.dt = 0;
      this.fps = 0;
      this.smoothedFPS = 0;
      this.frameCount = 0;
      this.totalTime = 0;
      this.samples = [];
      this.maxSamples = 30;
    }

    update() {
      const now = performance.now();
      const elapsed = (now - this.lastTime) / 1000;
      this.lastTime = now;

      if (!Number.isFinite(elapsed) || elapsed <= 0) return;

      this.dt = elapsed;
      this.fps = 1 / elapsed;

      this.samples.push(this.fps);

      if (this.samples.length > this.maxSamples) {
        this.samples.shift();
      }

      this.smoothedFPS =
        this.samples.reduce((sum, value) => sum + value, 0) /
        this.samples.length;

      this.frameCount++;
      this.totalTime += elapsed;
    }

    getInfo() {
      return {
        id: 'ngbsndeltatime',
        name: 'NGBSN Delta Time',
        color1: '#2878D0',
        color2: '#1E5FA8',
        color3: '#16477F',
        blocks: [
          {
            opcode: 'update',
            blockType: Scratch.BlockType.COMMAND,
            text: 'actualizar medición'
          },
          {
            opcode: 'getFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fps'
          },
          {
            opcode: 'getFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'FPS'
          },
          {
            opcode: 'getFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Fps'
          },
          {
            opcode: 'getDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dt'
          },
          {
            opcode: 'getDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'DT'
          },
          {
            opcode: 'getDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Dt'
          },
          {
            opcode: 'getDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dT'
          },
          {
            opcode: 'getDTMilliseconds',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dt en milisegundos'
          },
          {
            opcode: 'getSmoothedFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fps suavizados'
          },
          {
            opcode: 'getFrameCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fotogramas medidos'
          },
          {
            opcode: 'getTotalTime',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tiempo total medido'
          },
          {
            opcode: 'reset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reiniciar medición'
          }
        ]
      };
    }

    getFPS() {
      return this.fps;
    }

    getDT() {
      return this.dt;
    }

    getDTMilliseconds() {
      return this.dt * 1000;
    }

    getSmoothedFPS() {
      return this.smoothedFPS;
    }

    getFrameCount() {
      return this.frameCount;
    }

    getTotalTime() {
      return this.totalTime;
    }

    reset() {
      this.lastTime = performance.now();
      this.dt = 0;
      this.fps = 0;
      this.smoothedFPS = 0;
      this.frameCount = 0;
      this.totalTime = 0;
      this.samples = [];
    }
  }

  Scratch.extensions.register(new NGBSNDeltaTime());
})(Scratch);
