import { useEffect, useState } from "react";
import { fetchData } from "../axios/fetchFunction";
import { createProdutURL, getCategoryURL } from "../axios/api_urls";
import toast from "react-hot-toast";
import { checkToken } from "../utils/checkToken";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import { onTokenExpire } from "../utils/onTokenExpire";
import CircleLoader from "../components/CircleLoader";

export default function AddProduct() {
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    shortDesc: "",
    detailDesc: "",
    image: null,
  });
  const navigate = useNavigate();
  function setCat(data:any) {
    const res = [];
    for(let i=0;i<data.length;i++) {
        if(data[i].children) {
            for(let j=0;j<data[i].children.length;j++) {
                res.push(data[j].children[j]);
            } 
    }
    }
   console.log(data);
   setCategories(res);
  }
  const [isLoading, setIsLoading]= useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(()=>{
    fetchData(getCategoryURL,"",setCat);
  },[])

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e:any) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit =async (e:any) => {
    const token= checkToken();
    if(!token) {
        await onTokenExpire(navigate);
        return;
    }
    e.preventDefault();
    console.log("Form submit:", form);
    if(form.categoryId=="") {
        toast.error("Please choose category for product");
        return;
    }
    const info = {
        categoryId:form.categoryId,
        name:form.name,
        shortDesc:form.shortDesc,
        detailDesc:form.detailDesc
    }
    if(!form.image) {
        toast.error("Please select image");
        return;
    }
    const formData = new FormData();
    formData.append("info", new Blob([JSON.stringify(info)], { type: "application/json" }));
    formData.append("image", form.image);
    let response;
    try {
      setIsLoading(true);
    response = await fetch(createProdutURL,{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+token
        },
        body:formData
    });
    setIsLoading(false);
    if(response.ok) {
        toast.success("Create product sucess");
        const data= await response.json();
        navigate("product_detail/"+data.data.id);
    } }
    catch(err) {
      setIsLoading(false);
      if(response?.status==401) {
          toast.error("You have been logout, please login again");
          clearLocalStorage();
          
          navigate("/login");
          return;
      }
      else {
          const data = await response?.json();
          toast.error(data.message);
      }
      navigate("/product_management");
  }
  };

  return (
    <div className="max-w-screen-md mx-auto pt-20 px-5">
    {isLoading&&<CircleLoader></CircleLoader>}
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 border border-gray-200">
        {/* Category */}
        <div>
          <label className="block font-semibold mb-2">Category <span className="text-red-500">*</span></label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">-- Select Category --</option>
            {
                categories.map(item=>{
                    return <option key={"Cat"+item.id} value={item.id}>{item.name}</option>
                })
            }
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-semibold mb-2">Short Description</label>
          <input
            type="text"
            name="shortDesc"
            value={form.shortDesc}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter short description"
            required
          />
        </div>

        {/* Detail Description */}
        <div>
          <label className="block font-semibold mb-2">Detail Description</label>
          <textarea
            name="detailDesc"
            value={form.detailDesc}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter detailed description"
            required
          />
        </div>

        {/* Upload Image */}
        <div>
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-600
              hover:file:bg-blue-100"
          />
          {form.image && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(form.image)}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
