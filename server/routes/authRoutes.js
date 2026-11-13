import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { rateLimit } from "express-rate-limit";
import AdminSession from "../models/AdminSession.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireSameOrigin } from "../middleware/origin.js";

const router = express.Router();

const COOKIE_NAME = "portfolio_admin_session";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict",
  path: "/",
  maxAge: 2 * 60 * 60 * 1000,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

router.post("/login", requireSameOrigin, loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    if (
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    const usernameMatches = username === process.env.ADMIN_USERNAME;

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH,
    );

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate a unique ID for this login session.
    const jti = crypto.randomUUID();

    // Set session expiration to 2 hours.
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Save the session in MongoDB.
    await AdminSession.create({
      jti,
      username: process.env.ADMIN_USERNAME,
      expiresAt,
    });

    // Generate JWT containing the session ID.
    const token = jwt.sign(
      {
        username: process.env.ADMIN_USERNAME,
        role: "admin",
        jti,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    // Store JWT in an HttpOnly cookie.
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.json({
      success: true,
      message: "Login successful",
      expiresIn: 7200,
    });
  } catch (error) {
    console.error("Admin login failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
});

// Admin logout — revoke the current session and clear the cookie.
router.post("/logout", requireSameOrigin, requireAdmin, async (req, res) => {
  try {
    await AdminSession.updateOne(
      {
        jti: req.admin.sessionId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );

    res.clearCookie(COOKIE_NAME, {
      ...getCookieOptions(),
      maxAge: undefined,
    });

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Admin logout failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log out",
    });
  }
});

export default router;
