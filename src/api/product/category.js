import request from '@/utils/request'
export default {
    // 获取分类列表
    getCategory1() {
        return request.get('/product/getCategory1')
    },
    getCategory2(category1Id) {
        return request.get(`/product/getCategory2/${category1Id}`)
    },
    getCategory3(category2Id) {
        return request.get(`/product/getCategory3/${category2Id}`)
    },
}