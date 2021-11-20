<template>
  <div>
    <el-button
      type="primary"
      size="default"
      icon="el-icon-plus"
      @click="showAddDialog"
      >添加</el-button
    >
    <el-table border style="margin: 20px 0" :data="trademarkList">
      <el-table-column width="80" label="序号" align="center" type="index">
      </el-table-column>
      <el-table-column width="width" label="品牌名称" prop="tmName">
      </el-table-column>
      <el-table-column width="width" label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column width="width" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="small"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
    >
    </el-pagination>

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      // 控制dialog是否显示
      dialogFormVisible: false,
      // 增加功能收集的数据
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      imageUrl: "",
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    deleteTrademark(row) {
      this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 处理点击确认的逻辑
        .then(async () => {
          try {
            await this.$API.trademark.delete(row.id);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message.error("删除品牌失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async addOrUpdate() {
      // 获取收集的参数
      let trademark = this.tmForm;
      // 整理收集的参数
      // 该功能不需要整理数据
      // 发送请求
      // 成功/失败后
      try {
        const result = await this.$API.trademark.addOrUpdate(trademark);
        this.$message.success(trademark.id ? "修改品牌成功" : "添加品牌成功");
        // 返回列表页
        this.dialogFormVisible = false;
        this.getTrademarkList(trademark.id ? this.page : 1); // 添加成功返回第一页，修改成功返回当前页
      } catch (error) {
        this.$message.success(trademark.id ? "修改品牌失败" : "添加品牌失败");
      }
    },
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      // 需要用到浅拷贝
      this.tmForm = {
        ...row,
      }; // 修改时需要id
    },
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 上传相关的回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg"; // 判断图片格式
      const isLt2M = file.size / 1024 / 1024 < 2; // 判断图片大小

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>