import { HiBars3 } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useState } from "react";
import ShopBanner from "./ShopBanner";

const Header = ({categories}:{categories:any[]}) => {
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
  const [isShowCats, setIsShowCats] = useState(false);
  const navigate = useNavigate();
  return (
    <>
    <header className="max-w-screen-2xl flex text-center justify-between items-center py-4 px-5 text-black mx-auto max-sm:px-5 max-[400px]:px-3 relative">
  {/* Nút sidebar (mobile) */}
  <HiBars3
    className="text-2xl max-sm:text-xl mr-20 max-lg:mr-0 cursor-pointer"
    onClick={() => setIsSidebarOpen(true)}
  />

  {/* Logo */}
  <Link
    to="/"
    className="text-4xl font-light tracking-[1.08px] max-sm:text-3xl max-[400px]:text-2xl"
  >
    FASHION
  </Link>

  {/* Menu + Icons */}
  <div className="flex items-center gap-6">
    {/* Categories dropdown */}
    <div className="relative group hidden md:block">
      <button className="font-medium text-gray-700 hover:text-black" onMouseEnter={e=>setIsShowCats(true)} onMouseLeave={e=>setIsShowCats(false)}>
        Categories
      </button>

      {/* Dropdown */}
     
      </div>

    {/* Icons */}
    <div className="flex gap-4 items-center max-sm:gap-2">
      <Link to="/search">
        <HiOutlineMagnifyingGlass className="text-2xl max-sm:text-xl" />
      </Link>
      <button onClick={(e)=>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) {
          navigate("/login");
        }
        else {
          navigate("/user-profile");
        }
      }}>
        <HiOutlineUser className="text-2xl max-sm:text-xl" />
      </button>
      <button onClick={(e)=>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) {
          navigate("/login");
        }
        else {
          navigate("/cart");
        }
      }}>
        <HiOutlineShoppingBag className="text-2xl max-sm:text-xl" />
      </button>
    </div>
  </div>
</header>
{ isShowCats&&<ShopBanner categories={categories}></ShopBanner>}
<SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />


    </>
  );
};
export default Header;
