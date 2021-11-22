<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <!-- 列表 -->
    <el-card style="margin-top: 20px"> </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      // 保存子组件传递的ID
      if (level === 1) {
        this.category2Id = "";
        this, (this.category3Id = "");
        this.attrList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.attrList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        // 发请求获取属性列表
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped >
</style>