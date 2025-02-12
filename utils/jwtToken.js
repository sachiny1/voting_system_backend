// Create Token and saving in cookie
const jwt = require("jsonwebtoken")

const encryptData = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }); // Expires in 1 hour
  return token;
};

const decryptData = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.expiryTime < Date.now()) {
      return { valid: false, message: "Token expired" };
    }
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, message: "Invalid token" };
  }
};



const sendToken = (user_id, statusCode, res) => {
    const token = encryptData({ id: user_id })
  
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
    });
  };
  
  module.exports = {sendToken,encryptData,decryptData};
  