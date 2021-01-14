<template>
  <div class="AdminBookContainer">
    <!-- 上部卡片 -->
    <el-card class="filter-form-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            :to="{ path: '/admin' }"
            @click.native="updateAside"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>借阅管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑 -->
      </div>
      <!-- 筛选表单 -->
      <el-form
        id="selectForm"
        ref="selectform"
        :model="selectform"
        label-width="40px"
        size="mini"
      >
        <el-form-item label="状态" width="200px">
          <el-radio-group v-model="selectform.status" @change="loadRecords(1)">
            <!-- label 默认是显示的文本和选中时返回的值 -->
            <el-radio label="all">全部</el-radio>
            <el-radio :label="1">待还</el-radio>
            <el-radio :label="2">历史</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <!-- 如果不传参数，不会用默认的page=1 因为click方法会默认传递一个没用的数据 -->
          <el-button type="primary" :disabled="loading" @click="loadRecords(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 筛选表单 -->
    </el-card>
    <!-- 上部卡片 -->
    <!-- 下部卡片 -->
    <!-- 记录卡片 -->
    <el-card id="recordsCard">
      <p>共查询到&nbsp; {{ total }} &nbsp;结果</p>
      <!--  <el-row id="itemRow" v-loading="loading">
        <el-col
          class="itemCol"
          :span="3"
          v-for="(record, index) in records"
          :key="index"
        >
          <el-card :body-style="{ padding: '10px' }">
            <div class="itemCard">
              <img
                :src="
                  record.book.img_url == ''
                    ? 'https://www.hualigs.cn/image/5ffafc911e172.jpg'
                    : record.book.img_url
                "
                class="image"
              />
              <div class="itemTitle">{{ record.book.book_name }}</div>
              <div class="bottom">
                <div>
                  <el-popover placement="bottom" width="40" trigger="click">
                    <p>借阅时间：{{ record.borrowed_at }}</p>
                    <p>应还时间：{{ record.deadline }}</p>
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
                  <div :class="true ? 'example1' : 'example2'"></div>
                  <el-button
                    :type="record.status == 2 ? 'info' : 'success'"
                    plain
                    class="button"
                    :disabled="record.status == 2 ? true : false"
                    @click="handleReturn(record.record_id)"
                    >归还</el-button
                  >
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>-->
      <!--查询结果表格 -->
      <el-table
        v-loading="loading"
        :data="records"
        size="mini"
        stripe
        style="width: 100%"
        class="resTable"
      >
        <el-table-column label="用户id" prop="user_id" align="center">
        </el-table-column>
        <el-table-column label="书名" prop="book.book_name" align="center">
        </el-table-column>
        <el-table-column label="借阅时间" prop="borrowed_at" align="center">
        </el-table-column>
        <!-- status==1 ? deadline, returned_at -->
        <el-table-column label="应还时间" prop="deadline" align="center">
        </el-table-column>
        <el-table-column label="归还时间" prop="returned_at" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope" align="center">
            <div id="divout">
              <div
                :class="{
                  status: true,
                  borrow: scope.row.status == '1',
                  return: scope.row.status == '2',
                }"
              >
                {{ scope.row.status == "1" ? "未还" : "已还" }}
              </div>
            </div>
            <!-- <el-button
              size="mini"
              type="danger"
              plain
              :value="this.status"
              @click="handleDetail(scope.$index, scope.row)"
              >{{ scope.row.status=='1'?'未还':'已还' }}</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <!--查询结果表格  -->
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
import {
  adminAllRecords,
  adminRecordReturned,
  adminRecordBorrowed,
} from "@/api/book.js";
import EventBus from "../../EventBus.js";
export default {
  name: "AdminBookAdmin",
  components: {},
  props: {},
  data() {
    return {
      selectform: {
        status: "all",
      },
      records: [], //记录
      recordsform: {},
      loading: false,
      total: 0, //总条数
      pageSize: 10, //每页几条
      currentPage: 1, //当前页
      status: "", //状态
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadRecords(1);
  },
  mounted() {},
  methods: {
    loadRecords(page = 1) {
      let status = this.selectform.status;
      if (status == "1") {
        //代还
        this.loadBorrowed(page);
      } else if (status == "2") {
        //历史
        this.loadReturned(page);
      } else {
        //全部
        this.loadAllRecords(page);
      }
    },
    loadAllRecords(page = 1) {
      this.loading = true;
      adminAllRecords({
        page,
        page_size: this.pageSize,
      })
        .then((res) => {
          //成功
          this.loading = false;
          console.log("admin全部借阅记录res：", res);
          this.total = res.data.page_info.total_count;
          this.records = res.data.records;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("admin全部借阅记录出现异常");
          console.log(err);
        });
    },
    loadBorrowed(page = 1) {
      this.loading = true;
      adminRecordBorrowed({
        page,
        page_size: this.pageSize,
      })
        .then((res) => {
          //成功
          this.loading = false;
          console.log("待还借阅记录res：", res);
          this.total = res.data.page_info.total_count;
          this.records = res.data.records;
        })
        .catch((err) => {
          //失败
          this.loading = false;
          this.$message.error("待还记录出现异常");
          console.log(err);
        });
    },
    loadReturned(page = 1) {
      this.loading = true;
      adminRecordReturned({
        page,
        page_size: this.pageSize,
      })
        .then((res) => {
          //成功
          this.loading = false;
          console.log("已还借阅记录res：", res);
          this.total = res.data.page_info.total_count;
          this.records = res.data.records;
        })
        .catch((err) => {
          //失败
          this.loading = false;
          this.$message.error("已还记录出现异常");
          console.log(err);
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.loadRecords(1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.loadRecords(val);
    },
    updateAside() {
      console.log("change route");
      EventBus.$emit("change-route", "/admin"); //事件名称 参数
    },
  },
};
</script>
<style scoped>
#selectForm {
  display: flex;
  flex-direction: row;
}
#recordsCard {
  margin-top: 10px;
  font-size: 14px;
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
.itemCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.itemTitle {
  text-align: center;
  padding-top: 10px;
  font-size: 14px;
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

.image {
  height: 100px;
  width: 80px;
  display: block;
  padding-top: 8px;
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
.resTable {
  margin-top: 10px;
}
.borrow {
  color: rgba(255, 0, 0, 1);
  border: 1px solid rgba(255, 0, 0, 1);
  background-color: rgba(252, 248, 248, 0.945);
}
.borrow:hover {
  color: white;
  border: 1px solid rgba(255, 255, 255, 1);
  background-color: rgba(255, 0, 0, 1);
}
.return:hover {
  color: white;
  border: 1px solid rgb(5, 154, 253);
  background-color: rgb(5, 154, 253);
}
.return {
  color: rgb(5, 154, 253);
  border: 1px solid rgb(5, 154, 253);
  background-color: rgb(244, 253, 252);
}
.status {
  border-radius: 6%;

  height: 30px;
  width: 80px;
  padding: 5px auto;
}
#divout {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
