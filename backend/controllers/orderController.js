import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const currency = "$";
const delivery_chage = 10;

const placeOrder = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;

    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "COD", // Cash On Delivery
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear the user's cart after placing the order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: 'Order placed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Mimic successful payment without Stripe/Razorpay
const placeOrderPaymentSuccess = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;

    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "Paid online", // Payment method that just mimics the payment
      payment: true, // Set payment to true to indicate that the payment is successfully made
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);

    // Clear the user's cart after placing the order
    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });

    // Mimic a successful payment response
    res.json({ success: true, message: "order placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'status updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });

      return res.json({
        success: true,
        message: "Payment successfully verified",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({
        success: true,
        message: "Payment failed, order deleted",
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  placeOrder,
  placeOrderPaymentSuccess, // Use this function to simulate payment success
  allOrders,
  userOrders,
  updateOrderStatus,
  verifyPayment,
};
