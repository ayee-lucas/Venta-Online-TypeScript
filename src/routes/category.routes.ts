import express from "express";
import controller from "../controllers/category.controller";

const router = express.Router();

router.get("/test", controller.ping);

export = router;
