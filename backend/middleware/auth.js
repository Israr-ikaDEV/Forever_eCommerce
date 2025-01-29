import jwt from "jsonwebtoken";

export const isAuthorized = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: 'not authorized' });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      throw createError(400, "Incorrect email or password");
    }

    req.body.userId = decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
