import React, { useEffect, useState } from "react";
import { adminGetProductsURL, deleteProductURL } from "../axios/api_urls";
import { formatPrice } from "../utils/formatPriceString";
import Pagination from "../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { checkToken } from "../utils/checkToken";
import toast from "react-hot-toast";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { onTokenExpire } from "../utils/onTokenExpire";
import Swal from "sweetalert2";
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
    async function deleteProduct(id:number) {
        const token = checkToken();
        if(!token) {
            onTokenExpire(navigate);
            return;
        }
        const response = await fetch(deleteProductURL(id),{
            method:"DELETE",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+token
            }
        });
        if(response.ok) {
            toast.success("Deleted product");
            setTimeout(() => {
  navigate(0);  // hoặc window.location.reload()
}, 1500);
            
            return;
        } 
        else {
            if(response.status==401) {
                onTokenExpire(navigate);
                return;
            }
            const data= await response.json();
            toast.error(data.message);
            return;
        }
    }
    async function handleDelete(id:number) {
        const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });
  if(result.isConfirmed) {
    deleteProduct(id);
  }
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
        {listProducts?.map((item) => (
          <tr key={item.id}>
            <td className="py-3 px-4 border-b text-center">{item.code}</td>
            <td className="py-3 px-4 border-b text-center">{item.name}</td>
            <td className="py-3 px-4 border-b text-center">{item.shortDesc}</td>
            <td className="py-3 px-4 border-b text-center">
              {formatPrice(item.maxPrice)}
            </td>
            <td className="py-3 px-4 border-b text-center">
              {formatPrice(item.minPrice)}
            </td>
            <td className="py-3 px-4 border-b text-center">{item.sold}</td>
            <td className="py-3 px-4 border-b text-center">{item.quantity}</td>
            <td className="py-3 px-4 border-b text-center space-x-2">
              <Link
                to={`/product_detail/${item.id}`}
                className="text-blue-500 hover:underline"
              >
                View
              </Link>
              <Link
                to={`/update_product/${item.id}`}
                className="text-green-600 hover:underline"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <Pagination
    totalPages={totalPage}
    currentPage={currentPage + 1}
    onPageChange={onPageChange}
  />
</div>

    );
}
export default ProductManagement;