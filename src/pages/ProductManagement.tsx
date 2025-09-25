import React, { useEffect, useState } from "react";
import { adminGetProductsURL } from "../axios/api_urls";
import { formatPrice } from "../utils/formatPriceString";
import Pagination from "../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { checkToken } from "../utils/checkToken";
import toast from "react-hot-toast";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { onTokenExpire } from "../utils/onTokenExpire";
const ProductManagement = () =>{
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [listProducts, setListProducts] = useState<any[]>();
    const navigate= useNavigate();
    async function getProducts(currentPage:number) {
        const url = adminGetProductsURL(12,currentPage);
         const token= checkToken();
    if(!token) {
        onTokenExpire(navigate);
        return;
    }
        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+token
            }
        });
        if(response.ok) {
            const data= await response.json();
            setListProducts(data.content);
            setTotalPage(data.page.totalPages);
            setCurrentPage(data.page.number);
            console.log(data);
        }
        else {
            onTokenExpire(navigate);
        return;
        }
    }
    useEffect(()=>{
        getProducts(0);
    },[])
    async function onPageChange(page:number) {
        getProducts(page-1);

    }
    return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold">Product Management</h1>
    <Link
      to="/add_product"
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
    >
      + Add Product
    </Link>
  </div>
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
                <th className="py-3 px-4 border-b">Action</th>
                </tr>
            </thead>
            <tbody>
                {listProducts?.map((item)=>(
                    <tr key={item.id}>
                        <td className="py-3 px-4 border-b text-center">{item.code}</td>
                        <td className="py-3 px-4 border-b text-center">{item.name}</td>
                        <td className="py-3 px-4 border-b text-center">{item.shortDesc}</td> 
                        <td className="py-3 px-4 border-b text-center">{formatPrice(item.maxPrice)}</td> 
                        <td className="py-3 px-4 border-b text-center">{formatPrice(item.minPrice)}</td> 
                        <td className="py-3 px-4 border-b text-center">{item.sold}</td>
                        <td className="py-3 px-4 border-b text-center">
                            {item.quantity}
                        </td>
                        <td className="py-3 px-4 border-b text-center"><Link to={`/product_detail/${item.id}`} className="text-blue-500 hover:underline">View Details</Link></td>

                    </tr>
                )
                    
                )}
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
        <Pagination totalPages={totalPage} currentPage={currentPage+1} onPageChange={onPageChange}></Pagination>
        </div>
    );
}
export default ProductManagement;