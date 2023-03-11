import express from "express";
import controller from "../controllers/product.controller";
import { Schemas, ValidateSchema } from "../middleware/validateSchema";
import { ensureAuth } from "../middleware/ensureAuth";
import { isAdmin } from "../middleware/adminStatus";

const router = express.Router();

router.get("/test-product", controller.testProduct);

/**PRIVATE ROUTES */

// CREATE
router.post(
  "/create",
  ensureAuth(),
  isAdmin(),
  ValidateSchema(Schemas.products.create),
  controller.createProduct
);

// EDIT

router.put(
  "/edit/:id",
  ensureAuth(),
  isAdmin(),
  ValidateSchema(Schemas.products.update),
  controller.editProduct
);

// -stock

router.put(
  "/edit/stock/:id",
  ensureAuth(),
  isAdmin(),
  ValidateSchema(Schemas.products.updateStock),
  controller.editStock
);

// DELETE

router.delete("/delete/:id", ensureAuth(), isAdmin(), controller.deleteProduct);

/**PUBLIC ROUTES */

//Get Products

router.get("/show-products", ensureAuth(), controller.getAllProducts);

//--Out of Stock

router.get("/show-outofstock", ensureAuth(), controller.getOutOfStock);

//--GetByNamw

router.post("/search", ensureAuth(), controller.getProductsByName);

export = router;
