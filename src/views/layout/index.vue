<template>
  <el-container class="layoutContainer">
    <el-aside class="aside" width="auto">
      <AppAside class="aside-menu" :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            :class="{
              'el-icon-s-fold': !isCollapse,
              'el-icon-s-unfold': isCollapse,
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>图书管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img
              class="avatar"
              :src="
                user.avatar_url == ''
                  ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
                  : user.avatar_url
              "
            />
            <span
              >{{ user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="onsetting()"
              >设置</el-dropdown-item
            >
            <el-dropdown-item @click.native="onLogout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import AppAside from "./components/aside";
import EventBus from "../../EventBus.js";
// import { getUserProfile } from "@/api/user";
export default {
  name: "layoutIndex",
  components: {
    AppAside,
  },
  props: {},
  data() {
    return {
      user: {
        avatar_url:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        name: "",
      },
      isCollapse: false,
    };
  },
  computed: {},
  watch: {
    // updateUser: function (newUserInfo, ewUserInfo) {
    //   this.user.avatar_url = newUserInfo.userImg;
    //   this.user.name = newUserInfo.userName;
    //   console.log("新的昵称：", this.user.name);
    // },
  },
  created() {
    //组件初始化好，请求获取用户资料
    // this.loadUserProfile();
    EventBus.$on("update-user", (name, avatar_url) => {
      this.user.name = name;
      this.user.avatar_url = avatar_url;
    });
  },
  mounted() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    this.user.name = user.name;
    this.user.avatar_url = user.avatar_url;
    console.log("首页mount：获取到user的信息", user.name);
  },
  methods: {
    //除了登录接口，其他所有接口都需要授权才能请求使用
    //或者说，除了登录接口，其他接口都需要提供你的身份令牌才能获取数据
    onsetting() {
      // alert("跳转到个人设置");
      EventBus.$emit("change-route", "/info");
      this.$router.push("info");
    },
    onLogout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //把用户的登录状态清除
          window.localStorage.removeItem("user");
          // window.localStorage.removeItem("updateUser");
          //跳转到登录页面
          this.$router.push("login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>
<style scoped>
.layoutContainer {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  width: auto;
  background-color: rgb(211, 220, 230);
}
.aside-menu {
  height: 100%;
}
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  /* background-color: rgb(179, 192, 209); */
}
.main {
  background-color: rgb(233, 238, 243);
}
.avatar-wrap {
  display: flex;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
