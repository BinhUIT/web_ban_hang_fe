import React from "react";
const ProductManagement = () =>{
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <h1 className="text-3xl font-bold mb-8">Order Mangement</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                <th className="py-3 px-4 border-b">Product Code</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Short Description</th>
                <th className="py-3 px-4 border-b">Max Price</th>
                <th className="py-3 px-4 border-b">Min Price</th>
                <th className="py-3 px-4 border-b">Sold</th> 
                <th className="py-3 px-4 border-b">Quantity</th>
                </tr>
            </thead>
            <tbody>
                {/*orders.map((order) =>  (
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
                ))*/}
            </tbody>
            </table>
        </div>
        {/*<Pagination totalPages={totalPage} currentPage={currentPage+1} onPageChange={onPageChange}></Pagination>*/}
        </div>
}
export default ProductManagement;