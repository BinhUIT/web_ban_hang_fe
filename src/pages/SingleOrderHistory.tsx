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


const SingleOrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const navigate = useNavigate();
  
  const MySwal = withReactContent(Swal);
  const {id} = useParams();
  const [order, setOrder] = useState<any>(null);
  async function onClickCheckout() {
    const tokenExpireAt = localStorage.getItem("token_expire_at");
    const token = localStorage.getItem("token");
    if(!tokenExpireAt||!token) {
      toast.error("Please login again");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
    const expireTime = new Date(tokenExpireAt?tokenExpireAt:""); 
    const now = new Date();
    if(expireTime<=now) {
      toast.error("Please login again");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
    const response = await fetch(baseURL+"/user/confirm_checkout/"+id,{
      method:"POST",
      headers:{
        "Content-type":"application/json",
        "Authorization":"Bearer "+token
      }
    });
    if(response.status==404||response.status==400||response.status==500) {
      toast.error("Error, please try again");
    } 
    if(response.status==401) {
      toast.error("Please login again");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
    if(response.ok) {
      const paymentLink = await response.text();
      window.location.replace(paymentLink);
    }
  }
  async function cancelOrder() {
    const token = localStorage.getItem("token");
    
    if(!token) {
      localStorage.removeItem("user");
      toast.error("Please login to view this page");
      navigate("/login");
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
  async function fetchOrderById() {
    const token = localStorage.getItem("token");
    if(!id) {
      return;
    }
    if(!token) {
      localStorage.removeItem("user");
      toast.error("Please login to view this page");
      navigate("/login");
    }
    const url = `${baseURL}/user/order-by-id/${id}`;
    const response = await fetch(url,{
      method:"GET",
      headers:{
        "Content-type":"application/json",
        "Authorization":"Bearer "+token
      }
    });
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
      setOrder(data);
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
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <div className="bg-white border border-gray-200 p-5 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Order Code: {order?.code}
        </h2>
        <p className="mb-2">Date: {formatDate(order?.createAt)}</p>
        <p className="mb-2">Subtotal: {(order?.total-order?.shipping_fee) }đ</p>
        <p className="mb-2">Shipping: {order?.shipping_fee} đ</p>
       
        <p className="mb-2">
          Total: {order?.total}đ
        </p>
        
        <p className="mb-2">Status: {order?.status}</p>
        {order&&order.status=="PENDING"&&<button onClick={onClickCancel} className="px-4 py-2 rounded-lg bg-[#7d7668] text-white font-semibold hover:opacity-90 transition">Cancel</button>}
        <br></br>
        <br></br>
        {order&&!order.isPaid&&<button className="px-4 py-2 rounded-lg bg-[#7d7668] text-white font-semibold hover:opacity-90 transition" onClick={onClickCheckout}>Online Check out</button>}
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
};

export default SingleOrderHistory;
