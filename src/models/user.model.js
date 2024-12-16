import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema=new Schema({
    username:
    {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //Used for faster lookup of schema
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true, //Used for faster lookup of schema
    },
    avatar:{
        type:String, // cloudinary url
        required:true,
    },
    coverImage:
    {
        type:String, 
    },
    watchHistory:
    [{
        type:Schema.Types.ObjectId,
        ref:'Video',
    }], // Its a list of videos objects that total no of videos watched by user each having a reference to the url of video
    password:{
        type:String,
        required:[true , 'Password is required']
    },
    refreshToken: {
        type:String
    },
},{timestamps:true});
// Pre hooks or middlewares are functions that run before certain actions or events on a model, such as saving data to a database, updating, or deleting a record. Pre middleware is useful for performing tasks like validation, data transformation, logging, or authentication checks before the main action completes.
userSchema.pre("save",async function (next)
{
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10);
  next();

})// We cannot use arrow function here because arrow functions don't tell the reference so we have to use a normal function in callback function instead of arrow function

userSchema.methods.isPasswordCorrect= async function(password){
   return await  bcrypt.compare(password,this.password); //*encrypted password which we have encrypted it using bcrypt hash
}
userSchema.methods.generateAccessToken=async function ()
{
    return  jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullname
    },
process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    //generates access token
}
    //generates access token
userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullname
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

}
export const User =mongoose.model('User',userSchema);
