import {
  Button,
  Dropdown,
  QuantityInput,
  StandardSelectInput,
} from "../components";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { useAppDispatch } from "../hooks";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";

import toast from "react-hot-toast";
import { baseURL } from "../axios/baseURL";
import { formatCategoryName } from "../utils/formatCategoryName";

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<any>({});
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [currentPrice, setCurrentPrice] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [colorMap, setColorMap] = useState(new Map());
  const [currentVariant, setCurrentVariant] = useState({
    color: "",
    size: "",
  });

  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  function findProductVariant(product: any, color: string, size: string) {
    for (let pv of product.productVariants) {
      if (
        pv.productColor.color == color &&
        pv.productSize.productSize == size
      ) {
        return pv;
      }
    }
    return null;
  }

  function joinProductColor(product: any) {
    const colorMap = new Map();
    for (let pv of product.productVariants) {
      if (!colorMap.get(pv.productColor.color)) {
        colorMap.set(pv.productColor.color, []);
      }
      colorMap.get(pv.productColor.color).push(pv);
    }
    return colorMap;
  }

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const response = await fetch(`${baseURL}/unsecure/product/${params.id}`);
      const data = await response.json();
      setSingleProduct(data);
      setCurrentPrice(`${data?.minPrice}đ - ${data?.maxPrice}đ`);
      setCurrentQuantity(data.quantity);
      setCurrentImage(data.image);
      setColorMap(joinProductColor(data));
    };

    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  const handleAddToCart = () => {
    if (singleProduct) {
      dispatch(
        addProductToTheCart({
          id: singleProduct.id + size + color,
          image: singleProduct.image,
          title: singleProduct.title,
          category: singleProduct.category,
          price: singleProduct.price,
          quantity,
          size,
          color,
          popularity: singleProduct.popularity,
          stock: singleProduct.stock,
        })
      );
      toast.success("Product added to the cart");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-5 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md border rounded-2xl overflow-hidden shadow-sm">
            <img
              src={`${baseURL}/${currentImage}`}
              alt={singleProduct?.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Title + Category */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {singleProduct?.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {formatCategoryName(singleProduct?.categories || "")}
            </p>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-red-600">{currentPrice}</p>
            <p className="text-sm text-gray-600">
              Quantity:{" "}
              <span className="font-semibold text-gray-800">
                {currentQuantity}
              </span>
            </p>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">Custom</h4>
            {colorMap &&
              [...colorMap.entries()].map(([Key, value]) => {
                const selectList = [{ value: "Not selected" }];
                for (let variantId = 0; variantId < value.length; variantId++) {
                  selectList.push({
                    value: value[variantId].productSize.productSize,
                  });
                }
                const currentValue = () => {
                  if (currentVariant.color == Key) {
                    return currentVariant.size;
                  }
                  return "Not selected";
                };

                return (
                  <div key={Key} className="flex items-center gap-4">
                    <span className="min-w-[70px] font-medium text-gray-700">
                      {Key}
                    </span>
                    <SelectInputUpgrade
                      selectList={selectList}
                      value={currentValue()}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const productVariant = findProductVariant(
                          singleProduct,
                          Key,
                          e.target.value
                        );
                        setCurrentImage(productVariant.image);
                        setCurrentQuantity(productVariant.quantity);
                        setCurrentPrice(productVariant.price + "đ");
                        setCurrentVariant(() => {
                          return { color: Key, size: e.target.value };
                        });
                      }}
                    />
                  </div>
                );
              })}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mt-2">
            <QuantityInputUpgrade
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(() => parseInt(e.target.value))
              }
            />
            <Button
              mode="brown"
              text="Add to cart"
              onClick={handleAddToCart}
              className="w-full py-3 rounded-xl font-medium text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Dropdown dropdownTitle="Short Description">
              {singleProduct?.shortDesc}
            </Dropdown>
            <Dropdown dropdownTitle="Detail Description">
              {singleProduct?.detailDesc}
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
