import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getStatisticURL } from "../axios/api_urls";
import { checkToken } from "../utils/checkToken";
import { onTokenExpire } from "../utils/onTokenExpire";
import { useNavigate } from "react-router-dom";
import CircleLoader from "../components/CircleLoader";

export default function StatisticPage() {
  const [from, setFrom] = useState("2025-09-28");
  const [to, setTo] = useState("2025-10-02");
  const [data, setData] = useState(null);
  const navigate= useNavigate();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const token= checkToken();
    if(!token) {
        onTokenExpire(navigate);
        
    }
    fetch(getStatisticURL(from,to),{
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [from, to]);

  if (!data) return <p>Loading...</p>;

  const productData = Object.entries(data.statisticByProduct).map(([name, val]) => ({
    name,
    amount: val.amount,
    totalPrice: val.totalPrice,
  }));

  const categoryData = Object.entries(data.statisticByCategory).map(([name, val]) => ({
    name,
    value: val.totalPrice,
  }));

  return (
    <div className="p-8">
        {!data&&<CircleLoader></CircleLoader>}
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>

      {/* Bộ lọc ngày */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block font-semibold">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block font-semibold">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border px-2 py-1 rounded" />
        </div>
      </div>

      {/* Tổng doanh thu và đơn hàng */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p className="text-xl font-bold text-green-600">{data.totalIncome.toLocaleString()} VND</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-xl font-bold text-blue-600">{data.totalOrders}</p>
        </div>
      </div>

      {/* Biểu đồ thống kê theo sản phẩm */}
      <div className="mb-10 bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Statistic by Product</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productData} margin={{ top: 20, right: 30, left: 30, bottom: 50 }}>
            <XAxis dataKey="name"  />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalPrice" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ thống kê theo Category */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Statistic by Category</h2>
       <ResponsiveContainer width="100%" height={350}>
  <PieChart
    margin={{ top: 40, right: 40, left: 40, bottom: 60 }} // thêm padding cho chart
  >
    <Pie
      data={categoryData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="45%"   // nhích chart lên trên để có khoảng trống cho legend
      outerRadius={110}
      //label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
      labelLine={false}
    >
      {categoryData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend 
      verticalAlign="bottom" 
      height={50}  // tạo không gian cho legend
      wrapperStyle={{ marginTop: 20 }} // cách ra thêm
    />
  </PieChart>
</ResponsiveContainer>




      </div>
    </div>
  );
}
