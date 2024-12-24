import dotenv from "dotenv";
import connectDB from "./db/index.js";
// import express from "express";
import { app } from "./app.js";


dotenv.config({
    path: './.env'
})
connectDB()
.then(()=>{app.listen(process.env.PORT || 3000,()=>{console.log("Server is running on portvuv ",process.env.PORT || 3000)})})
.catch((err)=>{console.log("Mongo DB connection failed !!!!!",err);});
