import { useEffect, useState } from "react";
import {
  Button,
  HomeCollectionSection,
  ProductGrid,
  ProductGridWrapper,
  ShowingSearchPagination,
} from "../components";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import fetchFromServer from "../utils/fetchFunction";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [topSold, setTopSold] = useState([]);
  const [topRating, setTopRating] = useState([]);
  const [keyword, setKeyword] = useState<string>("");
  const navigate= useNavigate();
  useEffect(()=>{
    fetchFromServer("/unsecure/all_enable_products?page=0&size=6&sortCriteria=sold&order=desc",setTopSold);
    fetchFromServer("/unsecure/all_enable_products?page=0&size=6&sortCriteria=rating&order=desc",setTopRating);
  },[])

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Form
       
        className="flex items-center mt-24 px-5 max-[400px]:px-3" 
        onSubmit={(e)=>{
          e.preventDefault();
          navigate(`/shop?keyword=${keyword}`)
        }}
      >
        <input
          type="text"
          placeholder="Search products"
          className="border border-gray-300 focus:border-gray-400 h-12 text-xl px-3 w-full outline-none max-sm:text-lg"
          name="searchInput"
          onChange={e=>{
            e.preventDefault();
            setKeyword(e.target.value);
          }} 
          value={keyword}
        />
        <div className="w-52 max-sm:w-40">
          <Button mode="brown" text="Search" type="submit" />
        </div>
      </Form>
      <div>
         <HomeCollectionSection listProduct={topSold?topSold:[]} title="Best Seller" /> 
      <HomeCollectionSection listProduct={topRating?topRating:[]} title="Best Rating"/> 
      </div>
     
    </div>
  );
};
export default Search;
