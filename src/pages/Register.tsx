import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkRegisterFormData } from "../utils/checkRegisterFormData";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { useState } from "react";
import { registerURL } from "../axios/api_urls";

const Register = () => {
  const navigate = useNavigate();
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Get form data
    /*const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    // Check if form data is valid
    if (!checkRegisterFormData(data)) return;

    // Check if user with this email already exists
    const users = await customFetch.get("/users");
    const userExists = users.data.some(
      (user: { email: string }) => user.email === data.email
    );
    if (userExists) {
      toast.error("User with this email already exists");
      return;
    }

    // Register user
    const response = await customFetch.post("/users", data);
    if (response.status === 201) {
      toast.success("User registered successfully");
      navigate("/login");
    } else {
      toast.error("An error occurred. Please try again");
    }*/
   const data = {
    name:name,
    email:email,
    password:password,
    confirmPassword:confirmPassword,
    phone:phone,
    address:address
   }
   const response = await fetch(registerURL,{
    method:"POST",
    headers:{
      "Content-type":"application/json"
    },
    body:JSON.stringify(data)
   });
   const responseData= await response.json();
   if(response.ok) {
    toast.success(responseData.message);
    navigate("/login");
   } 
   else {
    toast.error(responseData.message);
   }
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="max-w-5xl mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center max-sm:px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-xl max-[450px]:font-normal">
          Welcome! Register here:
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Your name</label>
            <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
              type="text"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter name"
              id="name"
              name="name"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Your email</label>
            <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              id="email"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone">Your phone number</label>
            <input
            value ={phone}
            onChange={e=>setPhone(e.target.value)}
              type="text"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              id="phone"
              name="phone"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="address">Your address</label>
            <input
            value={address}
            onChange={e=>setAddress(e.target.value)}
              type="text"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              id="address"
              name="address"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Your password</label>
            <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter password"
              id="password"
              name="password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
            value={confirmPassword}
            onChange={e=>setConfirmPassword(e.target.value)}
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
            />
          </div>
        </div>
        <Button type="submit" text="Register" mode="brown" />
        <Link
          to="/login"
          className="text-xl max-md:text-lg max-[450px]:text-sm"
        >
          Already have an account?{" "}
          <span className="text-secondaryBrown">Login now</span>.
        </Link>
      </form>
    </div>
  );
};
export default Register;
