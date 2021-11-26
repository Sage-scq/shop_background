<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- spu列表 -->
      <div v-show="!isShowSkuForm && !isShowSpuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="showAddSpuForm"
          :disabled="!category3Id"
          >添加spu</el-button
        >
        <el-table :data="spuList" style="width: 100%" border>
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- <el-tooltip effect="dark" content="添加sku" placement="top">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  @click="showAddSkuForm(row)"
                ></el-button>
              </el-tooltip> -->
              <el-tooltip effect="dark" content="修改spu" placement="top">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="warning"
                  @click="showUpdateSpuForm(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="spu详情" placement="top">
                <el-button
                  icon="el-icon-info"
                  size="mini"
                  type="info"
                  style="margin-right: 10px"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除spu" placement="top">
                <el-popconfirm
                  :title="`确定删除${row.spuName}吗？`"
                  @onConfirm="deleteSpu(row)"
                >
                  <el-button
                    slot="reference"
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 添加修改spu页面 -->
      <SpuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
        @successBack="successBack"
        @cancelBack="cancelBack"
      ></SpuForm>
      <!-- 添加sku页面 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "@/views/product/components/SpuForm.vue";
import SkuForm from "@/views/product/components/SkuForm.vue";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isShowList: true,
      page: 1,
      limit: 3,
      spuList: [],
      total: 0,
      isShowSpuForm: false,
      isShowSkuForm: false,
    };
  },
  methods: {
    // 点击添加sku按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
      this.$refs.spu.initAddSpuFormData(row);
    },
    // 点击修改spu按钮
    showUpdateSpuForm(row) {
      this.flag = row.id;
      this.isShowSpuForm = true;
      this.$refs.spu.initUpdateSpuFormData(row);
    },
    // 点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.initAddSpuFormData(this.category3Id);
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    changeCategory({ categoryId, level }) {
      // 保存子组件传递的ID
      if (level === 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.spuList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        // 发请求获取属性列表
        this.getSpuList();
      }
    },
    async getSpuList(page = 1) {
      this.page = page;
      const result = await this.$API.spu.getList(
        this.page,
        this.limit,
        this.category3Id
      );
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 子组件成功返回回调
    successBack() {
      if (this.flag) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
      this.flag = null;
    },
    // 子组件取消返回回调
    cancelBack() {
      this.flag = null;
    },
    // 删除spu回调
    async deleteSpu(row) {
      try {
        await this.$API.spu.remove(row.id);
        this.$message.success("删除成功");
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped >
</style>