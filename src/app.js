import express from 'express';
import cors from "cors";

import userRouter from "./routes/user.routes.js"
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"16kb"}))
//URL se jo data aata like watch>v=5S6468e ye sb urls me likha rhta h .... all this is done by urlencoded 
app.use(express.urlencoded({extended: true, limit:"16kb"}))
//This configuration of express is so that files like images etc are loaded publicly .. these assets can be accesses by public 
app.use(express.static("public"));
//Cookiesparse is liye use hota server se user ke browser ki cookies access kr ske or usme CRUD operations perfrom kr ske server hi un secure cookies ko use kr skta h
app.use(express.cookieParser());  

// routes import //we observe that we are importing in the last ,importing routes is done like this only in production mode projects

//routes declarations

app.use("/api/v1/users",userRouter);
//http://localhost:8000/api/v1/users this type of route /url is created
export {app}