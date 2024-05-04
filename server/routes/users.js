import express from "express";

import { login, resetPass, sendOtp, signup, verifyUser } from "../controllers/auth.js";
import { getAllUsers, updateProfile } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/reset-password/send-otp",sendOtp);
router.post("/reset-password/verify",verifyUser)
router.patch("/reset-password/update", resetPass);

router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);

export default router;
