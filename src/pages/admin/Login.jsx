import { useState } from "react";
import PropTypes from "prop-types";

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <rect x="9" y="10" width="6" height="5" rx="1" />
      <path d="M10 10V8a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-2a7 7 0 0 1 14 0v2Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function Login({ onLogin, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ username: username.trim(), password });
  }

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030609] px-4 py-10 font-grotesk text-white sm:px-6"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 48%, rgba(0,212,255,0.10), transparent 38%), radial-gradient(rgba(0,212,255,0.10) 0.7px, transparent 0.7px)",
        backgroundSize: "100% 100%, 28px 28px",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-110 w-110 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-[100px] sm:h-155 sm:w-155"
      />

      <div className="relative z-10 my-auto w-full max-w-142">
        <section className="relative w-full rounded-[22px] border border-cyan/30 bg-[#080d12]/95 px-5 pb-6 pt-8 shadow-[0_0_60px_rgba(0,212,255,0.07)] sm:px-8 sm:pb-7 sm:pt-8">
          <div className="mx-auto mb-5 flex h-18 w-18 shrink-0 items-center justify-center rounded-[18px] border border-cyan/40 bg-cyan/[0.07] text-cyan shadow-[0_0_30px_rgba(0,212,255,0.08)] sm:h-19 sm:w-19">
            <ShieldIcon />
          </div>

          <header className="mb-7 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan sm:text-xs sm:tracking-[0.35em]">
              Portfolio Management
            </p>
            <h1 className="text-[27px] font-bold leading-tight tracking-tight text-white sm:text-[36px]">
              Welcome back, <span className="text-cyan">Admin</span>
            </h1>
            <p className="mx-auto mt-3 max-w-92.5 text-sm leading-6 text-slate-400 sm:text-[15px]">
              Sign in to manage your portfolio projects and resume.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4"
            style={{ colorScheme: "dark" }}
          >
            <div className="w-full">
              <label
                htmlFor="admin-username"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Username
              </label>
              <div className="relative w-full">
                <span className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center text-slate-400">
                  <UserIcon />
                </span>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  required
                  className="block h-12 w-full min-w-0 appearance-none rounded-xl border bg-[#060a0e] px-4 py-0 pl-13 text-sm font-normal leading-normal text-white shadow-none outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10"
                  style={{ WebkitTextFillColor: "#ffffff" }}
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <div className="relative w-full">
                <span className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center text-slate-400">
                  <LockIcon />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="block h-12 w-full min-w-0 appearance-none rounded-xl border bg-[#060a0e] px-4 py-0 pl-13 text-sm font-normal leading-normal text-white shadow-none outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/10"
                  style={{ WebkitTextFillColor: "#ffffff" }}
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-sm leading-5 text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-cyan bg-cyan px-5 py-0 text-sm font-bold leading-normal text-slate-950 shadow-[0_5px_25px_rgba(0,212,255,0.15)] transition duration-300 hover:bg-[#38e2f7] hover:shadow-[0_5px_35px_rgba(0,212,255,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Sign in to dashboard"}</span>
              {!loading && <ArrowIcon />}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-white/8" />
            <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-slate-600">
              Secure access
            </span>
            <span className="h-px flex-1 bg-white/8" />
          </div>
        </section>

        <a
          href="/"
          className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400 no-underline transition-colors hover:text-cyan"
        >
          <span aria-hidden="true" className="text-lg">
            ←
          </span>
          Back to portfolio
        </a>

        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.12em] text-slate-600">
          Portfolio Administration
        </p>
      </div>
    </main>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};
