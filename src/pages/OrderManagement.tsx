import React, { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
const OrderManagement = () =>{
    const [totalPage, setTotalPage]= useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    function onPageChange(pageNumber:number) {
        
    }
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
                {/*orderHistories.map((order) =>  (
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
                ))*/}
            </tbody>
            </table>
        </div>
        <Pagination totalPages={totalPage} currentPage={currentPage+1} onPageChange={onPageChange}></Pagination>
        </div>

  );
}
export default OrderManagement