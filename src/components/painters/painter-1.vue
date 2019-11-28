<template>
  <canvas id="c"></canvas>
</template>

<script>
import * as dat from 'dat.gui';
import * as SimplexNoise from 'simplex-noise';

export default {
  name: 'painter-1',
  data() {
    return {
      changeSizeHandle: null,
      restartHandle: null,
      changeStatusHandle: null,
      destroyedHandle: null,
    };
  },
  props: {
    size: {
      type: Array,
      default() {
        return [600, 600];
      },
    },
    randomPattern: Number,
    isPause: Boolean,
  },
  watch: {
    size(newVal) {
      if (newVal) {
        this.size = newVal;
        this.changeSizeHandle(this.size);
      }
    },
    randomPattern(newVal) {
      this.randomPattern = newVal;
      this.restartHandle();
    },
    isPause(newVal) {
      this.isPause = newVal;
      this.changeStatusHandle(newVal);
    },
  },
  mounted() {
    this.init(this.size);
  },
  destroyed() {
    this.destroyedHandle();
  },
  methods: {
    init(size) {
      let Configs = {
        particleNum: 1000,
        step: 5,
        base: 1000,
        zInc: 0.001,
      };

      let canvas,
        context,
        screenWidth,
        screenHeight,
        centerX,
        centerY,
        particles = [],
        hueBase = 0,
        simplexNoise,
        zoff = 0,
        gui,
        raf = null;

      function init() {
        canvas = document.getElementById('c');
        changeSize(size);

        for (let i = 0; i < Configs.particleNum; i++) {
          initParticle((particles[i] = new Particle()));
        }

        simplexNoise = new SimplexNoise();

        initGui();
        update();
      }

      function initGui() {
        gui = new dat.GUI({
          autoPlace: false,
        });
        const el = document.getElementById('gui');
        el.append(gui.domElement);
        gui.add(Configs, 'step', 1, 10);
        gui.add(Configs, 'base', 500, 3000);
        gui.add(Configs, 'zInc', 0.0001, 0.01);
      }

      function changeSize(size) {
        screenWidth = canvas.width = size[0] * 2;
        screenHeight = canvas.height = size[1];

        centerX = screenWidth / 2;
        centerY = screenHeight / 2;

        context = canvas.getContext('2d');
        context.lineWidth = 0.3;
        context.fillStyle = 'transparent';
        context.lineCap = context.lineJoin = 'round';
      }
      function restart() {
        context.save();
        context.fillStyle = 'transparent';
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();
      }

      function getNoise(x, y, z) {
        let octaves = 4,
          fallout = 0.5,
          amp = 1,
          f = 1,
          sum = 0,
          i;

        for (i = 0; i < octaves; ++i) {
          amp *= fallout;
          sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5;
          f *= 2;
        }

        return sum;
      }
      function initParticle(p) {
        p.x = p.pastX = screenWidth * Math.random();
        p.y = p.pastY = screenHeight * Math.random();
        p.color.h = hueBase + (Math.atan2(centerY - p.y, centerX - p.x) * 180) / Math.PI;
        p.color.s = 1;
        p.color.l = 0.5;
        p.color.a = 0;
      }

      function update() {
        let step = Configs.step,
          base = Configs.base,
          i,
          p,
          angle;

        for (i = 0; i < particles.length; i++) {
          p = particles[i];

          p.pastX = p.x;
          p.pastY = p.y;

          angle = Math.PI * 6 * getNoise((p.x / base) * 1.75, (p.y / base) * 1.75, zoff);
          p.x += Math.cos(angle) * step;
          p.y += Math.sin(angle) * step;

          if (p.color.a < 1) p.color.a += 0.003;

          context.beginPath();
          context.strokeStyle = p.color.toString();
          context.moveTo(p.pastX, p.pastY);
          context.lineTo(p.x, p.y);
          context.stroke();

          if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
            initParticle(p);
          }
        }

        hueBase += 0.1;
        zoff += Configs.zInc;

        raf = requestAnimationFrame(update);
      }

      function HSLA(h, s, l, a) {
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = a || 0;
      }
      HSLA.prototype.toString = function() {
        return 'hsla(' + this.h + ',' + this.s * 100 + '%,' + this.l * 100 + '%,' + this.a + ')';
      };

      function Particle(x, y, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = color || new HSLA();
        this.pastX = this.x;
        this.pastY = this.y;
      }

      init();
      this.changeSizeHandle = changeSize;
      this.restartHandle = restart;
      this.changeStatusHandle = function(isPause) {
        if (isPause) {
          cancelAnimationFrame(raf);
          raf = null;
        } else {
          raf = requestAnimationFrame(update);
        }
      };
      this.destroyedHandle = function() {
        this.changeStatusHandle(true);
        gui.destroy();
        const el = document.getElementById('gui');
        el.innerHTML = '';
      };
    },
  },
};
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
}
</style>
