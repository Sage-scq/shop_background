/* 
包含spu管理相关接口请求函数
*/
import request from '@/utils/request'

export default {
    /* 
    获取销售属性列表
    GET /product/baseSaleAttrList
    */
    getSaleAttrList() {
        return request.get('/product/baseSaleAttrList')
    },

    /* 
    删除指定的SPU
    DELETE /product/deleteSpu/{spuId}
    */
    remove(spuId) {
        return request.delete(`/product/deleteSpu/${spuId}`)
    },

    /* 
    根据id获取SPU信息
    GET /product/getSpuById/{spuId}
    spuList: 包含多个spu简单信息的数组
    spuInfo: 包含一个spu详细信息的对象
    */
    get(spuId) {
        return request.get(`/product/getSpuById/${spuId}`)
    },

    /* 
    添加SPU详情信息
    POST /product/saveSpuInfo
    POST /product/updateSpuInfo
    */
    addUpdate(spuInfo) {
        // return request.post(`/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
        return request({
            url: `/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
            method: 'POST',
            data: spuInfo
        })
    },

    /* 
    GET /product/{page}/{limit}
      query参数: category3Id
    */
    getList(page, limit, category3Id) {
        // return request.get(`/product/${page}/${limit}`, {params: {category3Id}})

        return request({
            url: `/product/${page}/${limit}`,
            method: 'GET',
            params: { category3Id }
        })
    },

    findSpuInfoByKeyword(keyword) {
        return request({
            url: `/product/findSpuInfoByKeyword/${keyword}`,
            method: 'get'
        })
    }
}