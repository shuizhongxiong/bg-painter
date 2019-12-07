<template>
  <el-tabs :stretch="true" v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="随机生成" name="random">
      <div class="sidebar-list">
        <div
          class="list-item"
          v-for="data of list"
          :key="data.name"
          :class="{ actived: data.comp === currentComp }"
        >
          <div class="item-img" @click="handleImg(data)">
            <img :src="getUrl(data.imageName)" :alt="data.name" />
          </div>
          <div class="item-name">{{ data.name }}</div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="配置生成" name="setting">
      <bezier-editor v-model="bezier" @input="bezierChange"></bezier-editor>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapMutations } from 'vuex';
import BezierEditor from '@/components/bezier-editor/BezierEditor.vue';

export default {
  name: 'home-sidebar',
  components: {
    BezierEditor,
  },
  data() {
    return {
      currentComp: '',
      list: [
        { name: '数据流动', imageName: '1.png', comp: 'painter-1', bgColor: 'rgba(0, 0, 0, 1)' },
        {
          name: '恒星粒子',
          imageName: '2.png',
          comp: 'painter-2',
          bgColor: 'rgba(0, 0, 0, 1)',
          top: 275,
          left: 170,
        },
      ],
      activeName: 'random',
    };
  },
  created() {
    this.handleImg(this.list[0]);
  },
  computed: {
    bezier: {
      get() {
        return this.$store.state.bezier;
      },
      set(val) {
        this.$store.state.bezier = val;
      },
    },
  },
  methods: {
    getUrl(name) {
      return require(`@/assets/images/home/sidebar-${name}`);
    },
    handleImg(data) {
      if (data.comp === this.currentComp) {
        return false;
      }
      this.currentComp = data.comp;
      this.changeCompData(data);
    },
    handleTabClick() {
      if (this.activeName === 'random') {
        this.handleImg(this.list[0]);
      } else if (this.activeName === 'setting') {
        this.handleImg({
          comp: 'painter-0',
          bgColor: 'rgba(0, 0, 0, 1)',
        });
      }
    },
    bezierChange(data) {
      this.changeBezier(data);
    },
    ...mapMutations(['changeCompData', 'changeBezier']),
  },
};
</script>

<style lang="scss" scoped>
.sidebar-list {
  padding: 20px;
  .list-item {
    text-align: center;
    & + .list-item {
      margin-top: 12px;
    }
    &.actived {
      color: #18ad91;
      .item-img {
        border: 2px solid #18ad91;
      }
    }
    .item-img {
      overflow: hidden;
      margin: 0 auto;
      width: 200px;
      height: 100px;
      border-radius: 10px;
      cursor: pointer;
      > img {
        display: block;
        width: 100%;
      }
    }
    .item-name {
      margin-top: 8px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
// .sidebar {
//   height: 100%;
//   background: #fff;
//   border-left: 1px solid #dfe3eb;
//   color: #333;
//   .sidebar-header {
//     height: 50px;
//     line-height: 50px;
//     text-align: center;
//     font-size: 14px;
//     font-weight: bold;
//     background: #f5f8fa;
//   }
// }
</style>
