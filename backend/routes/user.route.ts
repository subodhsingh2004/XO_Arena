import { Router } from "express";
import { checkUniqueUsername, login, logout, signUp } from "../controllers/user.controller.js";


const router = Router();

// Route for checking unique username
router.route("/check-unique-username").get(checkUniqueUsername);
router.route("/sign-up").post(signUp)
router.route("/login").post(login)
router.route("/logout").post(logout)

export default router;