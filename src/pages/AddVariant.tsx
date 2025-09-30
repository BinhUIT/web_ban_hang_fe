import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../axios/fetchFunction";
import { createVariantURL, getSizeAndColor } from "../axios/api_urls";
import toast from "react-hot-toast";
import { checkToken } from "../utils/checkToken";
import { onTokenExpire } from "../utils/onTokenExpire";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import CircleLoader from "../components/CircleLoader";

const CreateProductVariant: React.FC = () => {
  const { id } = useParams(); // Lấy productId từ URL
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    color: "",
    size: "",
    price: "",
    image: null
  });
  function setSizeAndColor(data:any) {
    setColors(data.listColors);
    setSizes(data.listSizes);
    console.log(data);
  }
  useEffect(()=>{
    fetchData(getSizeAndColor,"", setSizeAndColor);
  },[])

  // Hàm handle input change
  const handleChange = (
    e: any
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm handle file change
  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form,image: e.target.files[0]});
    }
  };

  const handleSubmit =async (e:any) => {
    e.preventDefault();
    if(form.color=="") {
        toast.error("Please select color");
        return;
    } 
    if(form.size=="") {
        toast.error("Please select size");
        return;
    }
    const token = checkToken();
    if(!token) {
        onTokenExpire(navigate);
        return;
    }
    if(!form.image) {
        toast.error("Please choose image");
    }
    const formData = new FormData();
    const info = {
        name:form.name,
        colorId:form.color,
        sizeId:form.size,
        price:form.price
    }
    formData.append("info", new Blob([JSON.stringify(info)], { type: "application/json" }));
    formData.append("image", form.image);
    setIsLoading(true);
    const response = await fetch(createVariantURL(id?parseInt(id):0),{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+token
        },
        body:formData
    });
    
    if(response.ok) {
        setIsLoading(false);
        toast.success("Create variant sucess");
    } 
    else if(response.status==401) {
        setIsLoading(false);
        toast.error("You have been logout, please login again");
        clearLocalStorage();
        navigate("/login");
        return;
    }
    else {
        setIsLoading(false);
        const data = await response.json();
        toast.error(data.message);
    }
    navigate("/product_detail/"+id);
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      {isLoading&&<CircleLoader></CircleLoader>}
      <h2 className="text-2xl font-bold mb-6">Add Product Variant</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block font-medium mb-1">Color *</label>
          <select
            name="color"
            required
            value={form.color}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          >
            <option value="">-- Select Color --</option>
            {
                colors.map((item)=>{
                    return <option key={item.id} value={item.id}>{item.color}</option>
                })
            }
            
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block font-medium mb-1">Size *</label>
          <select
            name="size"
            required
            value={form.size}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          >
            <option value="">-- Select Size --</option>
            {
                sizes.map((item)=>{
                    return <option key={item.id} value= {item.id}>{item.productSize}</option>
                })
            }
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Upload image */}
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {form.image && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {form.image.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            Save Variant
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductVariant;
