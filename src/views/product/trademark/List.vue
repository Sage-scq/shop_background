<template>
  <div>
    <el-button type="primary" size="default" icon="el-icon-plus"
      >添加</el-button
    >
    <el-table border style="margin: 20px 0">
      <el-table-column width="80" label="序号" align="center" type="index">
      </el-table-column>
      <el-table-column width="width" label="品牌名称"> </el-table-column>
      <el-table-column width="width" label="品牌LOGO"> </el-table-column>
      <el-table-column width="width" label="操作"> </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="text-align: center"
      :current-page="1"
      :page-sizes="[10, 20, 50]"
      :page-size="3"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="0"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      columns: 4,
    };
  },
};
</script>

<style lang="scss" scoped >
</style>