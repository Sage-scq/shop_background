<template>
  <div>
    <el-form :model="spuForm" label-width="100px">
      <el-form-item label="spu名称">
        <el-input v-model="spuForm.spuName" placeholder="spu名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="spu描述">
        <el-input
          type="textarea"
          v-model="spuForm.description"
          placeholder="请输入spu描述"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="上传图片">
        <el-upload
          action="/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="spuSaleAttrIdName"
          :placeholder="
            unUsedSpuSaleAttrList.length > 0
              ? `还有${unUsedSpuSaleAttrList.length}未选择`
              : '没有未选择的'
          "
        >
          <el-option
            :label="unUsedSpuSaleAttr.name"
            :value="`${unUsedSpuSaleAttr.id}:${unUsedSpuSaleAttr.name}`"
            v-for="unUsedSpuSaleAttr in unUsedSpuSaleAttrList"
            :key="unUsedSpuSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!spuSaleAttrIdName"
          >添加销售属性</el-button
        >
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="spuForm.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
                class="input-new-tag"
                ref="saveTagInput"
                size="small"
                v-if="row.inputVisible"
                v-model="row.inputValue"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.saleAttrName}吗？`"
                @onConfirm="spuForm.spuSaleAttrList.splice($index, 1)"
              >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="small"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      category3Id: "",
      dialogImageUrl: "",
      dialogVisible: false,
      spuSaleAttrIdName: "",
      spuForm: {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuSaleAttrList: [],
      },
      spuImageList: [], // 获取到的图片列表
      trademarkList: [],
      baseSaleAttrList: [],
    };
  },
  methods: {
    // 取消回调
    cancel() {
      this.$emit("update:visible", false);
      // 重置数据
      this.$emit("cancelBack");
      this.resetData();
    },
    // 清空data数据
    resetData() {
      this.category3Id = "";
      this.dialogImageUrl = "";
      this.dialogVisible = false;
      this.spuSaleAttrIdName = "";
      this.spuForm = {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuSaleAttrList: [],
      };
      this.spuImageList = []; // 获取到的图片列表
      this.trademarkList = [];
      this.baseSaleAttrList = [];
    },
    // 保存回调
    async save() {
      let { spuForm, spuImageList, category3Id } = this;
      // 整理参数
      spuForm.spuImageList = spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        };
      });
      spuForm.category3Id = category3Id;
      spuForm.spuSaleAttrList.forEach((item) => {
        delete item.inputValue;
        delete item.inputVisible;
      });
      // 发送请求
      try {
        await this.$API.spu.addUpdate(spuForm);
        this.$message.success("保存成功");
        this.$emit("update:visible", false);
        this.$emit("successBack");
        this.resetData();
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    // 失去焦点或回车
    handleInputConfirm(row) {
      let saleAttrValueName = row.inputValue;
      let baseSaleAttrId = row.baseSaleAttrId;
      if (saleAttrValueName === undefined || saleAttrValueName.trim() === "") {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName.trim() === saleAttrValueName.trim();
      });
      if (isRepeat) {
        row.inputValue = "";
        return;
      }
      let obj = {
        saleAttrValueName,
        baseSaleAttrId,
      };
      row.spuSaleAttrValueList.push(obj);
      row.inputValue = "";
      row.inputVisible = false;
    },
    // 点击添加属性
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 点击添加属性的回调
    addSaleAttr() {
      // 构造对象
      let [baseSaleAttrId, saleAttrName] = this.spuSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuForm.spuSaleAttrList.push(obj);
      this.spuSaleAttrIdName = "";
    },
    // 删除图片的回调
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    // 预览大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 请求获取初始化数据
    async initUpdateSpuFormData(spu) {
      this.category3Id = spu.category3Id;
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (result.code === 200) {
        let spuImageList = imgResult.data;
        // 给每个图片添加name与url
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    async initAddSpuFormData(category3Id) {
      this.category3Id = category3Id;
      const trademarkResult = await this.$API.trademark.getList();
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data;
      }
      const baseSaleAttrResult = await this.$API.spu.getSaleAttrList();
      if (baseSaleAttrResult.code === 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
  },
  computed: {
    unUsedSpuSaleAttrList() {
      // 剩余的销售属性
      return this.baseSaleAttrList.filter((baseSaleAttr) => {
        return this.spuForm.spuSaleAttrList.every((spuSaleAttr) => {
          return baseSaleAttr.name !== spuSaleAttr.saleAttrName;
        });
      });
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>