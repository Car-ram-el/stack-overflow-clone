import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";

dotenv.config();

// middlewares
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get('/',(req,res)=>{
  res.send("Hello world!");
})

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

const PORT = process.env.PORT;
const connectDb = async() => {
  try {
    mongoose.connect(process.env.CONNECTION_URL); 
    app.listen(PORT, ()=>console.log(`http://localhost:${PORT}`));
  } catch (error) { console.error(error); }
};
connectDb();

