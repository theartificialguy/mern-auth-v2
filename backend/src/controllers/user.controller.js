import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendMail } from "../utils/EmailService.js";

export const sendOTPController = async (req, res, next) => {
  // when user is not verified on login
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError(401, "Email must be provided");
    }

    // get user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // generate otp
    const otp = generateOTP();

    // save new otp
    user.otp = otp;
    await user.save();

    // send otp to user
    const content = `Your OTP is ${otp}`;
    await sendMail(user.email, content);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const verifyAccountController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      throw new AppError(401, "Please provide necessary information");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.otp !== otp) {
      throw new AppError(401, "Invalid OTP");
    }

    // verify user
    user.otp = "";
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(401, "Email and Password must be provided");
    }

    // check for exisiting user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new AppError(404, `User not found`);
    }

    // check password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      throw new AppError(401, "Invalid password");
    }

    // create jwt token payload
    const tokenPayload = {
      email: existingUser.email,
      avatar: existingUser.avatar,
      username: existingUser.username,
      isVerified: existingUser.isVerified,
    };

    // create jwt tokens - access token & refresh token
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // save refresh token with current user
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    // creates secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // None for prod server
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const registerUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new AppError(401, "Please provide necessary input fields");
    }

    const file = req.file;
    if (!file || !file?.path) {
      throw new AppError(401, "Please provide an avatar");
    }

    // check for exisiting user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      throw new AppError(409, `User with email ${email} already exists`);
    }

    let avatarUrl = "";
    // upload avatar to cloudinary storage
    await cloudinary.uploader.upload(
      file.path,
      {
        folder: "avatars",
        type: "upload",
        resource_type: "image",
        access_mode: "authenticated",
      },
      (error, result) => {
        if (error) {
          throw new AppError(error.http_code, error.message);
        }
        avatarUrl = result.secure_url;
      }
    );

    // create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = {
      email: email,
      avatar: avatarUrl,
      username: username,
      password: hashedPassword,
    };

    // generate new OTP
    const otp = generateOTP();
    newUser.otp = otp;

    // update/create user
    if (existingUser) {
      await User.updateOne({ email: existingUser.email }, newUser);
    } else {
      await User.create(newUser);
    }

    // send otp email
    const content = `Your OTP is ${otp}`;
    await sendMail(newUser.email, content);

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      throw new AppError(204, "Token not found");
    }

    const refreshToken = req.cookies.jwt;

    const existingUser = await User.findOne({ refreshToken });
    if (!existingUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      throw new AppError(204, "User not found");
    }

    existingUser.refreshToken = "";
    await existingUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const refreshUserController = async (req, res, next) => {
  // create new access token using existing refresh token from cookie
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      throw new AppError(401, "Token not found");
    }

    const refreshToken = req.cookies.jwt;
    const existingUser = await User.findOne({ refreshToken });
    if (!existingUser) {
      throw new AppError(403, "Forbidden");
    }

    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || existingUser.username !== decoded.username) {
          throw new AppError(403, "Forbidden");
        }
        const tokenPayload = {
          email: existingUser.email,
          avatar: existingUser.avatar,
          username: existingUser.username,
          isVerified: existingUser.isVerified,
        };
        const accessToken = jwt.sign(
          tokenPayload,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          accessToken,
          message: "Refresh successful",
        });
      }
    );
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const getAllFriendsController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.email) {
      throw new AppError(403, "Forbidden");
    }

    const userData = await User.findOne({ email: user.email });
    if (!userData) {
      throw new AppError(404, "User not found");
    }

    const friends = userData.friends;

    return res.status(200).json({ data: friends });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};

export const getSearchedUsersController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.email) {
      throw new AppError(403, "Forbidden");
    }

    const { searchQuery } = req.body;

    const exisitingUser = await User.findOne({ email: user.email });
    if (!exisitingUser) {
      throw new AppError(404, "User not found");
    }

    const users = await User.find({
      // regexp to perform case-insensitive search on 'username'
      username: new RegExp(searchQuery, "i"), // { $regex: searchQuery, $options: "i" }
    });

    return res.status(200).json({ data: users });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};
