import multer from "multer";
// Disk Storage: Gives you full control on storing files to disk.
const storage=multer.diskStorage({
    destination: function (req, file , cb)
    {
        cb(null,'./public/temp')
    },
    filename: function (req, file, cb){
        cb(null,file.originalname)
    }
})

//Disk Storage 
export const upload=multer({storage:storage})
