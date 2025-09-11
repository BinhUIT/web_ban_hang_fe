import { useNavigate } from "react-router-dom";
import { baseURL } from "../axios/baseURL";
import { getLeafCategory } from "../utils/getLeafCategory";

const CategoryItem = ({
  category,
  clickFunction,
}: {
  category: any;
  clickFunction: Function;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-[600px] h-[400px] max-[1250px]:w-[400px] max-[1250px]:h-[300px] max-sm:w-[300px] max-sm:h-[220px] cursor-pointer group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
      onClick={(e) => {
        e.preventDefault();
        const leaf = getLeafCategory(category);
        let navigateURL = `/shop?catIds=${leaf[0].id}`;

        for (let i = 1; i < leaf.length; i++) {
          navigateURL += `&catIds=${leaf[i].id}`;
        }
        navigate(navigateURL);
      }}
    >
      {/* Image */}
      <img
        src={`${baseURL}/${category.image}`}
        alt={category.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

      {/* Title */}
      <div className="absolute bottom-0 w-full h-16 max-sm:h-12 flex justify-center items-center">
        <h3 className="text-2xl max-sm:text-lg font-semibold text-white drop-shadow-md">
          {category.name}
        </h3>
      </div>

      {/* Button */}
      {category.children.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            clickFunction(category);
          }}
          className="absolute top-3 right-3 bg-white/90 text-secondaryBrown text-sm font-medium px-3 py-1 rounded-lg shadow hover:bg-white transition"
        >
          View more
        </button>
      )}
    </div>
  );
};

export default CategoryItem;
