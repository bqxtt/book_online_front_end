<template>
  <div class="loginContioner">
    <div class="Header">
      <span class="option" @click="showLoginForm" :class="{ active: opt == 0 }"
        >登录</span
      >
      <span class="option">|</span>
      <span class="option" @click="showRegForm" :class="{ active: opt == 1 }"
        >注册</span
      >
    </div>
    <!-- 登录表单开始 -->
    <el-form
      v-show="this.opt == 0"
      class="Form"
      ref="loginForm"
      :model="loginForm"
      status-icon
      :rules="loginRules"
    >
      <el-form-item prop="userName">
        <el-input
          v-model="loginForm.userName"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          type="password"
          v-model="loginForm.pass"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="loginForm.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          class="loginBtn"
          type="primary"
          @click="onLogin"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 登录表单结束 -->
    <!-- 注册表单开始 -->
    <el-form
      v-show="this.opt == 1"
      class="Form"
      ref="registerForm"
      :model="registerForm"
      status-icon
      :rules="regRules"
    >
      <el-form-item prop="userName">
        <el-input
          v-model="registerForm.userName"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input
          type="password"
          v-model="registerForm.pass"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          type="password"
          v-model="registerForm.checkPass"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="loginBtn"
          type="primary"
          @click="onRegister"
          :loading="loginLoading"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 注册表单结束 -->
  </div>
</template>
<script>
import { login } from "@/api/user";
import { register } from "@/api/user";
import EventBus from "@/EventBus.js";
export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      opt: 0,
      loginForm: {
        userName: "", //手机号
        pass: "", //验证码
        agree: false,
      },
      registerForm: {
        userName: "",
        pass: "",
        checkPass: "",
      },
      regRules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "change" },
          {
            pattern: /[0|1|2|3|4|5|6|7|8|9]\d{10}$/,
            message: "请输入正确的账号格式",
          },
        ],
        pass: [
          { validator: validatePass, trigger: "change" },
          { pattern: /^[0-9A-Za-z]{6,}$/, message: "密码不少于6位" },
        ],
        checkPass: [
          { validator: validatePass2, trigger: "change" },
          { pattern: /^[0-9A-Za-z]{6,}$/, message: "密码不少于6位" },
        ],
      },
      loginRules: {
        //表单验证规则配置
        //要校验的数据名称：规则列表[]
        userName: [
          { required: true, message: "请输入账号", trigger: "change" },
          {
            pattern: /[0|1|2|3|4|5|6|7|8|9]\d{10}$/,
            message: "请输入正确账号格式",
          },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "change" },
          { pattern: /^[0-9A-Za-z]{6,}$/, message: "密码不少于六位" },
        ],
        agree: [
          {
            //自定义校验规则
            //验证通过：callback()
            //验证失败：callback(new Error('请同意用户协议'))
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
      loginLoading: false, //登录状态
      registering: false, //注册状态
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    showLoginForm() {
      this.opt = 0;
      this.resetForm("loginForm");
    },
    showRegForm() {
      this.opt = 1;
      this.resetForm("registerForm");
    },
    onRegister() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          //调用注册接口
          this.register();
        } else {
          this.$message.error("请正确填写信息");
          return;
        }
      });
    },
    onLogin() {
      //获取表单数据(根据接口数据绑定数据)
      // const user = this.user
      //表单验证
      //validate 是异步的
      this.$refs["loginForm"].validate((valid) => {
        //如果表单验证失败，停止请求提交
        if (!valid) {
          this.$message.error("请正确填写信息");
          return;
        }
        //验证通过，请求登录
        console.log("登录验证通过。。。");
        // alert("登录成功!");
        // this.$router.push("/"); //根据路径进行跳转
        this.login();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    register() {
      this.registering = true;
      let data = {};
      let user_auth = {};
      user_auth["password"] = this.registerForm.pass;
      user_auth["user_id"] = this.registerForm.userName;
      data["user_auth"] = user_auth;
      register(data)
        .then((res) => {
          //处理后端响应结果
          //注册成功
          console.log("注册成功res", res);
          this.registering = false;
          this.$message({
            message: "注册成功",
            type: "success",
          });
          //跳转到登录
          this.opt = 0;
          this.loginForm.userName = user_auth.user_id;
          this.loginForm.pass = user_auth.password;
        })
        .catch((err) => {
          this.registering = false;
          this.$message.error("注册失败或账户已存在");
          console.log("注册失败", err);
        });
    },
    login() {
      //开启登录中。。。
      this.loginLoading = true;
      //对于代码中的请求操作
      //1.接口请求中可能需要重用
      //2.实际工作中，接口非常容易变动，改起来比较麻烦
      //建议把所有的请求都封装成函数然后统一管理
      // request({
      //   method:'POST',
      //   url:'/mp/v1_0/authorizations',
      //   //data 用来设置POST请求头
      //   data:this.login
      // })
      // console.log("loginForm:", this.loginForm);
      //准备请求数据
      let data = {};
      let user_auth = {};
      user_auth["password"] = this.loginForm.pass;
      user_auth["user_id"] = this.loginForm.userName;
      data["user_auth"] = user_auth;
      // console.log(data);
      login(data)
        .then((res) => {
          //处理后端响应结果
          //登录成功
          this.loginLoading = false;
          const role = res.data.user_info.role;
          if (role == "admin") {
            this.$message({
              message: "管理员，欢迎登录",
              type: "success",
            });
          } else {
            this.$message({
              message: "欢迎登录图书管理系统",
              type: "success",
            });
          }
          //本地存储字符串，只能存储字符串
          window.localStorage.setItem(
            "user",
            JSON.stringify(res.data.user_info)
          );
          console.log("登录请求成功：", res.data.user_info);
          //跳转到首页
          // this.$router.push('/') //根据路径进行跳转
          console.log("登录用户角色：", role);
          if (role == "user") {
            this.$router.push({
              //根据路由名字进行跳转
              name: "home",
            });
            EventBus.$emit("change-side", "user");
          } else {
            this.$router.push({
              //根据路由名字进行跳转
              name: "admin",
            });
            EventBus.$emit("change-side", "admin");
          }
        })
        .catch((err) => {
          this.loginLoading = false;
          this.$message.error("登录失败");
          console.log("登录失败", err);
        });
    },
  },
};
</script>
<style scoped>
.loginContioner {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./bg.png") no-repeat;
  /* background: url("./bg1.jpg") no-repeat; */
  background-size: cover;
}
.Header {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 40px 40px 0 40px;
  min-width: 300px;
}
.option {
  color: rgb(75, 73, 73);
  margin-right: 4px;
}
.active {
  /* font-size: 24px; */
  font-weight: 700;
  color: #409eff;
}
.Form {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 40px;
  min-width: 300px;
}
.loginBtn {
  width: 100%;
}
</style>
