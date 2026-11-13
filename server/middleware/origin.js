const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "https://nickshanjportfolio.netlify.app",
]);

const SAFE_METHODS = new Set([
  "GET",
  "HEAD",
  "OPTIONS",
]);

export function requireSameOrigin(req, res, next) {
  // Allow requests that do not modify server data.
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const origin = req.get("Origin");

  // Reject requests without an approved Origin.
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({
      success: false,
      message: "Request origin not allowed",
    });
  }

  next();
}