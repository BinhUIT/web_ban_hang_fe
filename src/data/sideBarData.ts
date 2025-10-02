interface sideBarItem {
    to:String,
    title:String
}
export const sideBarData = [
    [
        {
            to:"/",
            title:"Home"
        },
        {
            to:"/shop",
            title:"/shop",
        },{
    to:"/login",
    title:"Sign in",
   
},
{
    to:"/register",
    title:"Sign up",
    
}
    ],//non -login
    [
        {
            to:"/user_management",
            title:"User management"
        },
        {
            to:"/product_management",
            title:"Product management"
        },
        {
            to:"/order_management",
            title:"Order management"
        },
        {
            to:"/statistic",
            title:"Statistic"
        }
    ],//admin
    [
{
to:"/",
title:"Home",

},
{
    to:"/shop",
    title:"Shop",
    
},
{
    to:"/search",
    title:"Search",
    
}, {
    to:"/logout",
    title:"Log out",
    
},

{
    to:"/cart",
    title:"Cart",
    
},
{
    to:"/order-history",
    title:"Order History",
    
}
]//user
]