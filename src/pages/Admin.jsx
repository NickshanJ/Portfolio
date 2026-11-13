import { useEffect, useState } from "react";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import { adminFetch, setUnauthorizedHandler } from "../utils/api";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Admin() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle expired or invalid admin sessions globally.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthenticated(false);
      setError("Your admin session has expired. Please log in again.");
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  // Restore and validate an existing admin session using the cookie.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await adminFetch(
          `${API_URL}/api/admin/projects`
        );

        if (response.status === 401 || response.status === 403) {
          if (!cancelled) {
            setAuthenticated(false);
            setError("Your admin session has expired. Please log in again.");
          }
        } else if (response.ok) {
          if (!cancelled) {
            setAuthenticated(true);
            setError("");
          }
        } else {
          if (!cancelled) {
            setError("Unable to verify your session. Please try again later.");
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to verify your session. Check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Authenticate using the HttpOnly cookie.
  async function handleLogin({ username, password }) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid username or password.");
      }

      // Verify that the browser can use the newly issued cookie.
      const verificationResponse = await adminFetch(
        `${API_URL}/api/admin/projects`
      );

      if (!verificationResponse.ok) {
        throw new Error(
          "Login succeeded, but admin access could not be verified. Please try again."
        );
      }

      setAuthenticated(true);
      setError("");
    } catch (err) {
      setAuthenticated(false);
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Revoke the backend session and clear the HttpOnly cookie.
  async function handleLogout() {
    try {
      const response = await adminFetch(
        `${API_URL}/api/auth/logout`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Server logout failed");
      }

      setAuthenticated(false);
      setError("");
    } catch (error) {
      console.error("Logout failed:", error);
      setError(
        "Unable to log out. Please check your connection and try again."
      );
    }
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030609] px-4 font-grotesk text-white">
        <p className="text-sm text-slate-400">
          Checking admin session...
        </p>
      </main>
    );
  }

  if (authenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <Login
      onLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
}