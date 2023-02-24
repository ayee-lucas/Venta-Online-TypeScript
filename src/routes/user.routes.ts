import express from "express";

import controller from "../controllers/user.controller";
import { Schemas, ValidateSchema } from "../middleware/validateSchema";

const router = express.Router();

router.post(
  "/create",
  ValidateSchema(Schemas.users.create),
  controller.createUser
);

router.put("/update", ValidateSchema(Schemas.users.login), controller.login);

export = router;
