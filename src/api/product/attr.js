import request from '@/utils/request'
export default {
    // 选中三级分类获取平台属性
    getList(category1Id, category2Id, category3Id) {
        return request.get(`/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    // 删除某个平台属性
    delete(attrId) {
        return request.delete(`/product/deleteAttr/${attrId}`)
    },
    // 增加或修改
    addOrUpdate(attr) {
        return request.post('/product/saveAttrInfo', attr)
    }
}