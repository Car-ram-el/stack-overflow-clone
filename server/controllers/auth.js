import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import twilio from 'twilio';

import users from "../models/auth.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(404).json({ message: "User already Exist." });
    
    const hashedPassword = await bcrypt.hash(password, 10); // salt to generate hash of length 10
    const newUser = await users.create({name,email,password: hashedPassword});

    // jwt token
    const token = jwt.sign({ email: newUser.email, id: newUser._id },process.env.JWT_SECRET,{ expiresIn: "1h" });

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });
    
    const comparePass =  bcrypt.compare(password, existingUser.password);
    if (!comparePass) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id },process.env.JWT_SECRET,{ expiresIn: "1h" });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

let cachedOtp;
const generateOtp = () => {
  cachedOtp = Math.floor(Math.random()*9000 + 1000); 
  return cachedOtp;
}

export const sendOtp = async(req,res) => {
  const choice=req.body.choice; 
  const otp = generateOtp();
  let otpSent=false;

  try{
    if(choice.match(/^\d+$/)!==null){ // contains only numbers => phone
      const accountSid = process.env.PHONE_ACCOUNT_SID;
      const authToken = process.env.PHONE_AUTH_TOKEN;
      const client = new twilio(accountSid, authToken);      
      try{
        await client.messages
        .create({
          body: `The otp for resetting the password is ${otp}. Enjoy stack overflow clone.`,
          from: process.env.PHONE_NO,
          to: `+91${choice}`
        }); otpSent=true;
      } catch(err){console.log(err)}

    } else{ // email
      const transporter=nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        port:465,
        secure:true,
        auth:{
          user:process.env.EMAIL_ID,
          pass:process.env.EMAIL_PASS
        }
      });
      try{
        await transporter.sendMail({
          from:`"John Doe"<${process.env.EMAIL_ID}>`,
          to: choice,
          subject:"Reset password for using Stack Overflow Clone",
          html:`<p>The otp for resetting the password is </p><h4>${otp}</h4><p>Enjoy stack overflow clone.</p>`
        }); otpSent=true;
      } catch(err){console.log(err)}
    } 
    if(!otpSent) return res.status(500).json({message:"Failed to send otp."})
    console.log("sent otp");
  } catch(err) {console.log(err);}
}

export const verifyUser = async(req,res) => {
  const code = Number(req.body.code);
  
  try {
    if(code === cachedOtp){ 
      res.status(200).json({message:"User validated\nSet up the password"})
      return;
    }
    return res.status(400).json({message:"Incorrect credentials."})
  } catch(err){ 
    console.log(err);
    return res.status(500).json({message:"Internal server error."})
  }
}

export const resetPass = async(req,res) => {
  const {mail, password}=req.body;
  
  try {
    const existingUser = await users.findOne({ mail });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

    const hashedPassword = await bcrypt.hash(password, 10); // salt to generate hash of length 10
    existingUser.password = hashedPassword;
    res.status(200).json({message:"Password reset successfully"})
    
  } catch (err) {
    res.status(500).json({message:err.message})
  }
}