import { useState, useEffect} from "react";
import { resetError } from "../slice/authSlice";
import { useDispatch } from "react-redux";
export default function ErrorToast({message}) {
  const [visible , setVisible] = useState(true) ; 
  const dispatch = useDispatch();
  useEffect(()=>{
    const timer = setTimeout(()=>{
        setVisible(false) ; 
    },3000)
    return () => clearTimeout(timer);
  },[visible,dispatch])
  if(!visible) {
    dispatch(resetError());
    return null
   } ; 
  return (
    <div className="toast toast-top toast-end mt-20">
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  );
}
