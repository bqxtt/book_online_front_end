<template>
  <div class="AdminUserContainer">
    <!-- 卡片 -->
    <el-card id="recordsCard">
      <p>
        用户累计&nbsp;&nbsp;
        <span id="userCount">{{ total }}</span> &nbsp;&nbsp;人
      </p>
      <el-row id="itemRow" v-loading="loading">
        <el-col
          class="itemCol"
          :span="3"
          v-for="(user, index) in users"
          :key="index"
        >
          <el-card :body-style="{ padding: '10px' }">
            <div class="itemCard">
              <div :class="{ dott: user.role == 'admin' }"></div>
              <div class="iamgeBorder">
                <img
                  :src="
                    user.avatar_url == ''
                      ? 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
                      : user.avatar_url
                  "
                  class="image"
                />
              </div>
              <div class="itemTitle">{{ user.user_id }}</div>
              <div class="bottom">
                <div>
                  <el-popover placement="bottom" width="120px" trigger="click">
                    <p>用户角色：{{ user.role }}</p>
                    <p>用户账号：{{ user.user_id }}</p>
                    <p>用户昵称：{{ user.name }}</p>
                    <el-button
                      type="primary"
                      class="button"
                      slot="reference"
                      plain
                      >详情</el-button
                    >
                  </el-popover>
                </div>
                <div>
                  <!-- <div :class="true?'example1':'example2'"></div> -->
                  <el-button
                    type="danger"
                    plain
                    class="button"
                    @click="handleDelete(user.user_id)"
                    >删除</el-button
                  >
                </div>
              </div>
            </div>
            <!-- </div> -->
          </el-card>
          <!-- </el-badge> -->
        </el-col>
      </el-row>

      <!-- 分页 -->
      <!-- total 是指一共有多少条数据，要从后端获取 -->
      <div class="page">
        <el-pagination
          size="mini"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
        >
        </el-pagination>
      </div>
      <!-- 分页 -->
    </el-card>
    <!-- 记录卡片 -->
  </div>
</template>
<script>
import { adminAllUserInfo, adminDeleteUserInfo } from "@/api/user.js";
export default {
  name: "AdminUserAdmin",
  components: {},
  props: {},
  data() {
    return {
      loading: false, //加载中
      users: [],
      total: 20, //用户总数
      pageSize: 10, //每页几条
      currentPage: 1, //当前页
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadInfoes(1);
  },
  mounted() {},
  methods: {
    // 全部用户
    loadInfoes(page = 1) {
      this.loading = true;
      adminAllUserInfo({
        page,
        page_size: this.pageSize,
      })
        .then((res) => {
          //成功
          this.loading = false;
          console.log("admin全部用户res：", res);
          this.total = res.data.page_info.total_count;
          this.users = res.data.users;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("admin加载用户信息失败");
          console.log(err);
        });
    },
    //删除用户
    handleDelete(user_id) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("确认删除用户。。。。");
          adminDeleteUserInfo(user_id)
            .then((res) => {
              console.log("删除用户", res);
              console.log("------当前页：", this.currentPage);
              this.loadInfoes(this.currentPage);
            })
            .catch((err) => {
              this.$message.error("没有删除成功哦");
              console.log("删除失败", err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.loadInfoes(1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.loadInfoes(val);
    },
  },
};
</script>
<style scoped>
#userCount {
  font-size: 24px;
  font-weight: 700;
  color: #1c56ad;
  text-shadow: 2px 2px 4px rgb(31, 33, 151);
}
#itemRow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.itemCol {
  margin: 20px;
}
.dott {
  width: 18px;
  height: 18px;
  left: -2px;
  top: 89px;
  background-image: url("https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png");
  background-size: cover;
  position: absolute;
  border: 0px solid rgb(223, 55, 55);
  border-radius: 50%;
}
.itemCard {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.itemTitle {
  text-align: center;
  padding-top: 10px;
  font-size: 12px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bottom {
  width: 100%;
  margin-top: 13px;
  padding-bottom: 10px;
  line-height: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.button {
  font-size: 12px;
  padding: 4px;
  display: inline-block;
}
/* .iamgeBorder {
  padding-top: 8px;
  height: 100px;
  width: 100px;
} */
.image {
  height: 80px;
  width: 80px;
  display: block;
  border: solid white 0px;
  border-radius: 50%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.page {
  margin-top: 25px;
  text-align: center;
}
</style>
