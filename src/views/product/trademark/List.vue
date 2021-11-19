<template>
  <div>
    <el-button type="primary" size="default" icon="el-icon-plus"
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
          <el-button type="warning" icon="el-icon-edit" size="small"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="small"
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

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
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
      dialogFormVisible: true,
      // 增加功能收集的数据
      tmForm: {
        tmName: "",
      },
      imageUrl: "",
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
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
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

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