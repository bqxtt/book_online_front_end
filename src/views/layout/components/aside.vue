<template>
  <div :key="componentKey">
    <el-menu
      class="menu"
      v-show="!this.isAdmin"
      :default-active="route"
      background-color="#002033"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title" @click="changeActive('/')">首页</span>
      </el-menu-item>
      <el-menu-item index="/book">
        <i class="el-icon-document"></i>
        <span slot="title" @click="changeActive('/book')">借阅管理</span>
      </el-menu-item>
      <el-menu-item index="/info">
        <i class="el-icon-setting"></i>
        <span slot="title" @click="changeActive('/info')">个人设置</span>
      </el-menu-item>
    </el-menu>
    <el-menu
      class="menu"
      v-show="this.isAdmin"
      :default-active="route"
      background-color="#002033"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <el-menu-item index="/admin">
        <i class="el-icon-menu"></i>
        <!-- <i class="el-icon-house"></i> -->
        <span slot="title" @click="changeActive('/admin')">首页</span>
      </el-menu-item>
      <el-menu-item index="/adminBook">
        <i class="el-icon-document"></i>
        <span slot="title" @click="changeActive('/adminBook')">借阅管理</span>
      </el-menu-item>
      <el-menu-item index="/adminUser">
        <i class="el-icon-user"></i>
        <span slot="title" @click="changeActive('/adminUser')">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/info">
        <i class="el-icon-setting"></i>
        <span slot="title" @click="changeActive('/info')">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import EventBus from "../../../EventBus.js";
export default {
  name: "AppAside",
  components: {},
  props: ["is-collapse"],
  data() {
    return {
      route: "/admin",
      role: "user",
      isAdmin: true,
      componentKey: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    const role = JSON.parse(window.localStorage.getItem("user")).role;
    console.log("侧边栏创建，获取到role", role);
    if (role == "user") {
      this.role = "user";
      this.isAdmin = false;
      this.route = "/";
    }
    EventBus.$on("change-route", (route) => {
      console.log("aside change route");
      this.route = route;
      console.log(this.route);
    });
  },
  mounted() {},
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    updateRoute(e) {
      console.log("update route !");
      this.route = e;
    },
    changeActive(route) {
      this.route = route;
      console.log("改变side的route：", this.route);
    },
  },
};
</script>
<style scoped>
.iconfont {
  margin-right: 10px;
  padding-left: 5px;
}
.el-menu-item {
  padding-right: 30px;
}
.menu {
  height: 100%;
}

/* 强行给模板元素加样式：1.在类标签前加/deep/，或者加>,如下 */
/* .el-menu-item>:hover{
      background-color: red;
    }
*/
</style>
