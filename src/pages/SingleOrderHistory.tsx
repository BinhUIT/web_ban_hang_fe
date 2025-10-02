import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";
import customFetch from "../axios/custom";
import { nanoid } from "nanoid";
import { formatDate } from "../utils/formatDate";
import { baseURL } from "../axios/baseURL";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Button from "../components/Button";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { userConfirmReceiveURL } from "../axios/api_urls";
import CircleLoader from "../components/CircleLoader";
import { onTokenExpire } from "../utils/onTokenExpire";
import { checkToken } from "../utils/checkToken";
import { formatPrice } from "../utils/formatPriceString";


const SingleOrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const {id} = useParams();
  const [order, setOrder] = useState<any>(null);
  
  
  
  async function cancelOrder() {
    const token = checkToken();
    
    if(!token) {
      await onTokenExpire(navigate);
      return;
    }
    const response =await fetch(`${baseURL}/user/cancel-order/${id}`,{
      method:"PUT",
      headers:{
        "Content-type":"application/json",
        "Authorization":"Bearer "+token
      }
    });
    if(response.status==404){
      toast.error("Order not found");
    }
    if(response.status==400){
      toast.error("You can not cancel this order");
      
    }
    if(response.status==500) {
      toast.error("Server error, please reload page");
    }
    if(response.status==401) {
      toast.error("You have been logged out, please login again");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
    if(response.ok) {
      toast.success("Order canceled");
      fetchOrderById();
    }
    
  }
  function onClickCancel() {
    MySwal.fire({
      title:"Are you sure?",
      text:"You can not undo this action",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result)=>{
      if(result.isConfirmed) {
        cancelOrder();
      }
    })
  }
  async function confirmReceivedOrder() {
    const token = checkToken();
    if(!token) {
      await onTokenExpire(navigate);
      return;
    }
    const url = userConfirmReceiveURL(id?parseInt(id):-1);
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
            toast.success("You received order");
            navigate("/order-history/"+id);
          }
  }
  async function fetchOrderById() {
    const token = checkToken();
    if(!id) {
      return;
    }
    if(!token) {
      await onTokenExpire(navigate);
      return;
    }
    const url = `${baseURL}/user/order-by-id/${id}`;
    setIsLoading(true);
    const response = await fetch(url,{
      method:"GET",
      headers:{
        "Content-type":"application/json",
        "Authorization":"Bearer "+token
      }
    });
    setIsLoading(false);
    if(response.status==404){
      toast.error("Order not found");
    }
    if(response.status==400){
      toast.error("This is not your order");
      navigate("/");
    }
    if(response.status==500) {
      toast.error("Server error, please reload page");
    }
    if(response.status==401) {
      toast.error("You have been logged out, please login again");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
    if(response.ok) {
      const data = await response.json();
      setOrder(data.data);
      console.log(data);
    }

  }
  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to view this page");

      navigate("/login");
    }
    fetchOrderById();
  }, [user, navigate,id]);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
  {isLoading && <CircleLoader />}

  <h1 className="text-3xl font-bold mb-8 text-gray-800">Order Details</h1>

  <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
    {/* Order Info */}
    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
      Order Code: <span className="text-indigo-600">{order?.code}</span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-gray-700">
      <p>Date: <span className="font-medium">{formatDate(order?.createAt)}</span></p>
      <p>Origin Price: <span className="font-medium">{formatPrice(order?.originPrice)}</span></p>
      <p>Discount: <span className="font-medium text-red-500">{formatPrice(order?.discount)}</span></p>
      <p>Subtotal: <span className="font-medium">{formatPrice(order?.total - order?.shipping_fee)}</span></p>
      <p>Shipping: <span className="font-medium">{formatPrice(order?.shipping_fee)}</span></p>
      <p>Total: <span className="font-bold text-indigo-600">{formatPrice(order?.total)}</span></p>
      <p>
        Status:{" "}
        <span
          className={`ml-2 px-3 py-1 rounded-lg text-sm font-semibold
          ${order?.status === "PENDING"
            ? "bg-yellow-100 text-yellow-700"
            : order?.status === "SHIPPING"
            ? "bg-blue-100 text-blue-700"
            : order?.status === "COMPLETED"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700"}`}
        >
          {order?.status}
        </span>
      </p>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 flex gap-4">
      {order && order.status === "PENDING" && (
        <button
          onClick={onClickCancel}
          className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
        >
          Cancel
        </button>
      )}
      {order && order.status === "SHIPPING" && (
        <button
          onClick={confirmReceivedOrder}
          className="px-5 py-2 rounded-xl bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
        >
          Received Order
        </button>
      )}
    </div>

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
};

export default SingleOrderHistory;
