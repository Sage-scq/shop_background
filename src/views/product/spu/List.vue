<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-bottom: 20px"
        @click="showAddSpuForm"
        >添加spu</el-button
      >
      <!-- spu列表 -->
      <div v-show="!isShowSkuForm && !isShowSpuForm">
        <el-table :data="spuList" style="width: 100%" border>
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-tooltip effect="dark" content="添加sku" placement="top">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  @click="showAddSkuForm(row)"
                ></el-button>
              </el-tooltip>
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
                <el-popconfirm :title="`确定删除${row.spuName}吗？`">
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
      </div>
      <!-- 添加修改spu页面 -->
      <SpuForm v-show="isShowSpuForm"></SpuForm>
      <!-- 添加sku页面 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>

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
    },
    // 点击修改spu按钮
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
    },
    // 点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
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
  },
};
</script>

<style lang="scss" scoped >
</style>