import userModel from "../models/userModel.js";
import bcrypt  from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
//Route for userLOGIN
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "User does not exist" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken(user._id)
        res.json({
          success: true,
          token,
        });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  //register User
const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
 //check user
 const exists = await userModel.findOne({ email });
 //exisiting user
 if (exists) {
   return res.json({
     success: false,
     message: "Already Register please login",
   });
 }
      //validations
      if (!name) {
        return res.json({ error: "Name is Required" });
      }
      if (!validator.isEmail(email)) {
        return res.json({ success:false,message: " Valid Email is Required" });
      }
      if (password.length<8) {
        return res.json({success:false, message: "Strong Password is Required" });
      }
     
      //register user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword =await bcrypt.hash(password,salt)
      //save
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
    
      })

  const user = await newUser.save()
  const token = createToken(user._id)

      res.json({
        success: true,
        token
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Errro in Registeration",
       
      });
    }
  };


  //Route for adminLOGIN
// Route for admin LOGIN




// Route for admin LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password match the ones in the .env file
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Create the token 
      const token =jwt.sign(email+password,process.env.JWT_SECRET);  // Here "admin" is just a placeholder ID

      res.json({
        success: true,
        token,
        message: "Admin login successful",
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


  export{loginUser,registerUser,adminLogin}