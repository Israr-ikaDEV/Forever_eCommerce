import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const [token, setToken] = useState("");
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
const backendUrl= import.meta.env.VITE_BACKEND_URL
  // Fetch products from the backend

  const [listProduct, setListProduct] = useState([]);

  const fetchListProducts = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/product/list"
      );
      console.log(res);
      if (res.data.success) {
        setListProduct(res.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"))
    }
  }, []);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size]
        ? (cartData[itemId][size] += 1)
        : (cartData[itemId][size] = 1);
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("added to cart");
    if(token){
      try {
        await axios.post(backendUrl + "/api/cart/add",{itemId, size},{headers:{token}})
      } catch (error) {
        console.log(error);
        toast.error(error.message)
        
      }
    }
  };

  const addOrder = () => {
    let tempOrders = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrders, ...newOrder]);
    //setCartItems({}); // Clear cart after placing the order
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if(token){
      try {
        await axios.post(backendUrl + "/api/cart/update",{itemId, size,quantity},{headers:{token}})
      } catch (error) {
        console.log(error);
        toast.error(error.message)
        
      }
    }
  };
const getUserCart=async(token)=>{
try {
  const res= await axios.get(backendUrl+'/api/cart/get',{headers:{token}})
  if (res.data.success){
    setCartItems(res.data.cartData)
  }
} catch (error) {
  console.log(error);
  toast.error(error.message)
}
}
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const productInfo = listProduct.find((product) => product._id === item);
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0 && productInfo) {
            totalAmount += productInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
    return totalAmount;
  };

  const value = {
    listProduct,
    token,
    setToken,
    setListProduct,
    currency,
    delivery_fee,
    search,
    fetchListProducts,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder,
    orders,
    navigate,setCartItems,backendUrl
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
