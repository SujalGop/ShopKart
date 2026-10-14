import express from 'express';
import { createProduct, getProducts, getProductById, deleteProductById } from '../controllers/product.controller.js';

const router = express.Router();


router.route('/').post(createProduct).get(getProducts);

router.route('/:id').get(getProductById);

router.route('/delete/:id').delete(deleteProductById);

export default router;