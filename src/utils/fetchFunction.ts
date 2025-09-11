import toast from "react-hot-toast";
import { baseURL } from "../axios/baseURL";

function fetchFromServer(url:string, setFunction:any) {
    fetch(baseURL+url).then(
      response=>{
        response.json().then(data=>{
          console.log(data);
          setFunction(data.content);
        })
      }
    ).catch(err=>{
      toast.error("Error from server, please reload page");
    })
  }
export default fetchFromServer;