import express from "express";
import controller from "../controllers/cart.controller";
import { ensureAuth } from "../middleware/ensureAuth";
import { Schemas, ValidateSchema } from "../middleware/validateSchema";

const router = express.Router();

//Test cart Connection
router.get("/test", controller.ping);

//CREATE

router.post("/added_cart/:id", ensureAuth(), controller.cart);

//GET

//-- show cart
router.get("/show-Cart", ensureAuth(), controller.getCart);

//DELETE

//-- delete cart

router.delete("/delete-Cart", ensureAuth(), controller.deleteCart);

export = router;
