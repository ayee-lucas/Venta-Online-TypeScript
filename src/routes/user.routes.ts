import express from "express";
import userController from "../controllers/user.controller";

import controller from "../controllers/user.controller";
import { Schemas, ValidateSchema } from "../middleware/validateSchema";
import { ensureAuth } from "../middleware/ensureAuth";

const router = express.Router();

router.post(
  "/create",
  ValidateSchema(Schemas.users.create),
  controller.createUser
);

router.post("/login", ValidateSchema(Schemas.users.login), controller.login);
router.put(
  "/update/:id",
  ensureAuth(),
  ValidateSchema(Schemas.users.update),
  userController.update
);
router.delete("/delete/:id", ensureAuth(), userController.deleteUser);

export = router;
