import express from 'express';
import { getCart, addToCart, updateCartQuantity, removeFromCart } from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.route('/')
    .get(getCart);

router.route('/:productId')
    .post(addToCart)
    .patch(updateCartQuantity)
    .delete(removeFromCart);

export default router;