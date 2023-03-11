import express from "express";
import controller from "../controllers/receipt.controller";
import { ensureAuth } from "../middleware/ensureAuth";

const router = express.Router();

/** PUBLIC ROUTES */

//Test cart Connection
router.get("/test", controller.ping);

//Buy
router.get("/buy", ensureAuth(), controller.buy);

//Get
router.get("/user_receipt", ensureAuth(), controller.getReceipts);

export = router;
