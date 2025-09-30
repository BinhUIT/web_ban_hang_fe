import React from "react"; 
export default function CircleLoader() {
    return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      {/* Vòng tròn xoay */}
      <div className="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

      {/* Dòng chữ */}
      <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
    </div>
  );
}