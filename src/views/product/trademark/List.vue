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
  },
};
</script>

<style lang="scss" scoped >
</style>