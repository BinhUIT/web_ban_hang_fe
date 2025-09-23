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