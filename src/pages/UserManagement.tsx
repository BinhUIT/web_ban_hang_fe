import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { checkToken } from "../utils/checkToken";
import { clearLocalStorage } from "../utils/clearLocalStorage";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { adminGetUserURL } from "../axios/api_urls";
const UserManagement = () =>{
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [listUsers, setListUsers] = useState<any[]>([]);
    const navigate = useNavigate();
    async function getAllUser() {
        const token = checkToken();
        if(!token) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
        }
        const url = adminGetUserURL(20,0);
        const response = await fetch(url, {
            method:"GET",
            headers:{
                "Content-type":"application/json",
                "Authorization":"Bearer "+token
            }
        });
        if(response.status==401) {
            toast.error("You have been logout, please login again");
            clearLocalStorage();
            navigate("/login");
        }
        if(response.ok) {
            const data= await response.json();
            setListUsers(data.content);
            
        }
    }
    useEffect(()=>{
        getAllUser();
    },[])
    return (
        <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <h1 className="text-3xl font-bold mb-8">User Mangement</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                <th className="py-3 px-4 border-b">Username</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Address</th>
                <th className="py-3 px-4 border-b">Phone number</th>
                
                </tr>
            </thead>
            <tbody>
                {listUsers.map((user) =>  (
                <tr key={user.id}>
                    <td className="py-3 px-4 border-b text-center">{user.name}</td>
                    <td className="py-3 px-4 border-b text-center">{user.email}</td>
                    <td className="py-3 px-4 border-b text-center">
                    {user.address}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                    { user.phone}
                    </td>
                    
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <Pagination totalPages={totalPage} currentPage={currentPage+1} onPageChange={()=>{}}></Pagination>
        </div>
    )
};
export default UserManagement;