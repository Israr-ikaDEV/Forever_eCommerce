import mongoose from "mongoose";
const connectDB = async () => {
   mongoose.connection.on('connected',()=>{ console.log(
    "Conneted To Mongodb Databse " );})
       await mongoose.connect(`${process.env.MONGODB_URI}/forever_ecommerce`);
     
    
  };
  
  export default connectDB;