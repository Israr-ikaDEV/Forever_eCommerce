


import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    let userData = await userModel.findById(userId);
    let cartData = (await userData.cartData) || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

   res.json({success:true,message:'added to cart'})
  } catch (error) {
   console.log(error);
   res.json({success:false,message:error.message})
   
  }
};




const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

   res.json({success:true,message:"updated"})
  } catch (error) {
    console.log(error);
   res.json({success:false,message:error.message})
  }
};

const getUserCarts = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);

    let cartData = (await userData.cartData) || {};

    res.json({success:true,cartData})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
};

export { addToCart, updateCart, getUserCarts };