import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import customFetch from "../axios/custom";
import { formatDate } from "../utils/formatDate";
import Pagination from "../components/Pagination";
import { baseURL } from "../axios/baseURL";

export const loader = async () => {
  try {
    const response = await customFetch.get("/orders");
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};
const OrderHistory = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const orders = useLoaderData() as Order[];
  const [orderHistories, setOrderHistories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  async function fetchOrderHistory(fetchURL:string) {
    const token = localStorage.getItem("token");
    if(!token) {
      toast.error("Please login to view this page");
      localStorage.removeItem("user");
      navigate("/login");
    }
    const response = await fetch(fetchURL,{
      method:"GET",
      headers:{
        "Content-type":"application/json",
        "Authorization":"Bearer " +token
      }
    });
    if(response.status==401) {
      toast.error("You have been logged out, please login again");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
    if(response.status==500) {
      toast.error("Error, please reload page");
      return;
    }
    if(response.ok) {
      const data = await response.json();
      console.log(data);
      setOrderHistories(data.content);
      setCurrentPage(data.page.number);
      setTotalPage(data.page.totalPage);
    }
  }
  async function onPageChange(newPage:number) {
    const fetchURL=`${baseURL}/user/order-history?page=${newPage}&size=4`;
    fetchOrderHistory(fetchURL);
  }
  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to view this page");
      navigate("/login");
    }
    const fetchURL = `${baseURL}/user/order-history?page=${currentPage}&size=4`;
    fetchOrderHistory(fetchURL);

  }, [user, navigate]);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
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
            {orderHistories.map((order) =>  (
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
                    to={`/order-history/${order.id}`}
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
      <Pagination totalPages={totalPage} currentPage={currentPage} onPageChange={onPageChange}></Pagination>
    </div>
  );
};

export default OrderHistory;
