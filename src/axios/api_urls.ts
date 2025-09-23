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
    return `${baseURL}/unsecure/all_enable_products?page=${num}&size=${size}`;
}
export const getProductByIdURL= (id:number) =>{
    return `${baseURL}/unsecure/product/${id}`;
}