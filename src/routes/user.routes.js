import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
// import { upload } from '../middlewares/multer.middleware.js';

// Create Router instance
const router = Router();

// Define routes
router.route('/register').post(
    // upload.fields([
    //     { name: 'avatar', maxCount: 1 },
    //     { name: 'coverImage', maxCount: 1 },
    // ]),
    registerUser
);

// Export the router
export default router;
