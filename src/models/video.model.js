import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema= new mongoose.Schema(
{
    videoFile:
    {
        type:String , // this will come from cloudinary url
        required:true,
    },
    thumbnail:{
        type:String, // this will come from cloudinary url
        required:true,
    },
    description:{
        type:String, 
        required:true,
    },
    duration:
    {
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true});
// plugins (also called add-ons or extensions) are small programs or pieces of code that add specific features or functions to a larger software application without modifying its core structure. They allow developers to customize and expand the capabilities of an application without altering the main code.
videoSchema.plugin(mongooseAggregatePaginate);

export const Video =mongoose.model('Video',videoSchema);

