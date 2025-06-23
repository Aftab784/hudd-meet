import { Router } from 'express';
import { register, login } from "../controllers/user.controller";
import { asyncHandler } from "../controllers/user.controller"
const router = Router();

router.route("/login").post(asyncHandler(login))
router.route("/register").post(asyncHandler(register))
router.route("/add_to_activity")
router.route("/get_all_activity")

export default router;
