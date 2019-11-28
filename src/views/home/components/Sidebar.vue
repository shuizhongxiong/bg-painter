<template>
  <div class="sidebar">
    <div class="sidebar-header">封面样式</div>
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
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'home-sidebar',
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
    };
  },
  created() {
    this.handleImg(this.list[0]);
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
    ...mapMutations(['changeCompData']),
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background: #fff;
  border-left: 1px solid #dfe3eb;
  color: #333;
  .sidebar-header {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    background: #f5f8fa;
  }
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
}
</style>
