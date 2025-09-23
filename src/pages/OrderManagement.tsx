import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import { checkToken } from "../utils/checkToken";
import { baseURL } from "../axios/baseURL";
import { adminGetOrderURL } from "../axios/api_urls";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { formatDate } from "../utils/formatDate";
const OrderManagement = () =>{
    const [totalPage, setTotalPage]= useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [orders, setOrders] = useState<any[]>([]);
    const navigate = useNavigate();
    function onPageChange(pageNumber:number) {
        
    }
    
    async function fetchOrder() {
        const token = checkToken();
        if(!token) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
            return;
        }
        const url = adminGetOrderURL(20,0);
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
            const data = await response.json();
            setOrders(data.content);
        }
    }
    useEffect(()=>{
        fetchOrder();
    },[])
    return (
        <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <h1 className="text-3xl font-bold mb-8">Order Mangement</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                <th className="py-3 px-4 border-b">Order Code</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) =>  (
                <tr key={order.id}>
                    <td className="py-3 px-4 border-b text-center">{order.code}</td>
                    <td className="py-3 px-4 border-b text-center">{ formatDate(order.createAt) }</td>
                    <td className="py-3 px-4 border-b text-center">
                    {order.total}đ
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                    { order.status }
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                    <Link
                        to={`/order_management/${order.id}`}
                        className="text-blue-500 hover:underline"
                    >
                        View Details
                    </Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <Pagination totalPages={totalPage} currentPage={currentPage+1} onPageChange={onPageChange}></Pagination>
        </div>

  );
}
export default OrderManagement