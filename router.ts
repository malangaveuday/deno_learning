import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getAllProducts,
  getProductById,
  updateProduct,
} from "./controller/v1/products_controller.ts";

const router = new Router();

router.get("/api/v1/products", getAllProducts);
router.get("/api/v1/products/:id", getProductById);
router.put("/api/v1/products/:id", updateProduct);

export default router;
