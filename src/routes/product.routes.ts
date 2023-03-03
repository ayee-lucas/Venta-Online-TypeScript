import express from "express";
import controller from "../controllers/product.controller";
import { Schemas, ValidateSchema } from "../middleware/validateSchema";
import { ensureAuth } from "../middleware/ensureAuth";

const router = express.Router();

router.get("/test-product", controller.testProduct);
router.post("/create", controller.createProduct);

export = router;
