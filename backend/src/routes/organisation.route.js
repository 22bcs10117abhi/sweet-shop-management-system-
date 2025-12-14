import { Router } from "express";
import {  createOrg, getOrgList, getOrgByRegNo, getMyOrganisation, getOrganisationById } from "../controllers/organisation.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/", createOrg);
router.get("/", getOrgList);
router.get("/id/:id", getOrganisationById);
router.get("/my-org", verifyToken, getMyOrganisation);
router.get("/reg-no/:regNo", getOrgByRegNo);

export default router;