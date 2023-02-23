import express from "express";

import controller from "../controllers/user.controller";
import { ValidateSchema } from "../library/validateSchema";

const router = express.Router();

router.post("/create", /* ValidateSchema(Schemas) */ controller.createUser);

export = router;
