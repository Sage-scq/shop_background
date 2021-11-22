<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="changeC1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="changeC2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="changeC3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelector",
  data() {
    return {
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  mounted() {
    //   发请求获取category
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      try {
        const result = await this.$API.category.getCategory1();
        if (result.code === 200) {
          this.category1List = result.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 选中一级分类的回调
    async changeC1(c1Id) {
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      try {
        const result = await this.$API.category.getCategory2(c1Id);
        if (result.code === 200) {
          this.category2List = result.data;
          this.$emit("changeCategory", { categoryId: c1Id, level: 1 });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 选中二级分类的回调
    async changeC2(c2Id) {
      this.cForm.category3Id = "";
      this.category3List = [];
      try {
        const result = await this.$API.category.getCategory3(c2Id);
        if (result.code === 200) {
          this.category3List = result.data;
          this.$emit("changeCategory", { categoryId: c2Id, level: 2 });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 选中三级分类的回调
    changeC3(c3Id) {
      // 需要通信，父组件发请求
      this.$emit("changeCategory", { categoryId: c3Id, level: 3 });
    },
  },
};
</script>

<style lang="scss" scoped >
</style>