import request from '@/utils/request'
export default {
    // 获取分页列表
    getPageList(page, limit) {
        return request.get(`/product/baseTrademark/${page}/${limit}`)
    },
    // 删除
    delete(id) {
        return request.delete(`/product/baseTrademark/remove/${id}`)
    },
    // 增加新品牌，不需要id
    // 修改品牌，需要id
    addOrUpdate(trademark) {
        if (trademark.id) {
            // 修改
            return request.put(`/product/baseTrademark/update`, trademark)
        } else {
            return request.post(`/product/baseTrademark/save`, trademark)
        }
    }
}