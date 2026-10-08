import { ProductController } from "../controllers/products.controller.ts";
import { Router } from "express";

const router = Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.post('/', productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id', productController.changePriceProduct);

export default router;