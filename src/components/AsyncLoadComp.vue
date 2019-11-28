<script>
export default {
  render(h) {
    return h(require(`./painters/${this.app}.vue`).default, {
      props: {
        size: this.size,
        randomPattern: this.randomPattern,
        isPause: this.isPause,
      },
    });
  },
  props: {
    app: String,
    size: Array, // 尺寸
    randomPattern: Number, // 随机图案
    isPause: Boolean, // 是否暂停
  },
};
</script>
