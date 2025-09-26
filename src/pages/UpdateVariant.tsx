import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../axios/baseURL";
import { getVariantURL, updateVariantURL } from "../axios/api_urls";
import toast from "react-hot-toast";
import { checkToken } from "../utils/checkToken";
import { onTokenExpire } from "../utils/onTokenExpire";

export default function UpdateVariant() {
  const { id } = useParams(); // id của variant
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [preview, setPreview] = useState<string | null>(null); // ảnh hiển thị
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  // Giả sử fetch dữ liệu variant hiện tại
  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const res = await fetch(getVariantURL(id?parseInt(id):0));
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.data.name || "",
            price: data.data.price || "",
            quantity: data.data.quantity || "",
          });
          setPreview(data.data.image ? `${baseURL}/${data.data.image}` : null);
        
        }
        else {
            toast.error("Variant not found");
            navigate("product_management");
            return;
        }
      } catch (err) {
        
        navigate("product_management");
      }
    };
    fetchVariant();
  }, [id]);

  // onChange input text/number
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // onChange file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = checkToken();
    if(!token) {
        onTokenExpire(navigate);
    }
    const formData = new FormData();
    const putData = {
        name:form.name,
        price:form.price,
        quantity:form.quantity
    }
    formData.append("info",new Blob([JSON.stringify(putData)], { type: "application/json" }));
    if (file) {
      formData.append("image", file);
    }

    const res = await fetch(updateVariantURL(id?parseInt(id):0), {
      method: "PUT",
      headers:{
        "Authorization":"Bearer "+token
      },
      body: formData,
    });

    if (res.ok) {
      toast.success("Update variant success");
      navigate("/product_management");
    } else {
      if(res.status==401) {
        onTokenExpire(navigate);
        return;
      } 
      else {
        const data= await res.json();
        toast.error(data.message);
        navigate("/product_management");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Update Variant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Upload image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          {preview && (
            <img
              src={preview}
              alt="variant"
              className="w-32 h-32 object-cover rounded-lg mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Update
        </button>
      </form>
    </div>
  );
}
