import { formatCategoryName } from "../utils/formatCategoryName";
interface SubCategory {
  name: string;
  url: string;
}

interface Category {
  title: string;
  items: SubCategory[];
  url: string;
}
const ShopBanner = ({ categories }: { categories: Category[] }) => {
  console.log("Cat Datas", categories);
  return (
    <div className="bg-white border-t border-b border-gray-200 py-8">
  <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6">
    {categories.map((cat, idx) => (
      <div key={idx}>
        {/* Tiêu đề category */}
        <h3 className="text-lg font-semibold tracking-wide uppercase text-gray-900 mb-4 relative inline-block">
          {cat.title}
          <span className="absolute left-0 -bottom-1 w-8 h-0.5 bg-orange-400"></span>
        </h3>

        {/* Danh sách sub-categories */}
        <ul className="space-y-2">
          {cat.items.map((sub, i) => (
            <li key={i}>
              <a
                href={sub.url}
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm"
              >
                {sub.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>

  );
};
export default ShopBanner;
