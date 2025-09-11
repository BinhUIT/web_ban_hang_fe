import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ScrollToTop } from "../components";
import { useEffect, useState } from "react";
import { baseURL } from "../axios/baseURL";
import toast from "react-hot-toast";
import { covertCatsFromServer } from "../utils/convertServerCategoriesToClientCategories";

const HomeLayout = () => {
  const [categories, setCategories] = useState<any>([]);
  useEffect(()=>{
    fetch(baseURL+"/unsecure/category?isParent=true").then(
      response=>{
        response.json().then(data=>{
          setCategories(data);
        })
      }
    ).catch(err=>{
      toast.error("Error from server, please reload page");
    })
  },[]);
  
  return (
    <>
      <ScrollToTop />
      <Header categories={categories?covertCatsFromServer(categories):[]} />
      <Outlet />
      <Footer />
    </>
  );
};
export default HomeLayout;
