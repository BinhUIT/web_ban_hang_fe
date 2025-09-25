import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryURL, getProductByIdURL, updateProductURL } from "../axios/api_urls";
import { getLeafCategory } from "../utils/getLeafCategory";
import { baseURL } from "../axios/baseURL";
import toast from "react-hot-toast";
import { checkToken } from "../utils/checkToken";
import { onTokenExpire } from "../utils/onTokenExpire";

const UpdateProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({
    categoryId: "",
    name: "",
    shortDesc: "",
    detailDesc: "",
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
   const navigate = useNavigate();
  useEffect(() => {
    // fetch categories
    fetch(getCategoryURL)
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // fetch product by id
    fetch(getProductByIdURL(id?parseInt(id):0))
      .then((res) => res.json())
      .then((product) => {
        setFormData({
          categoryId: product.categoryId,
          name: product.name,
          shortDesc: product.shortDesc,
          detailDesc: product.detailDesc,
          image: null, 
        });
        setPreview(baseURL + "/" + product.image);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token= checkToken();
        if(!token) {
            onTokenExpire(navigate);
            return;
        }
    
    const fData= new FormData();
    const info = {
        name:formData.name,
        shortDesc:formData.shortDesc,
        detailDesc:formData.detailDesc
    };
    fData.append("info", new Blob([JSON.stringify(info)], { type: "application/json" }));
    if(formData.image) {
        fData.append("image",formData.image);
    }
     const response = await fetch(updateProductURL(id?parseInt(id):0),{
        method:"PUT",
        headers:{
            "Authorization":"Bearer "+token
        },
        body:fData
    });
    
    if(response.ok) {
        const data = await response.json();
        console.log(data.data);
        toast.success("Update product sucess");
    } 
    else if(response.status==401) {
        onTokenExpire(navigate)
        return;
    }
    else {
        const data = await response.json();
        toast.error(data.message);
    }
    navigate("/product_detail/"+id);

  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Select category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Short Desc */}
        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <input
            type="text"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Detail Desc */}
        <div>
          <label className="block text-sm font-medium mb-1">Detail Description</label>
          <textarea
            name="detailDesc"
            value={formData.detailDesc}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 h-24"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg mb-3 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
function err(reason: any): PromiseLike<never> {
    throw new Error("Function not implemented.");
}

