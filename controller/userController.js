const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const db = require("../database/database");
const { checkUserExistOrNot, insertIntoUsers,checkTokenExistOrNot,updateUserPassword } = require("../mysql_query/query");
const { encryptData,decryptData,sendToken } = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body
  if (!name || !email) {
    return next(new ErrorHander("name and email required", 400));
  }

  const [result] = await db.query(checkUserExistOrNot,[email]);
    if(result[0]){
      return next(new ErrorHander("user already exists", 400));
    }
  const detailForToken = {
    email: email,
    expire_at: Date.now() + 24 * 60 * 60 * 1000
  }
  const token = encryptData(detailForToken)

  const insertResult = await db.query(insertIntoUsers, [name, email, token, new Date().toISOString().slice(0, 19).replace("T", " ")]);

  if (!insertResult) {
    return next(new ErrorHander("error in insert query", 400));
  }

  const emailDetail = {
    email,
    subject: "Email Varification",
    message: `Please click on the link to varify your email ${process.env.FRONTEND_URL}/verify/${token}`
  }
  try {
    
    await sendEmail(emailDetail)
    res.status(200).json({
      success: true,
      message: `Email sent to ${email} successfully`,
    });
  } catch (error) {
    console.log(error)
    return next(new ErrorHander(error.message, 500));
  }

 
});

// verify User email
exports.verifyToken = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new ErrorHander("token required", 400));
  }
const [result] = await db.query(checkTokenExistOrNot,[token])
  if(!result[0]){
    return next(new ErrorHander("token not found", 400));
  }
  const {valid,message} = decryptData(token)

  if(!valid){
    return next(new ErrorHander(message, 400));
  }

  return res.status(200).json({success:true,message:"valid token"})

});

// create password
exports.createPassword = catchAsyncErrors(async (req, res, next) => {
  const { token,password,confirm_password } = req.body;
  if (!token || !password || !confirm_password) {
    return next(new ErrorHander("token,password and confirm password required", 400));
  }else if(password !== confirm_password){
    return next(new ErrorHander("password and confirm password not matched", 400));
  }

const [result] = await db.query(checkTokenExistOrNot,[token])
  if(!result[0]){
    return next(new ErrorHander("token not found", 400));
  }
  const {valid,data:{email},message} = decryptData(token)

  if(!valid){
    return next(new ErrorHander(message, 400));
  }
  
  hashPassword = await bcrypt.hash(password, 10);
  const updateResult = await db.query(updateUserPassword,["",hashPassword,new Date().toISOString().slice(0, 19).replace("T", " "),email])
  
  if(!updateResult){
    return next(new ErrorHander("error in sql query", 400));
  }
  return res.status(200).json({success:true,message:"password update successfully"})

});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const [result] = await db.query(checkUserExistOrNot,[email])
  const userDetail = result[0];

  if(!userDetail){
    return next(new ErrorHander("user not found", 400));
  }
  const isValidPassword = await bcrypt.compare(password, userDetail.password);

  if (!isValidPassword) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

    sendToken(userDetail.user_id, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});


// get User detail
exports.getMyDetail = catchAsyncErrors(async (req, res, next) => {
  const {user_id,user_name,email} = req.user
const userDetail = {user_id,user_name,email}
  res.status(200).json({
    success: true,
    data:userDetail,
  });
});