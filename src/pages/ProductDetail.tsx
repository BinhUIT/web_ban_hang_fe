import React, { useEffect, useState } from "react";
import { baseURL } from "../axios/baseURL";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByIdURL } from "../axios/api_urls";
import toast from "react-hot-toast";

export default function ProductDetail() {
    const [product, setProduct] = useState<any>(null);
    const {id} = useParams();
    const navigate = useNavigate();
    async function getProduct() {
        const url = getProductByIdURL(parseInt(id?id:"0"));
        const response = await fetch(url);
        const contentLength=response.headers.get("content-length");
        
        if(response.status==404) {
            toast.error("Product does not exist");
            navigate("/order_management");
            return;
        }
        const data= await response.json();
       setProduct(data);
        
    }
    useEffect(()=>{
        getProduct();
    },[])
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* Thông tin sản phẩm */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ảnh sản phẩm */}
        <div className="flex-shrink-0">
          <img
            src={baseURL+"/"+product?.image}
            alt={product?.name}
            className="w-64 h-64 object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">{product?.name}</h2>
          <p className="text-gray-600 mb-3">{product?.shortDesc}</p>
          <p className="text-sm text-gray-500 mb-4">{product?.detailDesc}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold">Code:</span> {product?.code}
            </div>
            <div>
              <span className="font-semibold">Rating:</span> ⭐ {product?.rating}
            </div>
            <div>
              <span className="font-semibold">Min Price:</span>{" "}
              {product?.minPrice.toLocaleString("vi-VN")}đ
            </div>
            <div>
              <span className="font-semibold">Max Price:</span>{" "}
              {product?.maxPrice.toLocaleString("vi-VN")}đ
            </div>
            <div>
              <span className="font-semibold">Quantity:</span>{" "}
              {product?.quantity}
            </div>
            <div>
              <span className="font-semibold">Sold:</span> {product?.sold}
            </div>
            <div>
              <span className="font-semibold">Categories:</span>{" "}
              {product?.categories.join(", ")}
            </div>
            <div>
              <span className="font-semibold">Tags:</span>{" "}
              {product?.tags.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách biến thể */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Product Variants</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Color</th>
              <th className="p-3">Size</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {product?.productVariants?.map((v:any) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">
                  <img
                    src={baseURL+"/"+v.image}
                    alt={v.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="p-3">{v.code}</td>
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.productColor.color}</td>
                <td className="p-3">{v.productSize.productSize}</td>
                <td className="p-3">
                  {v.price.toLocaleString("vi-VN")}đ
                </td>
                <td className="p-3">{v.quantity}</td>
                <td
                  className={`p-3 font-semibold ${
                    v.status === "ENABLE" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {v.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
