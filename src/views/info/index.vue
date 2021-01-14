<template>
  <div class="InfoContainer">
    <!-- 上部卡片 -->
    <el-card class="filter-form-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }" @click.native="updateAside"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑 -->
      </div>
      <!-- 卡片头部结束 -->
      <!-- 个人信息表单 -->
      <el-form
        ref="userInfo"
        :model="userInfo"
        label-width="80px"
        size="mini"
        id="infoForm"
      >
        <el-form-item label="头像" id="imgItem">
          <div style="width: 148px">
            <el-upload
              class="avatar-uploader"
              action="https://www.hualigs.cn/api/upload"
              list-type="picture-card"
              name="image"
              :show-file-list="false"
              :data="this.img.data"
              :on-success="handleSuccess"
              :on-error="handleFail"
              :on-progress="handleLoading"
              v-loading="loadingImg"
            >
              <img
                v-if="userInfo.avatar_url"
                :src="userInfo.avatar_url"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="userInfo.user_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属">
          <el-cascader
            ref="myCascader"
            :options="options"
            clearable
            change-on-select
            size="mini"
            placeholder="学院/专业/班级"
            @change="handleChecked"
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="个签">
          <el-input type="textarea" v-model="userInfo.motto"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateInfo">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 个人信息卡片 -->
    </el-card>
    <!-- 上部卡片 -->
  </div>
</template>
<script>
import axios from "axios";
import { updateInfo, getInfo } from "@/api/user";
import EventBus from "../../EventBus.js";
export default {
  name: "InfoAdmin",
  components: {},
  props: {},
  data() {
    return {
      loadingImg: false,
      img: {
        data: {
          apiType: "ali",
          token: "40c317b040e64728eb354f9bfc414e82",
        },
      },
      dialogImageUrl:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      dialogVisible: false,
      options: [
        {
          value: "xindian",
          label: "信电",
          children: [
            {
              value: "rj",
              label: "软件",
              children: [
                {
                  value: "1701",
                  label: "1701",
                },
                {
                  value: "1702",
                  label: "1702",
                },
                {
                  value: "1703",
                  label: "1703",
                },
              ],
            },
          ],
        },
        {
          value: "shuli",
          label: "数理",
          children: [
            {
              value: "sx",
              label: "数学",
              children: [
                {
                  value: "1701",
                  label: "1701",
                },
                {
                  value: "1702",
                  label: "1702",
                },
                {
                  value: "1703",
                  label: "1703",
                },
              ],
            },
          ],
        },
      ],
      userInfo: {
        avatar_url: "",
        user_id: "",
        name: "",
        department: "",
        classs: "",
        motto: "",
        token: "",
      },
      temp: "", //临时
    };
  },
  computed: {},
  watch: {},
  created() {
    this.refreshInfo();
  },
  mounted() {},
  methods: {
    //头像
    handleLoading(event, file, fileList) {
      this.loadingImg = true;
    },
    handleSuccess(response, file, fileList) {
      console.log("上传图片成功：", response);
      this.loadingImg = false;
      this.userInfo.avatar_url = response.data.url.distribute;
    },
    handleFail() {
      this.$message.error("文件超过大小");
    },
    //取消
    cancel() {
      this.$message({ message: "取消保存", type: "info" });
      this.userInfo = this.temp;
    },
    //所属
    // handleChecked() {
    //   // let checked = "";
    //   const lenLength =
    //     this.$refs.myCascader.getCheckedNodes()[0].pathLabels.length - 1;
    //   this.userInfo.department += this.$refs.myCascader.getCheckedNodes()[0].pathLabels[
    //     lenLength
    //   ];
    //   console.log("学院信息：", this.userInfo.department);
    // },
    loadInfo() {
      const user = JSON.parse(window.localStorage.getItem("user"));
      console.log("我的信息获取打印：", user);
      this.userInfo.token = user.token;
    },
    // //获取个人信息（无token）
    refreshInfo() {
      getInfo()
        .then((res) => {
          console.log("查询用户信息res", res);
          this.temp = JSON.parse(JSON.stringify(res.data.user));
          this.userInfo = res.data.user;
          this.loadInfo();
        })
        .catch((err) => {
          this.$message.error("调用个人信息出现异常");
          console.log(err);
        });
    },
    //修改个人信息
    updateInfo() {
      let user = this.userInfo;
      let updateUser = {};
      console.log("修改个人信息的参数data", user);
      updateInfo({
        user,
      })
        .then((res) => {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          console.log("修改个人信息成功res", res);
          // updateUser.userImg = res.data.user.avatar_url;
          // updateUser.userName = res.data.user.name;
          // window.localStorage.setItem("updateUser", JSON.stringify(updateUser));
          this.refreshInfo();
          EventBus.$emit("update-user", user.name, user.avatar_url);
        })
        .catch((err) => {
          this.$message.error("修改个人信息出现异常");
          console.log("err:", err);
        });
    },
    updateAside() {
      EventBus.$emit("change-route", "/");
    },
  },
};
</script>
<style scoped>
.imgItem {
  width: 148px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 148px !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 144px;
  height: 144px;
  padding: 1px;
  display: block;
}
.mainInfo {
  width: 100%;
}
#infoForm {
  width: 400px;
}
.infoCard {
  margin: 0 auto;
  width: 520px;
}
.imgBorder {
  text-align: center;
  width: 130px;
  height: 130px;
  border: #ccc 1px dotted;
  padding: 8px;
}
</style>
