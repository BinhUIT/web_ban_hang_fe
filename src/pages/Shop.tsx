import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ShopBanner, ShopPageContent } from "../components";
import { baseURL } from "../axios/baseURL";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const shopCategoryLoader = async ({ params }: LoaderFunctionArgs) => {
  const { category } = params;

  return category;
};

const Shop = () => {
  const category = useLoaderData() as string;
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    fetch(baseURL+"/unsecure/category?isParent=true").then(response=>{
      response.json().then(data=>{
        console.log("Cat data",data);
        setCategories(data);
      }).catch(err=>{
      toast.error("Error from server, please reload page");
    })

    }).catch(err=>{
      toast.error("Error from server, please reload page");
    })
  },[])
  return (
  
    <div className="max-w-screen-2xl mx-auto pt-10">
       {searchParams.get("keyword")&&<div className="absolute top-0 right-0 mt-2 mr-2">
    
  </div>}
      <ShopPageContent
        categories={categories}
        page={parseInt(searchParams.get("page") || "1")} 
        key={location.pathname + location.search}
      />
    </div>
  );
};
export default Shop;
