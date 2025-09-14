import {
  HiCheck as CheckIcon,
  HiXMark as XMarkIcon,
  HiQuestionMarkCircle as QuestionMarkCircleIcon,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  removeProductFromTheCart,
  updateProductQuantity,
} from "../features/cart/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { baseURL } from "../axios/baseURL";

const Cart = () => {
  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartItemAmount, setCartItemAmount] = useState<Map<number,number>>(new Map());
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  function fetchCart(token:string) {
    fetch(baseURL+"/user/cart",{
          method:"GET",
          headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer ${token}`
          }
        }).then((response)=>{
          response.json().then((data)=>{
            console.log(data);
            setCartItems(data.cartItems);
            let newTotal=0;
            for(let item of data.cartItems) {
              newTotal= newTotal+item.productVariant.price*item.amount;
            }
            setTotal(newTotal);
            const tempMap= new Map();
            for(let item of data.cartItems) {
              tempMap.set(item.id,item.amount);
            }
            setCartItemAmount(tempMap);
          }).catch(err=>{
            toast.error("You have been logged out, please login again");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
          })
        }).catch(err=>{
          toast.error("Error, please reload page");
        }) 
  }
  function checkToken() {
    const token = localStorage.getItem("token");
    if(!token) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      
    } 
    return token;
  }
  function onDontSave() {
    const token = localStorage.getItem("token");
    if(token) {
      fetchCart(token);
    }
  }
  async function onClearAll() {
    const token = localStorage.getItem("token");
    if(token) {
      const response = await fetch(baseURL+"/user/clear_cart",{
        method:"DELETE",
        headers:{
          "Content-type":"application/json",
          "Authorization":"Bearer "+token
        }
      });
      if(response.ok) {
                                fetchCart(token);
                                toast.success("Cleared items");
                              } 
                              else if(response.status==401) { 
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                navigate("/login");
                              }
                              else {
                                toast.error("Error, please try again");
                              }
    }
  }
  useEffect(()=>{
    
    const token = checkToken();
    if(token) {
      fetchCart(token); 
    }
  },[])
  async function onSaveItems() {
     const token = checkToken();
     if(token) {
      const requestBody = Array.from(cartItemAmount).map(([key, value])=>{
        return {
          cartItemId:key,
          newAmount:value
        }
      });
      const response = await fetch(baseURL+"/user/update_many_cart_item" ,{
                method:"PUT",
                                headers:{
                                  "Content-type":"application/json",
                                  "Authorization":"Bearer "+token
                                },
                                body:JSON.stringify(requestBody)
                              })
                              if(response.ok) {
                                fetchCart(token);
                                toast.success("Saved items");
                              } 
                              else if(response.status==401) { 
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                navigate("/login");
                              }
                              else {
                                toast.error("Error, please try again");
                              }

  }
}
async function onClearOne(id:number) {
  const token = localStorage.getItem("token");
    if(token) {
      const response = await fetch(baseURL+"/user/delete_cart_item/"+id,{
        method:"DELETE",
        headers:{
          "Content-type":"application/json",
          "Authorization":"Bearer "+token
        }
      });
      if(response.ok) {
                                fetchCart(token);
                                toast.success("Item deleted");
                              } 
                              else if(response.status==401) { 
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                navigate("/login");
                              }
                              else {
                                toast.error("Error, please try again");
                              }
    }
}
  return (
    <div className="bg-white mx-auto max-w-screen-2xl px-5 max-[400px]:px-3">
      <div className="pb-24 pt-16">
        <h1 className="text-3xl tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartItems.map((item) => {
                const productVariant = item.productVariant;
                return (
                <li key={productVariant.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={`${baseURL}/${productVariant.image}`}
                      alt={productVariant.name}
                      className="h-24 w-24 object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link
                              to={`/product/${productVariant.productId}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {productVariant.name}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{productVariant.productColor.color}</p>
                          {productVariant.productSize.productSize ? (
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              {productVariant.productSize.productSize}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {productVariant.price}đ
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor="quantity mr-5">Amount: </label>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          className="w-16 h-7 indent-1 bg-white border"
                          value={cartItemAmount.get(item.id)}
                          onChange={
                            async (e)=>{
                              e.preventDefault();
                              if(Number.parseInt(e.target.value)<=0) {
                                return;
                              }
                              /*const token = checkToken();
                              const requestBody = {
                                cartItemId:item.id,
                                newAmount:e.target.value
                              }
                              const response = await fetch(baseURL+"/user/update_cart" ,{
                                method:"PUT",
                                headers:{
                                  "Content-type":"application/json",
                                  "Authorization":"Bearer "+token
                                },
                                body:JSON.stringify(requestBody)
                              })
                              if(response.ok) {
                                fetchCart(token);

                              } 
                              else if(response.status==401) { 
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                navigate("/login");
                              }
                              else {
                                toast.error("Error, please try again");
                              }*/
                              const tempMap = new Map(cartItemAmount);
                              tempMap.set(item.id,Number.parseInt(e.target.value));
                              setCartItemAmount(tempMap);
                            }
                          }
                        />

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={(e)=>{
                              e.preventDefault();
                              onClearOne(item.id);
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      

                      
                    </p>
                  </div>
                </li>
                )
})}
            </ul>
            {cartItems&&cartItems.length>0&&<div>
            <button
  onClick={(e) => {
    e.preventDefault();
    onSaveItems();
  }}
  className="mt-4 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
>
  Save
</button>
<br />

<button
  onClick={(e) => {
    e.preventDefault();
    onDontSave();
  }}
  className="mt-2 px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition"
>
  Don't save
</button>
<br />

<button
  onClick={(e) => {
    e.preventDefault();
    onClearAll();
  }}
  className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
>
  Clear all
</button>
</div>}

          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {total}đ
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5 text-secondaryBrown"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
               
                <dd className="text-sm font-medium text-gray-900">
                  {total / 5}đ
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  {total === 0 ? 0 : total  + 5}đ
                </dd>
              </div>
            </dl>

            {cartItems.length > 0 && (
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="text-white bg-secondaryBrown text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center max-md:text-base"
                >
                  Checkout
                </Link>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};
export default Cart;
function err(reason: any): PromiseLike<never> {
  throw new Error("Function not implemented.");
}

