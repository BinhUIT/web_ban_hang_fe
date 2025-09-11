import ProductGrid from "./ProductGrid";
import ProductGridWrapper from "./ProductGridWrapper";

const HomeCollectionSection = ({listProduct,title}:{listProduct:object[],title:string}) => {
  console.log(listProduct);
  return (
    <div>
      <div className="max-w-screen-2xl flex items-center justify-between mx-auto mt-24 px-5 max-[400px]:px-3">
        <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl">
          {title}
        </h2>
      </div>
      
        <ProductGrid products={listProduct} />
      
    </div>
  );
};
export default HomeCollectionSection;
