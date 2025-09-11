import React from "react"; 
interface Attribute {
    id:number;
    value:string;
};
const AttributeFilter = ({listAtribute,setFunction,title}:
    {listAtribute:Attribute[];setFunction: (value:(value:number[])=>number[])=>void;title:string}) =>{
        return (<div>
  <h3 className="font-semibold mb-2">{title}</h3>
  <div className="grid grid-cols-3 gap-2">
    {listAtribute.map((size) => (
      <label key={size.id} className="flex items-center space-x-1">
        <input type="checkbox" value={size.id} className="accent-brown-600" onChange={(e)=>{
          if(e.target.checked) {
            console.log("Chekc");
            setFunction(old => [...old, size.id]
            )
          } 
          else {
            setFunction(old=>{
              return old.filter((item)=>{
                return item!=size.id;
              });
              
            })
          }
        }} />
        <span className="text-sm">{size.value}</span>
      </label>
    ))} 
   
  </div><br></br> 
  <button 
        type="button" 
        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        onClick={() => {
          setFunction(old=>[]);
        }}
      >
        Clear
      </button></div>);
}
export default AttributeFilter;