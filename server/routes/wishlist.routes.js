import express from 'express';
import { 
    getWishlist, 
    addWishlist, 
    removeWishlist, 
    toggleWishlist 
} from '../controllers/wishlist.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Ensure path matches your Lab 02 setup

const router = express.Router();

router.use(isAuthenticated); 

router.route('/')
    .get(getWishlist);

router.route('/:productId')
    .post(addWishlist)
    .delete(removeWishlist);

router.route('/:productId/toggle')
    .patch(toggleWishlist);

export default router;