<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <!-- 列表 -->
    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          @click="showAddDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                style="margin-right: 10px"
                type="info"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-tooltip content="修改" placement="top">
                <el-button
                  icon="el-icon-edit"
                  type="warning"
                  size="small"
                  @click="showUpdateDiv(row)"
                  style="margin-right: 10px"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-popconfirm
                  :title="`确定删除${row.attrName}吗？`"
                  @onConfirm="deleteAttr(row)"
                >
                  <el-button
                    slot="reference"
                    icon="el-icon-delete"
                    size="small"
                    type="danger"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改页面 -->
      <div v-show="!isShowList">
        <el-form ref="form" :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrForm.attrValueList"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                size="small"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; width: 100%; height: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-popconfirm
                  :title="`确定删除${row.valueName}吗？`"
                  @onConfirm="attrForm.attrValueList.splice($index, 1)"
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
        <el-button
          type="primary"
          @click="save"
          :disabled="attrForm.attrValueList.length === 0"
          >保存</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 删除attr回调
    async deleteAttr(row) {
      try {
        await this.$API.attr.delete(row.id);
        this.$message.success("删除成功");
        this.getAttrList();
      } catch (error) {
        this.$message.error("删除失败");
        console.log(error);
      }
    },
    // 点击保存回调
    async save() {
      let attr = this.attrForm;
      // 整理参数
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== "") {
          delete item.isEdit; // 过滤同时删掉isEdit
          return true;
        }
      });
      // 没有属性值不发请求
      if (attr.attrValueList.length === 0) {
        return;
      }
      try {
        let result = await this.$API.attr.addOrUpdate(attr);
        if (result.code === 200) {
          this.$message.success("保存成功");
          this.isShowList = true;
          this.getAttrList();
        }
      } catch (error) {
        this.$message.error("添加/修改属性失败");
      }
    },
    // 切换为编辑模式
    toEdit(row, index) {
      row.isEdit = true;
      // 不能获取的太快，需要等创建完成再进行获取
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 切换为察看模式
    toLook(row) {
      // 数据不能为空
      if (row.valueName.trim() === "") {
        this.$message.info("输入不能为空");
        row.valueName = "";
        return;
      }
      // 判断不重复
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });
      if (!isRepeat) {
        row.isEdit = false;
      } else {
        this.$message.info("输入不能重复");
        row.valueName = "";
        return;
      }
    },
    // 点击切换到修改页面
    showUpdateDiv(row) {
      this.isShowList = false;
      // 深拷贝，让修改的和显示的不是同一个数据
      this.attrForm = cloneDeep(row);
      this.attrForm.attrValueList.forEach((attr) => {
        this.$set(attr, "isEdit", false);
      });
    },
    // 点击切换到添加页面
    showAddDiv() {
      this.isShowList = false;
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 点击添加属性值
    addAttrValue() {
      // 首先添加一个空对象
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: "",
        isEdit: true,
      });
      // 获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
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