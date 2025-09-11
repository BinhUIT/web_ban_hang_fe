import { useEffect, useState } from "react";
import { Banner, CategoriesSection, HomeCollectionSection, ShopBanner } from "../components";
import { baseURL } from "../axios/baseURL";
import toast from "react-hot-toast";
import fetchFromServer from "../utils/fetchFunction";
import { covertCatsFromServer } from "../utils/convertServerCategoriesToClientCategories";

const Landing = () => {
  const [topSold, setTopSold] = useState([]);
  const [topRating, setTopRating] = useState([]);
  

  
  useEffect(()=>{
    fetchFromServer("/unsecure/all_enable_products?page=0&size=6&sortCriteria=sold&order=desc",setTopSold);
    fetchFromServer("/unsecure/all_enable_products?page=0&size=6&sortCriteria=rating&order=desc",setTopRating);
    
  },[])
  return (
    <>
    
      <Banner />
      
      <HomeCollectionSection listProduct={topSold?topSold:[]} title="Best Seller" /> 
      <HomeCollectionSection listProduct={topRating?topRating:[]} title="Best Rating"/> 
      <CategoriesSection />
      
    </>
  );
};
export default Landing;
