(function (Scratch) {
  'use strict';

  if (!Scratch || !Scratch.extensions || !Scratch.extensions.unsandboxed) {
    throw new Error('NGBSN Delta Time necesita ejecutarse en modo unsandboxed.');
  }

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
      this.running = true;
      this.boundUpdate = this.update.bind(this);
      this.runtime = Scratch.vm.runtime;
      this.runtime.on('AFTER_EXECUTE', this.boundUpdate);
    }

    update() {
      if (!this.running) return;

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
            opcode: 'getFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fps'
          },
          {
            opcode: 'getDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dt'
          },
          {
            opcode: 'getDTMilliseconds',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dt ms'
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
