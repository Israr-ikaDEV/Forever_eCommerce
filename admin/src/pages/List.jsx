import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverURL } from "../App";
import {toast} from "react-toastify";

const List = ({token}) => {
  const [listProduct, setListProduct] = useState([]);

  const fetchListProducts = async () => {
    try {
      const res = await axios.get(serverURL + "/api/product/list");
console.log(res)
      if (res.data.success) {
        setListProduct(res.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const removeProduct=async(id)=>{
try {
    const res=await axios.post(serverURL+'/api/product/remove',{id},{headers:{token}})
if (res.data.success){
    toast.success(res.data.message)
    await fetchListProducts();
}else{
    toast.error(res.data.message)
}
} catch (error) {
     console.log(error);
      toast.error(error.message);
}
  }

  useEffect(() => {
    fetchListProducts();
  }, []);
  return (
    <main className='flex flex-col gap-2 '>
      <p className='mb-2'>All products List</p>

      <div className=' hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-100 text-sm'>
        <b>Images</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className='text-center'>Action</b>
      </div>

      <div>
        {listProduct.map((product,index) => (
          <div
            key={index}
            className='  md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-100 text-sm'
          >
            <img className='w-12' src={product.image[0]} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{product.price}</p>
            <p onClick={()=>removeProduct(product._id)} className='text-right md:text-center cursor-pointer text-lg'>
              {" "}
              X
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default List;