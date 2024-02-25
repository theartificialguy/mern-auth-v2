import express from "express";
const router = express.Router();

import { upload } from "../config/multer.js";
import { verifyJWT } from "../middlewares/verify.middleware.js";

import {
  sendOTPController,
  loginUserController,
  registerUserController,
  verifyAccountController,
  logoutUserController,
  refreshUserController,
  getAllFriendsController,
  getSearchedUsersController,
} from "../controllers/user.controller.js";

// register :- creates a new user account, sends otp for account verification
router.post("/register", upload.single("avatar"), registerUserController);
// send-otp :- generates a new otp and saves it to current user, later to be verified
router.post("/send-otp", sendOTPController);
// login :- creates access token & refresh token for the user, refresh token is set in cookies
//          as httpOnly, while access token is sent in json response
router.post("/login", loginUserController);
// verify :- verifies otp from previous step & if successful, account is verified
router.post("/verify", verifyAccountController);
// logout :- removes refresh token from cookies
router.post("/logout", logoutUserController);
// refresh :- creates new access token using existing refresh token from cookies.
//            used when access token gets expired after 1 hour
router.post("/refresh", refreshUserController);
// all-friends :- fetches all friends of this user
router.use(verifyJWT).get("/all-friends", getAllFriendsController);
// search-users :- fetches users for provided search query
router.use(verifyJWT).post("/search", getSearchedUsersController);

// At frontend, if refresh token is not found in cookies in any case, redirect to login page.

export default router;
