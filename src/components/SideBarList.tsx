import React, { useEffect, useState } from "react";
import { sideBarData } from "../data/sideBarData";
import { Link } from "react-router-dom";

const SideBarList = ()=>{
    const [sideBarList, setSideBarList] = useState<any>([]) // 0- Non login, 2- user, 1- admin
    useEffect(()=>{
        const userJSON= localStorage.getItem("user");
        if(!userJSON) {
            setSideBarList(sideBarData[0]);
        } 
        else {
            
            const user = JSON.parse(userJSON);
            console.log(user);
            setSideBarList(sideBarData[user.roleId]);

        }
    });
    
    return (
        <div className="flex flex-col items-center gap-1 mt-7">
            {
              sideBarList&&sideBarList.map((item)=>{
                return  <Link
              to={item.to}
              className="py-2 border-y border-secondaryBrown w-full block flex justify-center"
            >
              {item.title}
            </Link>
              })
            }
          </div>
    )
}
export default SideBarList;