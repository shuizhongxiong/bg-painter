<template>
  <canvas id="canvas"></canvas>
</template>

<script>
import { mapState } from 'vuex';
import * as dat from 'dat.gui';
import BezierEasing from 'bezier-easing';

export default {
  name: 'painter-0',
  data() {
    return {
      changeSizeHandle: null,
      restartHandle: null,
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
  },
  computed: {
    ...mapState(['bezier']),
    // bezier() {
    //   const val = this.$store.bezier;
    //   return val && val.slice(13, val.length - 1);
    // },
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
    bezier(newVal) {
      if (newVal) {
        const b = newVal
          .slice(13, newVal.length - 1)
          .split(',')
          .map(d => +d);
        this.changeBezierHandle(b);
      }
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
      // 配置
      let Setting = {
        domId: 'canvas', // 绑定dom节点
        cW: size[0], // canvas宽
        cH: size[1], // canvas高

        r: 5, // 半径
        color1: '#fff', // 起始颜色
        color2: '#fff', // 终止颜色
        count: 17, // 图形个数
        gap: 4, // 图形间距
        groupCount: 40, // 图形组个数
        hollowR: 50, // 空心半径
        shape: 'round', // 形状
        sizeType: 0, // 大小趋势
      };

      let cv = document.getElementById(Setting.domId);
      let ctx = cv.getContext('2d');
      cv.width = Setting.cW;
      cv.height = Setting.cH;

      function drawPoint(x, y, index) {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = getFillColor(x, y);

        switch (Setting.shape) {
          case 'round':
            ctx.arc(x, y, Setting.r * getScale(index), 0, Math.PI * 2, true);
            break;
          case 'rectangle':
            ctx.fillRect(x, y, Setting.r * 2 * getScale(index), Setting.r * 2 * getScale(index));
            break;
          case 'triangle':
            ctx.moveTo(x + Setting.r * 1.5 * getScale(index), y);
            ctx.lineTo(x, y + Setting.r * 3 * getScale(index));
            ctx.lineTo(x + Setting.r * 3 * getScale(index), y + Setting.r * 3 * getScale(index));
            break;
          case 'diamond':
            ctx.moveTo(x + Setting.r * 1.5 * getScale(index), y);
            ctx.lineTo(x, y + Setting.r * 1.5 * getScale(index));
            ctx.lineTo(x + Setting.r * 1.5 * getScale(index), y + Setting.r * 3 * getScale(index));
            ctx.lineTo(x + Setting.r * 3 * getScale(index), y + Setting.r * 1.5 * getScale(index));
            break;
          default:
            break;
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      const scaleArr = [0.5, 2];
      function getScale(index) {
        if (+Setting.sizeType === 0 || Setting.count <= 1) {
          return 1;
        } else if (+Setting.sizeType === 1) {
          return ((scaleArr[0] - scaleArr[1]) / Setting.count) * index + scaleArr[1];
        } else if (+Setting.sizeType === 2) {
          return ((scaleArr[1] - scaleArr[0]) / Setting.count) * index + scaleArr[0];
        }
      }

      function getFillColor(x, y) {
        let start = Setting.hollowR;
        let end = (Setting.r * 2 + Setting.gap) * Setting.count + start;
        var grd = ctx.createLinearGradient(start, y, end, y);
        grd.addColorStop(0, Setting.color1);
        grd.addColorStop(1, Setting.color2);
        return grd;
      }

      let bezier = BezierEasing(0.4, 0.1, 0.4, 0.8);

      function drawGroup() {
        const interval = 1 / Setting.count;
        for (let i = 0; i < Setting.count; i++) {
          const x = i * (Setting.gap + Setting.r * 2) + Setting.hollowR;
          const y = bezier ? bezier(i * interval) * 200 : 0;
          drawPoint(x, y, i);
        }
      }

      function draw() {
        ctx.clearRect(0, 0, Setting.cW, Setting.cH);

        let centerX = Setting.cW / 2;
        let centerY = Setting.cH / 2;

        ctx.translate(centerX, centerY);

        for (let i = 0; i < Setting.groupCount; i++) {
          const degrees = 360 / Setting.groupCount;
          ctx.rotate((degrees * Math.PI) / 180);
          drawGroup();
        }

        ctx.translate(-centerX, -centerY);
      }

      let gui = new dat.GUI({
        autoPlace: false,
      });
      const el = document.getElementById('gui');
      el.append(gui.domElement);
      gui
        .add(Setting, 'r', 1, 10)
        .name('半径')
        .onFinishChange(draw);
      gui
        .add(Setting, 'count', 10, 20, 1)
        .name('个数')
        .onFinishChange(draw);
      gui
        .add(Setting, 'gap', 1, 10)
        .name('间距')
        .onFinishChange(draw);
      gui
        .add(Setting, 'groupCount', 1, 80, 1)
        .name('组数')
        .onFinishChange(draw);
      gui
        .add(Setting, 'hollowR', 10, 200)
        .name('空心半径')
        .onFinishChange(draw);
      gui
        .add(Setting, 'shape', {
          圆形: 'round',
          矩形: 'rectangle',
          三角形: 'triangle',
          菱形: 'diamond',
        })
        .name('图形')
        .onFinishChange(draw);
      gui
        .add(Setting, 'sizeType', {
          一样大小: 0,
          大到小: 1,
          小到大: 2,
        })
        .name('大小趋势')
        .onFinishChange(draw);
      gui
        .addColor(Setting, 'color1')
        .name('起始颜色')
        .onFinishChange(draw);
      gui
        .addColor(Setting, 'color2')
        .name('终止颜色')
        .onFinishChange(draw);

      draw();

      this.changeSizeHandle = function(size) {
        Setting.cW = size[0];
        Setting.cH = size[1];
        cv.width = Setting.cW;
        cv.height = Setting.cH;
        draw();
      };
      this.restartHandle = function() {
        draw();
      };
      this.changeBezierHandle = function(val) {
        bezier = BezierEasing(...val);
        draw();
      };
      this.destroyedHandle = function() {
        gui.destroy();
        const el = document.getElementById('gui');
        el.innerHTML = '';
      };
    },
  },
};
</script>

<style></style>
