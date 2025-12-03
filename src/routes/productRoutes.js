import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();



// public route
router.get('/', getProducts);



// protected route
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);



export default router;
