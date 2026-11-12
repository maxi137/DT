(function (Scratch) {
  'use strict';

  if (!Scratch || !Scratch.extensions || !Scratch.BlockType) {
    throw new Error('NGBSN Delta Time: entorno de extensiones no compatible.');
  }

  class NGBSNDeltaTime {
    constructor() {
      this.lastSampleTime = performance.now();
      this.lastReadTime = this.lastSampleTime;
      this.dt = 0;
      this.fps = 0;
      this.smoothedFPS = 0;
      this.minFPS = 0;
      this.maxFPS = 0;
      this.minDT = 0;
      this.maxDT = 0;
      this.frameCount = 0;
      this.totalTime = 0;
      this.samples = [];
      this.maxSamples = 60;
      this.sampleWindowMs = 4;
    }

    updateMeasurement() {
      const now = performance.now();
      const sinceLastRead = now - this.lastReadTime;
      this.lastReadTime = now;

      if (sinceLastRead < this.sampleWindowMs) return;

      const elapsedMs = now - this.lastSampleTime;
      this.lastSampleTime = now;

      if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return;

      const elapsedSeconds = elapsedMs / 1000;
      const currentFPS = 1 / elapsedSeconds;

      this.dt = elapsedSeconds;
      this.fps = currentFPS;
      this.frameCount++;
      this.totalTime += elapsedSeconds;

      this.samples.push(currentFPS);

      if (this.samples.length > this.maxSamples) {
        this.samples.shift();
      }

      let sum = 0;

      for (let i = 0; i < this.samples.length; i++) {
        sum += this.samples[i];
      }

      this.smoothedFPS = this.samples.length
        ? sum / this.samples.length
        : 0;

      if (this.frameCount === 1) {
        this.minFPS = currentFPS;
        this.maxFPS = currentFPS;
        this.minDT = elapsedSeconds;
        this.maxDT = elapsedSeconds;
      } else {
        this.minFPS = Math.min(this.minFPS, currentFPS);
        this.maxFPS = Math.max(this.maxFPS, currentFPS);
        this.minDT = Math.min(this.minDT, elapsedSeconds);
        this.maxDT = Math.max(this.maxDT, elapsedSeconds);
      }
    }

    getInfo() {
      return {
        id: 'dtbyxeroname',
        name: 'NGBSN Delta Time',
        color1: '#2878D0',
        color2: '#1E5FA8',
        color3: '#16477F',
        blocks: [
          {
            opcode: 'dtbyxeroname_dt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Delta Time'
          },
          {
            opcode: 'dtbyxeroname_fps',
            blockType: Scratch.BlockType.REPORTER,
            text: 'FPS'
          },
          {
            opcode: 'getDTMilliseconds',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Delta Time en ms'
          },
          {
            opcode: 'getSmoothedFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'FPS promedio'
          },
          {
            opcode: 'getMinFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'FPS mínimo'
          },
          {
            opcode: 'getMaxFPS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'FPS máximo'
          },
          {
            opcode: 'getMinDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Delta Time mínimo en ms'
          },
          {
            opcode: 'getMaxDT',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Delta Time máximo en ms'
          },
          {
            opcode: 'getFrameCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'fotogramas medidos'
          },
          {
            opcode: 'getTotalTime',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tiempo total medido en segundos'
          },
          {
            opcode: 'resetMeasurements',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reiniciar mediciones'
          }
        ]
      };
    }

    dtbyxeroname_dt() {
      this.updateMeasurement();
      return this.dt;
    }

    dtbyxeroname_fps() {
      this.updateMeasurement();
      return this.fps;
    }

    getDTMilliseconds() {
      this.updateMeasurement();
      return this.dt * 1000;
    }

    getSmoothedFPS() {
      this.updateMeasurement();
      return this.smoothedFPS;
    }

    getMinFPS() {
      this.updateMeasurement();
      return this.minFPS;
    }

    getMaxFPS() {
      this.updateMeasurement();
      return this.maxFPS;
    }

    getMinDT() {
      this.updateMeasurement();
      return this.minDT * 1000;
    }

    getMaxDT() {
      this.updateMeasurement();
      return this.maxDT * 1000;
    }

    getFrameCount() {
      this.updateMeasurement();
      return this.frameCount;
    }

    getTotalTime() {
      this.updateMeasurement();
      return this.totalTime;
    }

    resetMeasurements() {
      const now = performance.now();

      this.lastSampleTime = now;
      this.lastReadTime = now;
      this.dt = 0;
      this.fps = 0;
      this.smoothedFPS = 0;
      this.minFPS = 0;
      this.maxFPS = 0;
      this.minDT = 0;
      this.maxDT = 0;
      this.frameCount = 0;
      this.totalTime = 0;
      this.samples = [];
    }
  }

  Scratch.extensions.register(new NGBSNDeltaTime());
})(Scratch);
