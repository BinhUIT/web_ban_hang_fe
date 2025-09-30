import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { checkToken } from "../utils/checkToken";
import toast from "react-hot-toast";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { adminCancelOrderURL, adminGetOneOrderURL, adminShipOrderURL } from "../axios/api_urls";
import { formatPrice } from "../utils/formatPriceString";
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
  <h1 className="text-3xl font-bold mb-8 text-gray-800">Order Details</h1>

  <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
    {/* Order Info */}
    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
      Order Code: <span className="text-indigo-600">{order?.code}</span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
      <p>Date: <span className="font-medium">{formatDate(order?.createAt)}</span></p>
      <p>Origin Price: <span className="font-medium">{formatPrice(order?.originPrice)}</span></p>
      <p>Discount: <span className="font-medium text-red-500">{formatPrice(order?.discount)}</span></p>
      <p>Subtotal: <span className="font-medium">{formatPrice(order?.total - order?.shipping_fee)}</span></p>
      <p>Payment type: <span className="font-medium">{order?.payment?.paymentType}</span></p>
      <p>Shipping: <span className="font-medium">{formatPrice(order?.shipping_fee)}</span></p>
      <p>Payment code: <span className="font-medium">{order?.payment?.code}</span></p>
      <p>Address: <span className="font-medium">{order?.address}</span></p>
      <p>Phone: <span className="font-medium">{order?.phone}</span></p>
      <p>Total: <span className="font-bold text-indigo-600">{formatPrice(order?.total)}</span></p>
      <p>Status: 
        <span className={`ml-2 px-2 py-1 rounded-lg text-sm font-semibold 
          ${order?.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
            order?.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
            "bg-gray-100 text-gray-700"}`}>
          {order?.status}
        </span>
      </p>
    </div>

    {/* Buttons */}
    {order && order.status === "PENDING" && (
      <div className="mt-6 flex gap-4">
        <button
          onClick={onCancelOrder}
          className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={onBillOfLanding}
          className="px-5 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition"
        >
          Ship to user
        </button>
      </div>
    )}

    {/* Items */}
    <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Items</h3>
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Product Name</th>
            <th className="py-3 px-4 text-center">Quantity</th>
            <th className="py-3 px-4 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order?.orderItems.map((item: any, idx: number) => (
            <tr
              key={nanoid()}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-3 px-4">{item?.productVariant.name}</td>
              <td className="py-3 px-4 text-center">{item?.amount}</td>
              <td className="py-3 px-4 text-right">{item?.totalPrice} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
);
    
}
export default SingleOrderManagement;