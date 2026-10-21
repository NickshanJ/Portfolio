import { useEffect, useState } from "react";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "portfolio_admin_token";

export default function Admin() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restore and validate an existing admin session.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const savedToken = sessionStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        if (!cancelled) {
          setCheckingSession(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/admin/projects`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          sessionStorage.removeItem(TOKEN_KEY);

          if (!cancelled) {
            setToken("");
          }
        } else if (!cancelled) {
          setToken(savedToken);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to verify your session. Check that the backend is running.",
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

  // Authenticate and verify access before opening the dashboard.
  async function handleLogin({ username, password }) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.message || "Invalid username or password.");
      }

      const savedToken = data.token;

      const verificationResponse = await fetch(
        `${API_URL}/api/admin/projects`,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        },
      );

      if (!verificationResponse.ok) {
        throw new Error(
          "Login succeeded, but admin access could not be verified. Please try again.",
        );
      }

      sessionStorage.setItem(TOKEN_KEY, savedToken);
      setToken(savedToken);
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Clear the session and return to the login screen.
  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setError("");
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030609] px-4 font-grotesk text-white">
        <p className="text-sm text-slate-400">Checking admin session...</p>
      </main>
    );
  }

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} loading={loading} error={error} />;
}
