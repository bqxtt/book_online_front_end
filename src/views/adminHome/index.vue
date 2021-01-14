<template>
  <div class="AdminHomeContainer">
    <el-card class="filter-form-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑 -->
        <!-- 新增按钮 -->
        <el-button
          style="float: right"
          icon=" el-icon-plus"
          circle
          type="info"
          plain
          @click="handleAddBtn()"
        ></el-button>
        <!-- 新增按钮结束 -->
        <!-- 头部结束 -->
      </div>
      <!-- 新增图书弹窗 -->
      <el-dialog
        title="新增图书"
        :visible.sync="addFormVisible"
        :modal="false"
        center
        width="40%"
      >
        <el-form
          :rules="rules"
          :model="addForm"
          size="mini"
          label-position="left"
          ref="addForm"
        >
          <el-form-item label="封面" :label-width="formLabelWidth" id="imgItem">
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
                  v-if="addForm.img_url"
                  :src="addForm.img_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item
            label="书名"
            :label-width="formLabelWidth"
            prop="book_name"
          >
            <el-input v-model="addForm.book_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="作者"
            :label-width="formLabelWidth"
            prop="author"
          >
            <el-input v-model="addForm.author" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="类型"
            :label-width="formLabelWidth"
            prop="category"
          >
            <el-select v-model="addForm.category" placeholder="请选择活动区域">
              <el-option label="文艺" value="文艺"></el-option>
              <el-option label="科技" value="科技"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="出版商"
            :label-width="formLabelWidth"
            prop="publisher"
          >
            <el-input v-model="addForm.publisher" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="描述"
            :label-width="formLabelWidth"
            prop="description"
          >
            <el-input
              type="textarea"
              autosize
              v-model="addForm.description"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('addForm')">取 消</el-button>
          <el-button type="primary" @click="handleAdd('addForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 新增图书弹窗结束 -->
      <!-- 修改图书弹窗 -->
      <el-dialog
        title="修改图书"
        :visible.sync="editFormVisible"
        :modal="false"
        center
        width="40%"
      >
        <el-form
          :rules="rules"
          :model="editForm"
          size="mini"
          label-position="left"
          ref="editForm"
        >
          <el-form-item label="封面" :label-width="formLabelWidth" id="imgItem">
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
                v-loading="editLoadingImg"
              >
                <img
                  v-if="editForm.img_url"
                  :src="editForm.img_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item
            label="书名"
            :label-width="formLabelWidth"
            prop="book_name"
          >
            <el-input
              v-model="editForm.book_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="作者"
            :label-width="formLabelWidth"
            prop="author"
          >
            <el-input v-model="editForm.author" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="类型"
            :label-width="formLabelWidth"
            prop="category"
          >
            <el-select v-model="editForm.category" placeholder="请选择活动区域">
              <el-option label="文艺" value="文艺"></el-option>
              <el-option label="科技" value="科技"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="出版商"
            :label-width="formLabelWidth"
            prop="publisher"
          >
            <el-input
              v-model="editForm.publisher"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="描述"
            :label-width="formLabelWidth"
            prop="description"
          >
            <el-input
              autosize
              type="textarea"
              v-model="editForm.description"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetEditForm('editEditForm')">取 消</el-button>
          <el-button type="primary" @click="handleEdit('editForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 修改图书弹窗结束 -->
      <!-- 全部数据列表 -->
      <el-table
        v-loading="loading"
        :data="books"
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
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope" align="center">
            <el-dialog
              :title="title"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
              :modal="false"
            >
              <span>{{ desc }}</span>
            </el-dialog>
            <!-- 详情 -->
            <el-button
              size="mini"
              icon=" el-icon-search"
              circle
              type="success"
              plain
              @click="handleDetail(scope.$index, scope.row)"
            ></el-button>
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="handleEditBtn(scope.$index, scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 全部数据列表结束 -->
      <!-- 分页列表 -->
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
  </div>
</template>
<script>
import { bookList, adminAdd, adminEdit, adminDelete } from "@/api/book.js";
export default {
  name: "AdminHomeAdmin",
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
      books: [
        //图书列表
        // {
        //   book_id: "", //
        //   isbn: "", //
        //   book_name: "",
        //   publisher: "",
        //   category: "",
        //   author: "",
        //   img_url: "",
        //   description: "",
        // },
      ],
      addFormVisible: false, //是否显示新增的dialog
      editFormVisible: false, //是否显示编辑的dialog
      editForm: {
        //编辑图书的表单  临时的数据
        author: "",
        book_id: "",
        book_name: "",
        category: "",
        description: "",
        img_url: "",
        isbn: "1",
        publisher: "",
        rent_status: 0,
      },
      addForm: {
        //新增图书的表单
        author: "",
        book_id: "1",
        book_name: "",
        category: "",
        description: "",
        img_url: "",
        isbn: "1",
        publisher: "",
        rent_status: 0,
      },
      rules: {
        //新增图书表单的校验
        author: [{ required: true, message: "请填写作者", trigger: "change" }],
        book_name: [
          { required: true, message: "请填写书名", trigger: "change" },
        ],

        publisher: [
          { required: true, message: "请填写出版商", trigger: "change" },
        ],
        category: [
          { required: true, message: "请选择书籍类别", trigger: "change" },
        ],
      },
      formLabelWidth: "70px", //标签宽度
      img: {
        //上传头像接口数据
        data: {
          apiType: "ali",
          token: "40c317b040e64728eb354f9bfc414e82",
        },
      },
      loadingImg: false, //新增上传头像加载中
      editLoadingImg: false, //编辑上传头像加载中
      // temp: {}, //显示的数据（修改前）
      centerDialogVisible: false, //详情提示框
      desc: "", //详情描述
      title: "", //详情标题描述
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
          console.log("总条数：", res.data.page_info.total_count);
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
    //新增按钮
    handleAddBtn() {
      this.loadingImg = false;
      // this.resetForm("addForm");
      this.addFormVisible = true;
    },
    //新增弹窗确认
    handleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.adminAdd();
        } else {
          this.$message.error("请正确填写图书信息");
          return false;
        }
      });
    },
    // 新增图书接口
    adminAdd() {
      //准备请求数据
      let data = {};
      this.addForm.book_id -= 0;
      data["book"] = this.addForm;
      adminAdd(data)
        .then((res) => {
          console.log("新增图书res：", res);
          this.addFormVisible = false; //关闭弹窗
          this.loadBooks(this.currentPage); //刷新
          this.resetForm("addForm"); //清空表单
        })
        .catch((err) => {
          this.$message.error("没有添加成功哦");
          console.log("新增失败", err);
        });
    },
    //编辑按钮
    handleEditBtn(index, row) {
      this.editLoadingImg = false;
      this.editFormVisible = true;
      this.editForm = JSON.parse(JSON.stringify(row));
      // this.editForm = row; //临时
      // console.log(index, row);
    },
    //编辑 弹窗确认
    handleEdit(formName) {
      this.editLoadingImg = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.adminEdit();
        } else {
          this.$message.error("请正确填写图书信息");
          return false;
        }
      });
    },
    //编辑 调用接口
    adminEdit() {
      //准备请求数据
      let data = {};
      data["book"] = this.editForm;
      adminEdit(data)
        .then((res) => {
          console.log("编辑图书res：", res);
          this.editFormVisible = false;
          this.loadBooks(this.currentPage);
        })
        .catch((err) => {
          this.$message.error("没有编辑成功哦");
          console.log("编辑失败", err);
        });
    },
    //删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("确认删除。。。。");
          adminDelete(row.book_id)
            .then((res) => {
              console.log("删除图书res", res);
              console.log("------当前页：", this.currentPage);
              this.loadBooks(this.currentPage);
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
    //详情
    handleDetail(index, row) {
      this.centerDialogVisible = true;
      this.desc = row.description;
      this.title = row.book_name;
      console.log(index, row);
    },
    //取消
    resetForm(formName) {
      this.addForm.img_url = "";
      this.$refs[formName].resetFields();
      this.addFormVisible = false;
    },
    //修改的取消
    resetEditForm(formName) {
      // console.log("取消修改：this.temp", this.temp);
      // this.editForm = this.temp;
      this.editFormVisible = false;
      // console.log("取消修改：this.editForm", this.editForm);
    },
    //头像
    handleLoading(event, file, fileList) {
      this.loadingImg = true;
      this.editLoadingImg = true;
    },
    handleSuccess(response, file, fileList) {
      console.log("上传图片成功：", response);
      this.loadingImg = false;
      this.editLoadingImg = false;
      this.addForm.img_url = response.data.url.distribute;
      this.editForm.img_url = response.data.url.distribute;
    },
    handleFail() {
      this.$message.error("文件超过大小");
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.loadBooks(1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
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
/* 上传头像部分 */
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
/* 上传头像部分 */
/* #select {
  height: 28px;
  line-height: 28px;
  width: 150px;
} */
/* #tableCard {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
} */
</style>
