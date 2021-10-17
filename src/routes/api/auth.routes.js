import express, { Router } from "express";
import authController from "../../controllers/authController";
import ValidationMiddleware from '../../middlewares/validationMiddleware';
import authMiddleware from "../../middlewares/authMiddleware";
import ifExist from "../../middlewares/ifExist";

const authRouter = express.Router();
const { userEmail } = ifExist;
const { login, signup, reset, updatePassword, updateProfile, confirmation, logout } = authController;
const { hasConfirmed, userExist, isUserAuthInAndVerified } = authMiddleware;
const { signupValMid, loginValMid, resetValMid, updatePasswordValMid, updateProfileValMid } = ValidationMiddleware;

authRouter.post("/login", loginValMid, userExist, hasConfirmed, login);
authRouter.post("/signup", signupValMid, userEmail, signup);
authRouter.get("/confirmation/:token", confirmation);
authRouter.post("/reset", resetValMid, reset);
authRouter.put("/update-password/:token", updatePasswordValMid, updatePassword);
authRouter.put("/update-profile", isUserAuthInAndVerified, updateProfileValMid, updateProfile);
authRouter.get("/logout", isUserAuthInAndVerified, logout);

export default authRouter;
