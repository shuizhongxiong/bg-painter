<template>
  <el-container>
    <el-header style="padding: 0;">
      <home-header></home-header>
    </el-header>
    <el-container style="height: calc(100vh - 60px);">
      <el-main style="padding: 0;">
        <home-main></home-main>
      </el-main>
      <el-aside style="width: 270px;">
        <home-sidebar></home-sidebar>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import HomeHeader from './components/Header';
import HomeSidebar from './components/Sidebar';
import HomeMain from './components/Main';

export default {
  name: 'home',
  components: {
    HomeHeader,
    HomeSidebar,
    HomeMain,
  },
};
</script>
