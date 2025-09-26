import { baseURL } from "./baseURL"

export const adminGetOrderURL= (size:number, page:number)=>{
    return `${baseURL}/admin/get_orders?size=${size}&page=${page}`;
}
export const adminGetOneOrderURL = (id:number) =>{
    return `${baseURL}/admin/get_order/${id}`;
}
export const adminCancelOrderURL = (id:number)=>{
    return `${baseURL}/admin/cancel_order/${id}`;
}
export const adminShipOrderURL = (id:number) =>{
    return `${baseURL}/admin/ship_order/${id}`;
}
export const userConfirmReceiveURL = (id:number) => {
    return `${baseURL}/user/received_order/${id}`;
}
export const adminGetUserURL = (size:number, num:number) =>{
    return `${baseURL}/admin/all_user?size=${size}&number=${num}`;
}
export const adminGetProductsURL = (size:number, num:number) => {
    return `${baseURL}/admin/all_product?page=${num}&size=${size}`;
}
export const getProductByIdURL= (id:number) =>{
    return `${baseURL}/unsecure/product/${id}`;
}
export const getCategoryURL = `${baseURL}/unsecure/category`;
export const createProdutURL = `${baseURL}/admin/create_product`;
export const getSizeAndColor = `${baseURL}/unsecure/sizes_colors`;
export const createVariantURL =(id:number) => `${baseURL}/admin/add_variant/${id}`;
export const updateProductURL = (id:number)=>`${baseURL}/admin/update_product/${id}`;
export const getVariantURL = (id:number)=>`${baseURL}/unsecure/find_variant/${id}`;
export const updateVariantURL = (id:number)=>`${baseURL}/admin/update_product_variant/${id}`;
export const deleteProductURL = (id:number)=>`${baseURL}/admin/delete_product/${id}`;
export const deleteProductVariantURL = (id:number)=>`${baseURL}/admin/delete_product_variant/${id}`;