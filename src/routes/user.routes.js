import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from  "../middlewares/multer.middleware.js"
const router = Router();

// Define route at "/register" to match "/api/v1/users/register"
route.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),registerUser
)
export default router;
