import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const{backendUrl}=useContext(ShopContext)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    country: "",
    zipcode: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically updating the form field
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              listProduct.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (paymentMethod) {
        case "COD":
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message);
          }
          break;

        case "payonline":
           const response = await axios.post(
            backendUrl + "/api/order/payment-success",
            orderData,
            { headers: { token } }
          );
          toast.success("Payment Successful! Your order is being processed.");
          setCartItems({});
          navigate("/orders");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { navigate, token, cartItems, setCartItems, getCartAmount, delivery_fee, listProduct } = useContext(ShopContext);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* --------------- Left Side ----------------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 ">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            required
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            required
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          required
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          type="text"
          placeholder="Street"
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          required
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="City"
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            required
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
         
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Zipcode"
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            required
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            required
            className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="number"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          required
          className="border  border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* --------------- Right Side ----------------------- */}
      <div className="mt-8">
        <div className="mt8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* -------------- Payment method selection -------------- */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div
              onClick={() => setPaymentMethod("COD")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "COD" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
            <div
              onClick={() => setPaymentMethod("payonline")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === "payonline" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">PAY ONLINE</p>
            </div>
          </div>

          {/* -------------- Submit button -------------- */}
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
