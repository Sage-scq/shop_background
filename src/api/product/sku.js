/* 
包含所有sku管理的接口请求函数
*/
import request from '@/utils/request'

export default {
    /* 
    下架SKU
    GET /product/cancelSale/{skuId}
    */
    cancelSale(skuId) {
        return request.get(`/product/cancelSale/${skuId}`)
    },

    /* 
    上架SKU
    GET /product/onSale/{skuId}
    */
    onSale(skuId) {
        return request.get(`/product/onSale/${skuId}`)
    },

    /* 
    删除指定id的sku
    DELETE /product/deleteSku/{skuId}
    */
    remove(skuId) {
        return request.delete(`/product/deleteSku/${skuId}`)
    },

    /* 
    根据指定的SPU的id查询所有对应的SKU的列表
    GET /product/findBySpuId/{spuId}
    */
    getListBySpuId(spuId) {
        return request.get(`/product/findBySpuId/${spuId}`)
    },

    /* 
    根据SKU的id查询SKU的详细信息
    GET /product/getSkuById/{skuId}
    */
    get(skuId) {
        return request.get(`/product/getSkuById/${skuId}`)
    },

    /* 
    获取SKU的分页列表
    GET /product/list/{page}/{limit}
    */
    getList(page, limit) {
        return request.get(`/product/list/${page}/${limit}`)
    },

    /* 
    保存SKU
    POST /product/saveSkuInfo
    POST /product/updateSkuInfo
    */
    addUpdate(skuInfo) {
        return request.post(`/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`, skuInfo)
    },

    /* 
    获取指定SPU的id对应的图片列表
    GET /product/spuImageList/{spuId}
    */
    getSpuImageList(spuId) {
        return request.get(`/product/spuImageList/${spuId}`)
    },

    /* 
    获取指定SPU的id对应的销售属性列表
    GET /product/spuSaleAttrList/{spuId}
    */
    getSpuSaleAttrList(spuId) {
        return request.get(`/product/spuSaleAttrList/${spuId}`)
    }
}