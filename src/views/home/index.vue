<template>
  <div class="HomeContainer">
    <!-- 上部卡片 -->
    <el-card class="filter-form-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑 -->
      </div>
      <!-- 使用：Table 表格组件
        1.把需要展示的数组列表数据绑定给table组件的 data 属性
          注意：你不用去v-for 遍历，它自己会遍历
        2.设计表格列 el-table-column
          width 可以设定列表的宽度
          label 可以设定列的标题
          prop 用来设定要渲染的列表项数据字段-->
      <!-- <el-card> -->
      <el-table
        v-loading="loading"
        :data="
          books.filter(
            (data) =>
              !search ||
              data.book_name.toLowerCase().includes(search.toLowerCase())
          )
        "
        size="mini"
        stripe
        style="width: 100%"
      >
        <el-table-column label="封面" prop="" width="100px" align="center">
          <template slot-scope="scope">
            <!-- <img class="article-cover" src="./noimg.png" alt="" /> -->
            <!-- 下面这种情况在运行期间动态改变处理的，而本地图片必须在打包时就存在 -->
            <img
              class="article-cover"
              :src="scope.row.img_url || './noimg.png'"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column label="书名" prop="book_name" align="center">
        </el-table-column>
        <el-table-column label="作者" prop="author" align="center">
        </el-table-column>
        <el-table-column label="出版社" prop="publisher" align="center">
        </el-table-column>
        <el-table-column label="类别" prop="category" align="center">
        </el-table-column>
        <el-table-column width="150px">
          <template slot="header" slot-scope="scope" align="right">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
          <template slot-scope="scope" align="center">
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button
            >
            <el-dialog
              :title="title"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
              :modal="false"
            >
              <span>{{ desc }}</span>
            </el-dialog>
            <el-button
              size="mini"
              type="primary"
              plain
              :disabled="scope.row.rent_status == 2 ? true : false"
              @click="handleBorrow(scope.$index, scope.row)"
              >借阅</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-card> -->
      <!-- 数据列表 -->
      <!-- 分页列表 -->
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
      <!-- 分页列表 -->
    </el-card>
    <!-- 上部卡片 -->
  </div>
</template>
<script>
import { bookList, borrow } from "@/api/book.js";
import EventBus from "@/EventBus.js";
export default {
  name: "HomeAdmin",
  components: {},
  props: {},
  data() {
    return {
      loading: "true", //加载中
      search: "", //搜索框
      currentPage: 1, //当前页
      centerDialogVisible: false, //是否显示详情提示框
      desc: "", //详情提示框
      title: "", //详情题目
      total: 0, //总条数
      pageSize: 10, //每页几条
      books: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadBooks(1);
  },
  mounted() {},
  methods: {
    //全部图书
    loadBooks(page = 1) {
      this.loading = true;
      bookList({
        page_size: this.pageSize, //每页几条,默认为10
        page, //当前页码，默认为1
      })
        .then((res) => {
          this.loading = false;
          console.log("图书列表接收结果res：", res);
          console.log("总页数：", res.data.page_info.total_count);
          //设置books
          this.books = res.data.books;
          //设置总条数
          this.total = res.data.page_info.total_count;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("图书列表录出现异常");
          console.log(err);
        });
    },
    //借阅
    handleBorrow(index, row) {
      borrow({
        book_id: row.book_id,
      })
        .then((res) => {
          if (res.data.base_response.status_code == 1) {
            this.$message({
              type: "success",
              message: "借阅成功",
            });
            this.$router.push("/book"); //根据路径进行跳转
            EventBus.$emit("change-route", "/book");
          } else {
            this.$message({
              type: "info",
              message: "借阅失败",
            });
          }
        })
        .catch((err) => {
          console.log("=====>借阅失败", err);
          this.$message({
            type: "info",
            message: "借阅失败",
          });
        });
      // console.log(index, row);
    },
    //详情
    handleDetail(index, row) {
      this.centerDialogVisible = true;
      this.desc = row.description;
      this.title = row.book_name;
      console.log(index, row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.loadBooks(1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.loadBooks(val);
    },
  },
};
</script>
<style scoped>
.filter-form-card {
  width: 100%;
}
.page {
  margin-top: 10px;
  text-align: center;
}
.article-cover {
  width: 50px;
  height: 60px;
}
#select {
  height: 28px;
  line-height: 28px;
  width: 150px;
}
#tableCard {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
/* #bookTable {
  margin: 0 auto;
} */
</style>
