import jwt from "jsonwebtoken";
import AdminSession from "../models/AdminSession.js";

const COOKIE_NAME = "portfolio_admin_session";

export async function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    // Verify JWT signature and expiration.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.role !== "admin" ||
      !decoded.username ||
      !decoded.jti
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Verify that this login session exists and is still active.
    const session = await AdminSession.findOne({
      jti: decoded.jti,
      username: decoded.username,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked. Please log in again.",
      });
    }

    req.admin = {
      username: decoded.username,
      role: decoded.role,
      sessionId: decoded.jti,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    console.error("Admin authentication error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify admin session",
    });
  }
}