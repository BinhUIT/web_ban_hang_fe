import { HiTrash as TrashIcon } from "react-icons/hi2";
import { Button } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart } from "../features/cart/cartSlice";
import customFetch from "../axios/custom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkCheckoutFormData } from "../utils/checkCheckoutFormData";
import { useEffect, useRef, useState } from "react";
import { baseURL } from "../axios/baseURL";

/*
address: "Marka Markovic 22"
apartment: "132"
cardNumber: "21313"
city: "Belgrade"
company: "Bojan Cesnak"
country: "United States"
cvc: "122"
emailAddress: "kuzma@gmail.com"
expirationDate: "12312"
firstName: "Aca22"
lastName: "Kuzma"
nameOnCard: "Aca JK"
paymentType: "on"
phone: "06123123132"
postalCode: "11080"
region: "Serbia"
*/

const paymentMethods = [
  { id: "credit-card", title: "Credit card" },
  { id: "paypal", title: "PayPal" },
  { id: "etransfer", title: "eTransfer" },
];

const Checkout = () => {
  
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal]= useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [checkOutType, setCheckOutType] = useState("COD");
  const isChangeAddressRef= useRef(false);
  const isChangePhoneRef= useRef(false);
  const [user, setUser] = useState<any>(null);
  const [addressState, setAddressState]= useState("");
  const [phoneState, setPhoneState] = useState("");
  const navigate = useNavigate();
  function checkToken() {
    const token = localStorage.getItem("token");
    if(!token) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      
    } 
    return token;
  }
  async function onCheckOut() {
    const token = checkToken();
    if(token) {
      const requestBody = {
        paymentType:checkOutType,
        address:isChangeAddressRef.current?user.address:null,
        phone:isChangePhoneRef.current?user.phone:null
      }
      const response = await fetch(baseURL+"/user/order",{
        method:"POST",
        headers:{
          "Content-type":"application/json",
          "Authorization":"Bearer "+token
        },
        body:JSON.stringify(requestBody)
      });
      if(response.ok) {
        toast.success("Create order success");
        const data = await response.json()
        if(data.message=="Success") {
         navigate("/order-history/"+data.orderId);
        }
        else {
         window.location.replace(data.message);
        }
      }
      if(response.status==401) {
        toast.error("You have been logged out, please login again");
        localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      }
      if(response.status==500) {
        toast.error("Error, please try again");
      }
      }
    else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
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
  function loadUser() {
    const userJson = localStorage.getItem("user");
    if(userJson) {
    return JSON.parse(userJson);
    }
    else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
  useEffect(()=>{
    const token = checkToken();
    if(token) {
      fetchCart(token);
    }
    const tempUser= loadUser();
    if(tempUser) {
      console.log(tempUser);
      setUser(tempUser);
      setAddressState(tempUser.address);
      setPhoneState(tempUser.phone);
      
    }
  },[]);
  useEffect(()=>{
    if(cartItems&&cartItems.length>0) {
      let newSubTotal=0;
      let newShippingFee=0;
      for(let item of cartItems) {
        newSubTotal+=item.amount*item.productVariant.price;
        newShippingFee +=5;
      }
      setSubTotal(newSubTotal);
      setShippingFee(newShippingFee);
      isChangeAddressRef.current=false;
      
      isChangePhoneRef.current=false;
    }
  },[cartItems])
  return (
    <div className="mx-auto max-w-screen-2xl">
   <div className="pb-24 pt-16 px-5 max-[400px]:px-3">
      <h2 className="sr-only">Create Order</h2>
      <form
         onSubmit={(e)=>
         {
         e.preventDefault();
         onCheckOut();
         }}
         className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
         >
         <div>
            <div>
               <h2 className="text-lg font-medium text-gray-900">
                  Contact information
               </h2>
               <div className="mt-4">
                  
               </div>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-10">
               <h2 className="text-lg font-medium text-gray-900">
                  Shipping information
               </h2>
               <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                     <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                        >
                     Address
                     </label>
                     <div className="mt-1">
                        <input
                           type="text"
                           name="address"
                           id="address"
                           autoComplete="street-address"
                           className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border border shadow-sm sm:text-sm"
                           required={true}
                           value = {addressState}
                           onChange={(e)=>{
                            isChangeAddressRef.current=true;
                            setAddressState(e.target.value)
                           }}
                           />
                     </div>
                  </div>
                  
                  
                  <div className="sm:col-span-2">
                     <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                        >
                     Phone
                     </label>
                     <div className="mt-1">
                        <input
                           type="tel"
                           name="phone"
                           id="phone"
                           autoComplete="tel"
                           className="block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border border shadow-sm sm:text-sm"
                           required={true}
                           value={phoneState}
                           onChange={(e)=>{
                            isChangePhoneRef.current=true;
                             setPhoneState(e.target.value);
                           }}
                           />
                     </div>
                  </div>
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700">Choose checkout type:</label>
               <br></br>
               <div>
               <div>
               <input type="checkbox" id={"COD"} value={"COD"} checked={checkOutType=="COD"} onChange={(e)=>{
                  if(e.target.checked){
                     setCheckOutType("COD");
                  } 
                  else {
                     setCheckOutType("ONLINE");
                  }
               }}/>
               <label htmlFor="online">Cost On Delivery</label>
               </div>
               <div>
                  <input type="checkbox" id={"online"} value={"ONLINE"} checked = {checkOutType=="ONLINE"} onChange={(e)=>{
                     if(e.target.checked){
                     setCheckOutType("ONLINE");
                  } 
                  else {
                     setCheckOutType("COD");
                  }
                  }}/>
               <label htmlFor="online">Online</label>
               </div>
               </div>
            </div>
            
         </div>
         {/* Order summary */}
         <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-4 border border-gray-200 bg-white shadow-sm">
               <h3 className="sr-only">Items in your cart</h3>
               <ul role="list" className="divide-y divide-gray-200">
                  {cartItems.map((item) => { 
                  const productVariant= item.productVariant;
                  return (
                  <li key={productVariant?.id} className="flex px-4 py-6 sm:px-6">
                     <div className="flex-shrink-0">
                        <img
                           src={`${baseURL}/${productVariant?.image}`}
                           alt={productVariant?.name}
                           className="w-20 rounded-md"
                           />
                     </div>
                     <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                           <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                 {productVariant?.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                 {productVariant?.productColor.color}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                 {productVariant?.productSize.productSize}
                              </p>
                           </div>
                           <div className="ml-4 flow-root flex-shrink-0">
                              <button
                                 type="button"
                                 className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                                
                                 >
                                 <span className="sr-only">Remove</span>
                                 <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                           </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between pt-2">
                           <p className="mt-1 text-sm font-medium text-gray-900">
                              ${productVariant?.price}
                           </p>
                           <div className="ml-4">
                              <p className="text-base">
                                 Quantity: {item?.amount}
                              </p>
                           </div>
                        </div>
                     </div>
                  </li>
                  )})}
               </ul>
               <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                     <dt className="text-sm">Subtotal</dt>
                     <dd className="text-sm font-medium text-gray-900">
                      {subTotal}đ
                     </dd>
                  </div>
                  <div className="flex items-center justify-between">
                     <dt className="text-sm">Shipping</dt>
                     <dd className="text-sm font-medium text-gray-900">
                      {shippingFee}đ
                     </dd>
                  </div>
                  <div className="flex items-center justify-between">
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                     <dt className="text-base font-medium">Total</dt>
                     <dd className="text-base font-medium text-gray-900">
                      {subTotal+shippingFee}đ
                     </dd>
                  </div>
               </dl>
               <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <Button text="Confirm Order" mode="brown" />
               </div>
            </div>
         </div>
      </form>
   </div>
</div>
  );
};
export default Checkout;
