import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";
import CategoryLink from "../utils/categoryLink";
import { Star, StarHalf } from "lucide-react";
import { baseURL } from "../axios/baseURL";

const ProductItem = ({
  id,
  image,
  title,
  category,
  price,
  rating,
  tags
}: {
  id: string;
  image: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  tags: string[]
}) => {
  return (
    <div className="w-full sm:w-[48%] lg:w-[30%] flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <Link
        to={`/product/${id}`}
        className="w-full h-[280px] max-md:h-[200px] overflow-hidden rounded-xl"
      >
        <img
          src={`${baseURL}/${image}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Title */}
      <Link
        to={`/product/${id}`}
        className="w-full text-center h-[3.5em] line-clamp-2 font-medium text-lg text-gray-800 hover:text-secondaryBrown transition-colors"
      >
        <h2>{title}</h2>
      </Link>

      {/* Category */}
      <p className="text-gray-500 text-sm text-center uppercase tracking-wide">
        
          <CategoryLink categoryName={category[0]}/> {"/"}
          <CategoryLink categoryName={category[1]}/>
        
      </p> 
      {tags && tags.length > 0 && (
  <div className="flex flex-wrap justify-center gap-2 mt-1">
    {tags.map((tag) => (
      <span
        key={tag}
        className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-secondaryBrown hover:text-white transition-colors"
      >
        {tag}
      </span>
    ))}
  </div>
)}

      {/* Price */}
      <p className="text-secondaryBrown text-2xl text-center font-bold max-md:text-xl">
        {price}
      </p>

      {/* Rating */}
      <div className="flex justify-center items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const fullStars = Math.floor(rating);
          const hasHalf = rating - fullStars >= 0.5;

          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="w-5 h-5 text-yellow-500 fill-yellow-500"
              />
            );
          } else if (index === fullStars && hasHalf) {
            return (
              <StarHalf
                key={index}
                className="w-5 h-5 text-yellow-500 fill-yellow-500"
              />
            );
          } else {
            return (
              <Star key={index} className="w-5 h-5 text-gray-300" />
            );
          }
        })}
        <span className="ml-1 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <Link
          to={`/product/${id}`}
          className="text-white bg-secondaryBrown text-center text-base font-medium rounded-xl shadow hover:opacity-90 transition-all py-2"
        >
          View Product
        </Link>
        <Link
          to={`/product/${id}`}
          className="bg-white text-gray-800 text-center text-base border rounded-xl py-2 hover:bg-gray-50 transition-all"
        >
          Similar Products
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
