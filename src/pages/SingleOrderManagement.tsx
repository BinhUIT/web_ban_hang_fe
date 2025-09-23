import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { checkToken } from "../utils/checkToken";
import toast from "react-hot-toast";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { adminCancelOrderURL, adminGetOneOrderURL, adminShipOrderURL } from "../axios/api_urls";
const SingleOrderManagement = ()=>{
  const [order, setOrder] = useState<any>(null);
  const {id} = useParams();
  const navigate = useNavigate();
  async function getOrder() {
     const token = checkToken();
        if(!token) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
        }
      const url = adminGetOneOrderURL(id?parseInt(id):-1);
            const response = await fetch(url,{
               method:"GET",
               headers:{
                   "Content-type":"application/json",
                   "Authorization":`Bearer ${token}`
               }
           });
          if(response.status==401) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
          }
          if(response.ok) {
            const data= await response.json();
            setOrder(data);
          }
  }
  async function onCancelOrder() {
    const token = checkToken();
        if(!token) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
        }
    const url = adminCancelOrderURL(id?parseInt(id):-1);
   
            const response = await fetch(url,{
               method:"PUT",
               headers:{
                   "Content-type":"application/json",
                   "Authorization":`Bearer ${token}`
               }
           });
          if(response.status==401) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
          }
          if(response.ok) {
            toast.success("Cancel order success");
            navigate("/order_management/"+id);
          }

  }
  async function onBillOfLanding() {
    const token = checkToken();
        if(!token) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
        }
      const url = adminShipOrderURL(id?parseInt(id):-1);
      const response = await fetch(url,{
               method:"PUT",
               headers:{
                   "Content-type":"application/json",
                   "Authorization":`Bearer ${token}`
               }
           });
          if(response.status==401) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
          }
          if(response.ok) {
            toast.success("Ship order success");
            navigate("/order_management/"+id);
          }
  }
  useEffect(()=>{
    getOrder();
  },[])
    return (
        <div className="max-w-screen-2xl mx-auto pt-20 px-5">
          <h1 className="text-3xl font-bold mb-8">Order Details</h1>
          <div className="bg-white border border-gray-200 p-5 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Order Code: {order?.code}
            </h2>
            <p className="mb-2">Date: {formatDate(order?.createAt)}</p>
            <p className="mb-2">Origin Price: {(order?.originPrice)} đ</p>
            <p className="mb-2">Discount: {(order?.discount)} đ</p>
            <p className="mb-2">Subtotal: {(order?.total-order?.shipping_fee) }đ</p>
            <p className="mb-2">Payment type: {order?.payment?.paymentType}</p>
            <p className="mb-2">Shipping: {order?.shipping_fee} đ</p>
           
           
            <p className="mb-2">
              Total: {order?.total}đ
            </p>
            
            <p className="mb-2">Status: {order?.status}</p>
            {order&&order.status=="PENDING"&&<button onClick={onCancelOrder} className="px-4 py-2 rounded-lg bg-[#7d7668] text-white font-semibold hover:opacity-90 transition">Cancel</button>}
            {order&&order.status=="PENDING"&&<button onClick={onBillOfLanding} className="px-4 py-2 rounded-lg bg-[#7d7668] text-white font-semibold hover:opacity-90 transition">Bill of Landing</button> }
            <br></br>
            <br></br>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Items</h3>
            <table className="singleOrder-table min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b">Product Name</th>
                  <th className="py-3 px-4 border-b">Quantity</th>
                  <th className="py-3 px-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItems.map((item:any) => (
                  <tr key={nanoid()}>
                    <td className="py-3 px-4 border-b">{item?.productVariant.name}</td>
                    <td className="py-3 px-4 border-b text-center">
                      {item?.amount}
                    </td>
                    <td className="py-3 px-4 border-b text-right">
                      {item?.totalPrice}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    
}
export default SingleOrderManagement;