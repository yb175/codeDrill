import { useState, useEffect} from "react";
export default function ErrorToast({message,setErrorMessage}) {
  const [visible , setVisible] = useState(true) ; 
  useEffect(()=>{
    const timer = setTimeout(()=>{
        setVisible(false) ; 
    },3000)
    return () => clearTimeout(timer);
  },[])
  if(!visible) {
    setErrorMessage("") ; 
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
