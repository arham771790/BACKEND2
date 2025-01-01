import { Router } from 'express';
import { registerUser,loginUser,logoutUser} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

// Create Router instance
const router = Router();

// Define routes
router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
    ]),
    registerUser
);
router.route('/login').post(loginUser)

//Secured routes
router.route('/logout').post(verifyJWT,logoutUser)

// Export the router
export default router;
