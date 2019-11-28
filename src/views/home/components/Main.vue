<template>
  <div class="main">
    <div class="main-header clearfloat">
      <div class="float-left">
        <div class="header-item">
          <el-radio-group v-model="screenType" @change="handleScreenType($event)">
            <el-tooltip content="输出比例：1400*1024" placement="top">
              <el-radio-button label="monitor">
                <i class="el-icon-monitor"></i>
              </el-radio-button>
            </el-tooltip>
            <el-tooltip content="输出比例：675*812" placement="top">
              <el-radio-button label="mobile">
                <i class="el-icon-mobile"></i>
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </div>
        <div class="header-item">
          <el-input-number
            v-model="inputWidth"
            placeholder="宽"
            :controls="false"
            :min="1"
            :max="9999"
            @change="handleInput()"
          ></el-input-number>
          <i class="el-icon-close"></i>
          <el-input-number
            v-model="inputHeight"
            placeholder="高"
            :controls="false"
            :min="1"
            :max="9999"
            @change="handleInput()"
          ></el-input-number>
        </div>
      </div>
      <div class="float-right">
        <div class="header-item">
          <el-tooltip content="键盘空格快速控制" placement="top">
            <el-button @click="handleStatus()">
              <img v-if="isPause" src="~images/home/btn-play.png" alt="播放" />
              <img v-if="!isPause" src="~images/home/btn-pause.png" alt="暂停" />
              {{ isPause ? '播放' : '暂停' }}</el-button
            >
          </el-tooltip>
        </div>
        <div class="header-item">
          <el-button @click="handleCurtain()">
            <img src="~images/home/btn-curtain.png" alt="添加幕布" />
            {{ curtainVisible ? '删除' : '添加' }}幕布</el-button
          >
        </div>
        <div class="header-item">
          <el-button @click="handleRestart()">
            <img src="~images/home/btn-random.png" alt="随机图案" />
            随机图案</el-button
          >
        </div>
        <div class="header-item">
          <el-tooltip content="播放状态才会有效果" placement="top">
            <el-button @click.stop="handleSetting()">
              <img src="~images/home/btn-color.png" alt="修改效果" />
              修改效果</el-button
            >
          </el-tooltip>
          <div class="popover-gui" id="gui" v-show="guiVisible" @click.stop></div>
        </div>
        <div class="header-item item-color">
          <el-button @click="handleBgColor()">
            <el-color-picker
              v-model="compData.bgColor"
              show-alpha
              size="mini"
              popper-class="main-color-picker-popper"
            ></el-color-picker>
            背景颜色
          </el-button>
        </div>
      </div>
    </div>
    <div class="main-wrapper">
      <div
        class="painter-curtain-control"
        v-show="curtainVisible"
        :style="{ top: curtainHeight + 'px' }"
      >
        <i class="el-icon-d-caret" @mousedown.stop="curtainControl()"></i>
        <div class="control-line"></div>
      </div>
      <div class="main-content" ref="mainContent">
        <div
          class="content-painter"
          id="screenshot"
          :style="{
            background: compData.bgColor,
            width: inputWidth + 'px',
            height: inputHeight + 'px',
          }"
        >
          <div
            class="painter-curtain"
            v-show="curtainVisible"
            :style="{
              height: curtainHeight + 'px',
              width: inputWidth + 'px',
              'background-image': `linear-gradient(${compData.bgColor}, transparent)`,
            }"
          ></div>
          <vue-draggable-resizable
            :w="inputWidth"
            :h="inputHeight"
            :x="dragX"
            :y="dragY"
            :resizable="false"
            @dragging="handleDrag"
          >
            <async-load-comp
              :app="compData.comp"
              :size="size"
              :randomPattern="randomPattern"
              :isPause="isPause"
            ></async-load-comp>
          </vue-draggable-resizable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import asyncLoadComp from '@/components/AsyncLoadComp.vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import { mapState } from 'vuex';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';

export default {
  name: 'home-main',
  components: {
    asyncLoadComp,
    VueDraggableResizable,
  },
  data() {
    return {
      screenType: '',
      inputWidth: 600,
      inputHeight: 600,
      guiVisible: false,
      areasVisible: false,
      randomPattern: 0,
      isPause: false,
      dragX: 0,
      dragY: 0,
      curtainVisible: false,
      curtainHeight: 0,
      curtainWidth: 0,
      curtainBg: '',
    };
  },
  computed: {
    size() {
      return [this.inputWidth, this.inputHeight];
    },
    ...mapState(['compData']),
  },
  watch: {
    compData(newVal) {
      this.dragX = newVal.left || 0;
      this.dragY = newVal.top || 0;
      this.isPause = false;
      this.curtainVisible = false;
    },
  },
  mounted() {
    const el = this.$refs.mainContent;
    this.inputWidth = el.offsetWidth;
    this.inputHeight = el.offsetHeight;

    document.addEventListener('click', () => {
      this.guiVisible = false;
      this.areasVisible = false;
    });
    document.addEventListener('keydown', e => {
      let event = e || window.event;
      if (event && event.keyCode === 32) {
        // 空格
        this.handleStatus();
      }
    });
  },
  methods: {
    handleScreenType(type) {
      if (type === 'monitor') {
        this.inputWidth = 1400;
        this.inputHeight = 1024;
      } else if (type === 'mobile') {
        this.inputWidth = 675;
        this.inputHeight = 812;
      }
      this.handleRestart();
    },
    handleInput() {
      this.screenType = '';
      this.handleRestart();
    },
    handleRestart() {
      this.randomPattern = new Date().getTime();
      this.isPause = false;
    },
    handleStatus() {
      this.isPause = !this.isPause;
    },
    handleSetting() {
      this.areasVisible = false;
      this.isPause = false;
      this.guiVisible = !this.guiVisible;
    },
    handleBgColor() {
      const triggerEl = document.getElementsByClassName('el-color-picker__trigger')[0];
      triggerEl.click();
    },
    handleDrag(left, top) {
      this.dragX = left;
      this.dragY = top;
    },
    handleCurtain() {
      this.curtainVisible = !this.curtainVisible;
      if (this.curtainVisible) {
        this.curtainHeight = this.inputHeight * 0.3;
      }
    },
    curtainControl() {
      const moveHandle = e => {
        this.curtainHeight = Math.min(e.y - 136, this.$refs.mainContent.offsetHeight);
      };
      const upHandle = e => {
        document.removeEventListener('mousemove', moveHandle);
        document.removeEventListener('mouseup', upHandle);
      };
      document.addEventListener('mousemove', moveHandle, false);
      document.addEventListener('mouseup', upHandle, false);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 0;
  height: 100%;
  background: #eaf0f6;
  .main-header {
    padding: 0 20px;
    margin-bottom: 20px;
    .float-left {
      .header-item {
        margin-right: 12px;
      }
    }
    .float-right {
      .header-item {
        margin-left: 12px;
      }
    }
    .header-item {
      position: relative;
      display: inline-block;
      vertical-align: bottom;
      .el-button img {
        width: 14px;
        vertical-align: bottom;
      }
      .el-input-number {
        width: 68px;
      }
      i.el-icon-close {
        font-size: 14px;
        color: #7c98b6;
        margin: 0 10px;
      }
      .el-color-picker {
        height: 14px;
        vertical-align: bottom;
        pointer-events: none;
        &::v-deep .el-color-picker__trigger {
          height: 14px;
          width: 14px;
          padding: 0;
          border: 0;
          .el-color-picker__icon {
            display: none;
          }
        }
      }
      .popover-gui {
        z-index: 1000;
        position: absolute;
        top: 44px;
        right: 0;
        &::v-deep .close-button {
          display: none;
        }
      }
      .popover-area {
        z-index: 1000;
        position: absolute;
        top: 44px;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 120px;
        height: 120px;
        .area-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
          height: 50%;
          border: 0.5px solid #dcdfe6;
          background: #fff;
          cursor: pointer;
          .el-icon-check {
            font-size: 16px;
            font-weight: bold;
            color: #18ad91;
          }
        }
      }
    }
  }
  .main-wrapper {
    position: relative;
    width: 100%;
    height: calc(100% - 61px);
    .painter-curtain-control {
      z-index: 110;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      font-size: 20px;
      user-select: none;
      &:hover {
        .control-line {
          display: block;
        }
      }
      .control-line {
        display: none;
        width: 100%;
        height: 2px;
        background: #fff;
      }
      > i {
        position: absolute;
        top: -12px;
        left: 0;
        border: 1px solid #18ad91;
        border-radius: 50%;
        font-size: 24px;
        color: #18ad91;
        cursor: ns-resize;
      }
    }
    .main-content {
      overflow: auto;
      margin: 0 20px;
      height: 100%;
      .content-painter {
        overflow: hidden;
        position: relative;
        margin: 0 auto;
        .painter-curtain {
          z-index: 100;
          position: absolute;
          pointer-events: none;
        }
      }
    }
  }
}
</style>
<style>
.main-color-picker-popper {
  margin-top: 16px;
}
.vdr {
  border: none;
}
</style>
