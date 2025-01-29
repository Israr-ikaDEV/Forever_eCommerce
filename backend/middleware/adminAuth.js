import jwt from 'jsonwebtoken';

// Middleware to check if the user is an admin
const adminAuth = (req, res, next) => {
  try {
    
    const{token} = req.headers

    // If no token, return an error response
    if (!token) {
      return res.json({ success: false, message: "Access denied." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin by inspecting the decoded token's role
    if (decoded!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD ) {
      return res.json({ success: false, message: "Forbidden. You are not an admin." });
    }
    

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
};

export default adminAuth;
