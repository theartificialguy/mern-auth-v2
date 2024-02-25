import express from "express";
const router = express.Router();

import { verifyJWT } from "../middlewares/verify.middleware.js";

import { getAllSentRequestsController } from "../controllers/request.controller.js";

router.use(verifyJWT).get("/sent", getAllSentRequestsController);
