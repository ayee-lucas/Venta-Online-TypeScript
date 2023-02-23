import express from "express";

import controller from "../controllers/user.controller";

const router = express.Router();

router.post("/create", controller.createUser);

export = router;
