import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import {
  Cart,
  Checkout,
  HomeLayout,
  Landing,
  Login,
  OrderConfirmation,
  OrderHistory,
  Register,
  Search,
  Shop,
  SingleOrderHistory,
  SingleProduct,
  UserProfile,
} from "./pages";
import { checkoutAction, searchAction } from "./actions/index";
import { shopCategoryLoader } from "./pages/Shop";
import { loader as orderHistoryLoader } from "./pages/OrderHistory";

import OrderManagement from "./pages/OrderManagement";
import toast from "react-hot-toast";
import SingleOrderManagement from "./pages/SingleOrderManagement";
import UserManagement from "./pages/UserManagement";
function redirectToLogin() {
  toast.error("You have no permission");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpireAt");
  return redirect("/login");
}
async function loaderForAdminAndUser() {
   const userJSON = localStorage.getItem("user");
  if(!userJSON) {
    return redirectToLogin();
  } 
  return null;
}
async function adminLoader() {
  const userJSON = localStorage.getItem("user");
  if(!userJSON) {
    return redirectToLogin();
  } 
  const user = JSON.parse(userJSON);
  if(user.roleId!=1) {
    return redirectToLogin();
  }
  return null;
} 
async function userLoader() {
  const userJSON = localStorage.getItem("user");
  if(!userJSON) {
    return redirectToLogin();
  } 
  const user = JSON.parse(userJSON);
  if(user.roleId!=2) {
    return redirectToLogin();
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:category",
        element: <Shop />,
        loader: shopCategoryLoader,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
        loader: userLoader
      },
      {
        path: "checkout",
        element: <Checkout />,
        action: checkoutAction,
        loader: userLoader
      },
      {
        path: "search",
        action: searchAction,
        element: <Search />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />,
        loader:userLoader
      },
      {
        path: "user-profile",
        element: <UserProfile />,
        loader:loaderForAdminAndUser
      },
      {
        path: "order-history",
        element: <OrderHistory />,
        loader: userLoader,
      },
      {
        path: "order-history/:id",
        element: <SingleOrderHistory />,
        loader:userLoader
        
      },
      {
        path: "order_management",
        element:<OrderManagement/>, 
        loader:adminLoader
      },
      {
        path:"order_management/:id",
        element: <SingleOrderManagement/>,
        loader:adminLoader
      }, 
      {
        path:"user_management",
        element: <UserManagement/>,
        loader:adminLoader
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
