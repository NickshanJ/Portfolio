import { useState } from "react";
import PropTypes from "prop-types";
import HomeManagement from "./HomeManagement";
import AboutManagement from "./AboutManagement";
import SkillManagement from "./SkillManagement";
import ProjectManagement from "./ProjectManagement";
import ResumeManagement from "./ResumeManagement";

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 sm:h-6 sm:w-6"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <rect x="9" y="10" width="6" height="5" rx="1" />
      <path d="M10 10V8a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

function DashboardIcon({ type = "overview" }) {
  if (type === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        aria-hidden="true"
      >
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-7h6v7" />
      </svg>
    );
  }

  if (type === "about") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (type === "skills") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        aria-hidden="true"
      >
        <path d="m12 3 2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    );
  }

  if (type === "projects") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18M9 4v16" />
      </svg>
    );
  }

  if (type === "resume") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

DashboardIcon.propTypes = {
  type: PropTypes.oneOf([
    "overview",
    "home",
    "about",
    "skills",
    "projects",
    "resume",
  ]),
};

export default function Dashboard({ token, onLogout }) {
  const [section, setSection] = useState("Overview");

  const navigation = [
    { label: "Overview", icon: "overview", shortLabel: "Overview" },
    { label: "Home", icon: "home", shortLabel: "Home" },
    { label: "About", icon: "about", shortLabel: "About" },
    { label: "Skills", icon: "skills", shortLabel: "Skills" },
    { label: "Projects", icon: "projects", shortLabel: "Projects" },
    { label: "Resume", icon: "resume", shortLabel: "Resume" },
  ];

  function openSection(label) {
    setSection(label);
  }

  return (
    <main className="min-h-screen bg-[#030609] font-grotesk text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#030609]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3.5 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan sm:h-10 sm:w-10">
              <ShieldIcon />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xs font-bold sm:text-base">
                Portfolio Admin
              </h1>
              <p className="text-[10px] text-slate-500 sm:text-xs">
                Management dashboard
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Administrator
            </span>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-sm"
            >
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
        {/* Navigation Sidebar (Desktop) / High-visibility Segmented Tab Bar (Mobile) */}
        <aside className="mb-4 h-fit rounded-2xl border border-white/10 bg-[#080d12] p-1.5 sm:p-2 lg:mb-0 lg:p-3">
          <p className="hidden px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 lg:block">
            Navigation
          </p>

          <nav
            aria-label="Admin Navigation"
            className="grid grid-cols-3 gap-1 sm:grid-cols-3 sm:gap-2 lg:flex lg:flex-col"
          >
            {navigation.map((item) => {
              const active = section === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openSection(item.label)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11.5 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-center text-xs font-semibold transition active:scale-[0.98] sm:min-h-12 sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-sm lg:min-h-0 lg:w-full lg:justify-start lg:px-3 lg:py-3 lg:text-left ${
                    active
                      ? "border border-cyan/40 bg-cyan/15 font-bold text-cyan shadow-sm shadow-cyan/10"
                      : "border border-transparent text-slate-400 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  <DashboardIcon type={item.icon} />
                  <span className="truncate">
                    {/* Concise text on mobile to ensure zero overflow */}
                    <span className="lg:hidden">{item.shortLabel}</span>
                    {/* Full text on desktop sidebar */}
                    <span className="hidden lg:inline">
                      {item.label === "Resume"
                        ? "Resume Management"
                        : item.label === "Projects"
                          ? "Project Management"
                          : item.label === "Skills"
                            ? "Skill Management"
                            : item.label === "About"
                              ? "About Management"
                              : item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Body */}
        <div className="min-w-0 pb-12 sm:pb-8">
          {section === "Overview" && (
            <section className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan sm:text-xs">
                  Welcome back
                </p>
                <h2 className="mt-1 text-xl font-bold text-white sm:text-3xl">
                  Overview
                </h2>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Quick access to manage your portfolio showcase and resume.
                </p>
              </div>

              {/* Action Cards: 1 column on mobile, 2 columns on tablet/desktop */}
              <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => openSection("Home")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d12] p-4.5 text-left transition hover:border-cyan/40 hover:bg-cyan/3 active:scale-[0.99] sm:p-6"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                      <DashboardIcon type="home" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                      Home Management
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      Edit animated roles, homepage description, experience
                      years, and terminal display name.
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan transition group-hover:translate-x-1 sm:mt-5 sm:text-sm">
                    <span>Manage Home page</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openSection("Projects")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d12] p-4.5 text-left transition hover:border-cyan/40 hover:bg-cyan/3 active:scale-[0.99] sm:p-6"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                      <DashboardIcon type="projects" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                      Project Management
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      Create, edit, reorder, or publish portfolio projects with
                      custom live demo and code links.
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan transition group-hover:translate-x-1 sm:mt-5 sm:text-sm">
                    <span>Manage projects</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openSection("Resume")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d12] p-4.5 text-left transition hover:border-cyan/40 hover:bg-cyan/3 active:scale-[0.99] sm:p-6"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                      <DashboardIcon type="resume" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                      Resume Management
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      Upload or replace the PDF resume available to potential
                      recruiters and clients on your site.
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan transition group-hover:translate-x-1 sm:mt-5 sm:text-sm">
                    <span>Manage resume</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openSection("Skills")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d12] p-4.5 text-left transition hover:border-cyan/40 hover:bg-cyan/3 active:scale-[0.99] sm:p-6"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                      <DashboardIcon type="skills" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                      Skill Management
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      Add, edit, organize, and publish the technical skills
                      displayed on your portfolio.
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan transition group-hover:translate-x-1 sm:mt-5 sm:text-sm">
                    <span>Manage skills</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openSection("About")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#080d12] p-4.5 text-left transition hover:border-cyan/40 hover:bg-cyan/3 active:scale-[0.99] sm:p-6"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                      <DashboardIcon type="about" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                      About Management
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      Update your profile image, biography paragraphs, and
                      personal information cards.
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan transition group-hover:translate-x-1 sm:mt-5 sm:text-sm">
                    <span>Manage About page</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
              </div>
            </section>
          )}

          {section === "Home" && <HomeManagement token={token} />}
          {section === "About" && <AboutManagement token={token} />}
          {section === "Skills" && <SkillManagement token={token} />}
          {section === "Projects" && <ProjectManagement token={token} />}
          {section === "Resume" && <ResumeManagement token={token} />}
        </div>
      </div>
    </main>
  );
}

Dashboard.propTypes = {
  token: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};
