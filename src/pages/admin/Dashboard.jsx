import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import HomeManagement from "./HomeManagement";
import AboutManagement from "./AboutManagement";
import SkillManagement from "./SkillManagement";
import ProjectManagement from "./ProjectManagement";
import ResumeManagement from "./ResumeManagement";
import NJLogo from "../../assets/NJ.png";
import {
  FiGrid,
  FiHome,
  FiUser,
  FiStar,
  FiFolder,
  FiFileText,
  FiLogOut,
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiBriefcase,
} from "react-icons/fi";

function DashboardIcon({ type = "overview" }) {
  const icons = {
    overview: FiGrid,
    home: FiHome,
    about: FiUser,
    skills: FiStar,
    projects: FiFolder,
    resume: FiFileText,
  };
  const Icon = icons[type] || FiGrid;
  return <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />;
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
  const [skillCount, setSkillCount] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadSkillCount() {
      try {
        const API_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/admin/skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.skills) && isActive) {
          setSkillCount(data.skills.length);
        }
      } catch {
        // Keep the count as unavailable if the skills request fails.
      }
    }

    loadSkillCount();

    return () => {
      isActive = false;
    };
  }, [token]);
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

  const previewCards = [
    {
      label: "Homepage",
      section: "Home",
      icon: "home",
      eyebrow: "INTRODUCTION",
      title: "Your first impression",
      description:
        "Manage the role titles, intro copy, experience, and terminal display name.",
      detail: "Role titles · Hero description",
      accent: "cyan",
    },
    {
      label: "About",
      section: "About",
      icon: "about",
      eyebrow: "PROFILE",
      title: "Your story, clearly told",
      description:
        "Keep your profile image, biography, and personal information cards up to date.",
      detail: "Biography · Profile details",
      accent: "violet",
    },
    {
      label: "Skills",
      section: "Skills",
      icon: "skills",
      eyebrow: "TECH STACK",
      title: "Skills & specialties",
      description:
        "Showcase the technologies and strengths that define your development work.",
      detail: "React · TypeScript · Node.js · Tailwind",
      accent: "emerald",
    },
    {
      label: "Projects",
      section: "Projects",
      icon: "projects",
      eyebrow: "PORTFOLIO WORK",
      title: "Selected projects",
      description:
        "Manage project details, ordering, images, and demo or source links.",
      detail: "6 project entries in your current showcase",
      accent: "amber",
    },
    {
      label: "Resume",
      section: "Resume",
      icon: "resume",
      eyebrow: "CAREER DOCUMENT",
      title: "Resume & downloads",
      description: "Keep the resume PDF visitors can open or download current.",
      detail: "PDF resume · Download access",
      accent: "rose",
    },
  ];
  const accentClasses = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    violet: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  };

  return (
    <main className="min-h-screen bg-[#030609] font-grotesk text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-[22%] h-96 w-96 rounded-full bg-cyan-500/6 blur-[120px]" />
        <div className="absolute right-0 top-[35%] h-80 w-80 rounded-full bg-blue-500/4 blur-[120px]" />
      </div>
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#030609]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-375 items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href="/"
              aria-label="Go to portfolio homepage"
              title="Back to portfolio homepage"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/3 p-1.5 transition hover:border-cyan-300/40 sm:h-11 sm:w-11"
            >
              <img
                src={NJLogo}
                alt="NJ Logo"
                className="h-full w-full object-contain"
              />
            </a>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-tight sm:text-base">
                Portfolio Admin
              </h1>
              <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                Workspace <span className="px-1 text-slate-700">/</span>{" "}
                {section}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/6 px-3 py-1.5 text-xs font-medium text-emerald-300 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems ready
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-400/[0.07] hover:text-rose-200 sm:px-4 sm:text-sm"
            >
              <FiLogOut className="h-4 w-4" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-375 gap-5 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-7 lg:px-8 lg:py-8">
        <aside className="h-fit rounded-2xl border border-white/8 bg-[#080d12]/90 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.18)] lg:sticky lg:top-23">
          <p className="hidden px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 lg:block">
            Workspace menu
          </p>
          <nav
            aria-label="Admin Navigation"
            className="grid grid-cols-3 gap-1 sm:grid-cols-6 lg:flex lg:flex-col"
          >
            {navigation.map((item) => {
              const active = section === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openSection(item.label)}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold transition sm:text-sm lg:justify-start lg:px-3.5 lg:py-3 ${active ? "border border-cyan-300/20 bg-cyan-300/9 text-cyan-200" : "border border-transparent text-slate-500 hover:bg-white/4 hover:text-slate-200"}`}
                >
                  {active && (
                    <span className="absolute bottom-2 left-1 hidden h-5 w-0.5 rounded-full bg-cyan-300 lg:block" />
                  )}
                  <DashboardIcon type={item.icon} />
                  <span className="truncate">{item.shortLabel}</span>
                  {active && (
                    <FiArrowUpRight
                      className="ml-auto hidden h-4 w-4 lg:block"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="mx-2 my-3 hidden border-t border-white/[0.07] lg:block" />
          <div className="hidden rounded-xl bg-white/2.5 p-3 lg:block">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <FiCheckCircle className="h-4 w-4 text-emerald-300" />
              Portfolio workspace
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-600">
              Keep your public portfolio content consistent and up to date.
            </p>
          </div>
        </aside>

        <div className="min-w-0 pb-10">
          {section === "Overview" && (
            <section className="space-y-6 sm:space-y-7">
              <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">
                    YOUR PORTFOLIO, AT A GLANCE
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    Overview<span className="text-cyan-300">.</span>
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    A quick look at the content behind your portfolio. Choose
                    any section to jump straight into editing.
                  </p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/8 bg-white/2.5 px-3 py-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Admin workspace active
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-[#080d12]/90 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Project showcase
                    </span>
                    <span className="rounded-lg border border-amber-300/20 bg-amber-300/8 p-2 text-amber-200">
                      <FiBriefcase className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      06
                    </span>
                    <span className="text-xs text-slate-500">projects</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Selected work and case studies
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#080d12]/90 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Technical strengths
                    </span>
                    <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/8 p-2 text-emerald-200">
                      <FiCode className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      {skillCount === null ? "—" : String(skillCount).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-slate-500">skills</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Technologies and specialties
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#080d12]/90 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Career document
                    </span>
                    <span className="rounded-lg border border-violet-300/20 bg-violet-300/8 p-2 text-violet-200">
                      <FiFileText className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      PDF
                    </span>
                    <span className="text-xs text-slate-500">resume</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Downloadable career profile
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                    Content overview
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    A preview of each portfolio area, with direct access to its
                    editor.
                  </p>
                </div>
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:inline">
                  5 sections
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {previewCards.map((card) => (
                  <button
                    key={card.section}
                    type="button"
                    onClick={() => openSection(card.section)}
                    className="group flex min-w-0 flex-col rounded-2xl border border-white/8 bg-[#080d12]/90 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/16 hover:bg-[#0b1118] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:p-5"
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses[card.accent]}`}
                      >
                        <DashboardIcon type={card.icon} />
                      </span>
                      <span className="rounded-lg border border-white/[0.07] p-2 text-slate-600 transition group-hover:border-cyan-300/20 group-hover:text-cyan-200">
                        <FiArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-[9px] font-bold tracking-[0.2em] text-slate-600">
                      {card.eyebrow}
                    </p>
                    <h4 className="mt-1.5 text-base font-bold text-white sm:text-lg">
                      {card.title}
                    </h4>
                    <p className="mt-2 flex-1 text-xs leading-6 text-slate-500 sm:text-sm">
                      {card.description}
                    </p>
                    {card.section === "Skills" && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {["React", "TypeScript", "Tailwind", "Node.js"].map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-md border border-white/8 bg-white/2.5 px-2 py-1 text-[10px] text-slate-400"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                    {card.section === "Home" && (
                      <div className="mt-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2 text-xs text-slate-400">
                        Front-End Developer{" "}
                        <span className="text-cyan-300">/</span> React Developer
                      </div>
                    )}
                    {card.section === "About" && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-md bg-white/4 px-2 py-1 text-[10px] text-slate-400">
                          Biography
                        </span>
                        <span className="rounded-md bg-white/4 px-2 py-1 text-[10px] text-slate-400">
                          Profile details
                        </span>
                      </div>
                    )}
                    <div className="mt-4 flex w-full items-center justify-between border-t border-white/[0.07] pt-3">
                      <span className="text-[11px] font-medium text-slate-500">
                        {card.detail}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-cyan-200">
                        Edit{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
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