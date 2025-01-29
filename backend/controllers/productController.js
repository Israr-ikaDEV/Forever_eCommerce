
import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

//add product
const addProduct =async(req ,res )=>{
try {
    const { name, description, price, category,subCategory, sizes, bestSeller } = req.body;
const image1= req.files.image1 && req.files.image1[0]
const image2= req.files.image2 && req.files.image2[0]
const image3= req.files.image3 && req.files.image3[0]
const image4= req.files.image4 && req.files.image4[0]
 

const images=[image1,image2,image3,image4].filter((item)=>item!==undefined)
let images_url= await Promise.all(
    images.map(async (item)=>{
        let result= await cloudinary.uploader.upload(item.path,{resource_type:'image'})
        return result.secure_url
    })
)
const productData={
    name,description,category,subCategory,price:Number(price),sizes:JSON.parse(sizes),bestSeller: bestSeller==="true"?true:false,image:images_url,date:Date.now()
}
console.log(productData);
const product = new productModel(productData)
await product.save()

res.json({success:true,message:"product added"})



} catch (error) {
    res.json({success:false,message:error.message})
console.log(error);

}
}


// List all products
const listProducts = async (req, res) => {
    try {
      // Query to get all products from the database
      const products = await productModel.find({});
  
      // If products found, send them in the response
      if (products) {
        res.json({
          success: true,
          message: 'Products retrieved successfully',
          products
        });
      } else {
        // If no products are found
        res.json({
          success: false,
          message: 'No products found'
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: error.message
      });
    }
  };
  
/// Remove product by id from request body
const removeProduct = async (req, res) => {
    try {
      const { id } = req.body; // Get the product id from the request body
  
      // Check if the id is provided
      if (!id) {
        return res.json({
          success: false,
          message: 'Product ID is required'
        });
      }
  
      // Check if the product exists
      const product = await productModel.findById(id);
      if (!product) {
        return res.json({
          success: false,
          message: 'Product not found'
        });
      }
  
      // If product exists, delete it
      await productModel.findByIdAndDelete(id);
  
      res.json({
        success: true,
        message: 'Product removed successfully'
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: error.message
      });
    }
  };
  
//single product info
// Get info of a single product by id from request body
const singleProduct = async (req, res) => {
    try {
      const { productId } = req.body; // Get the product id from the request body
  
      // Check if the id is provided
      if (!productId) {
        return res.json({
          success: false,
          message: 'Product ID is required'
        });
      }
  
      // Check if the product exists
      const product = await productModel.findById(productId);
      if (!product) {
        return res.json({
          success: false,
          message: 'Product not found'
        });
      }
  
      // If product exists, return the product details
      res.json({
        success: true,
        message: 'Product retrieved successfully',
        product
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: error.message
      });
    }
  };
  
export  {listProducts,addProduct,removeProduct,singleProduct}