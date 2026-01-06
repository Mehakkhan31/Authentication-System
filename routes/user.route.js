import express from "express"
import { forgotPassword, getMe, login, logoutUser, registerUser, resetPassword, verifyUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", isLoggedIn, login);
router.get("/me", getMe);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;