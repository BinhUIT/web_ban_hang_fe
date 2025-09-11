import React from "react"; 
import {StandardSelectInput,Button,
  Dropdown} from "../components";
 const productVariantSelector=()=> {
    return <div className="flex flex-col gap-2">
        <StandardSelectInput
              selectList={[
                {id:-1, value:"Not selected"},
                { id: 0, value: "XS" },
                { id: 1, value: "XS/S" },
                { id: 2, value: "S" },
                { id: 3, value: "M" },
                { id: 4, value: "ML" },
                { id: 5, value: "L" }, 
                {id:6, value:"LX/L"},  
                {id:7,value:"XL"},
                {id:8, value:"XL/XXL"}, 
                {id:9, value:"XXL/3XL"}, 
                {id:10, value:"3XL"}
              ]}
              ></StandardSelectInput>
    </div>
}
export default productVariantSelector;