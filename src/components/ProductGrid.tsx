import React from "react";
import { Suspense,lazy } from "react";
import ProductItem from "./ProductItem";

import { formatPrice } from "../utils/formatPriceString";

const ProductGrid = ({ products }: { products?: object[] }) => {
  
  return (
    <div
      id="gridTop"
      className="max-w-screen-2xl flex flex-wrap justify-between items-center gap-y-8 mx-auto mt-12 max-xl:justify-start max-xl:gap-5 px-5 max-[400px]:px-3"
    >
      {products &&
        products.map(item=>{
          return <Suspense fallback={<p>Loading...</p>}  key={item?.id}><ProductItem 
          id={item?.id}
          title={item?.name} 
          price={formatPrice(item?.minPrice)} 
          rating={item?.rating}
          image={item?.image} 
          category={item?.categories}/> </Suspense>
        })
        }
    </div>
  );
};
// Memoize the component to prevent unnecessary re-renders because of React.cloneElement
export default React.memo(ProductGrid);
