import React, { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { baseURL } from "../axios/baseURL";
import toast from "react-hot-toast";
const CategoryLink = ({categoryName}:{categoryName:string}) =>{
    const [navString, setNavString] = useState<string>("");
    /*useEffect(()=>{
        fetch(baseURL+"/unsecure/category/"+categoryName).then((response)=>{
            response.json().then((data)=>{
                if(data.children&&data.children.length>0) {
                    let newString = "";
                    newString+="catIds="+data.children[0].id;
                    for(let i=1;i<data.children.length;i++) {
                        newString+="&catIds="+data.children[i].id;
                    }
                    setNavString(newString);
                }
                else {
                    setNavString(`catIds=${data.id}`);
                }
            })
        }).catch(err=>toast.error("Error from server, please reload page"))
    },[]);*/
    return (
        <Link to={`/shop?${navString}`}>{categoryName}</Link>
    )
}
export default CategoryLink;