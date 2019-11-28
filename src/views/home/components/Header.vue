<template>
  <div class="header">
    <div class="header-logo">
      <img src="~images/logo.png" alt="极光封面生成工具" />
    </div>
    <el-button type="primary" :loading="isExportLoading" @click="handleExport()"
      >生成导出</el-button
    >
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  name: 'home-header',
  data() {
    return {
      isExportLoading: false,
    };
  },
  methods: {
    handleExport() {
      this.isExportLoading = true;

      // 还原图形
      const el = document.getElementById('screenshot');
      el.classList.add('header-export');

      this.$nextTick(() => {
        html2canvas(el, {
          allowTaint: true,
        }).then(canvas => {
          canvas.style.display = 'none';
          document.body.appendChild(canvas);

          let MIME_TYPE = 'image/png';
          let imgURL = canvas.toDataURL(MIME_TYPE);

          let dlLink = document.createElement('a');
          dlLink.download = new Date().getTime();
          dlLink.href = imgURL;
          dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

          document.body.removeChild(canvas);

          document.body.appendChild(dlLink);
          dlLink.click();
          document.body.removeChild(dlLink);

          el.classList.remove('header-export');
          this.isExportLoading = false;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0 24px;
  height: 60px;
  width: 100%;
  line-height: 60px;
  background: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 62, 118, 0.05), 0 0 2px 0 rgba(0, 62, 118, 0.15);
  .header-logo {
    margin-right: 12px;
    height: 24px;
    width: 24px;
    > img {
      display: block;
      width: 100%;
    }
  }
}
</style>
<style>
.header-export {
  transform: scale3d(1, 1, 1) !important;
}
</style>
