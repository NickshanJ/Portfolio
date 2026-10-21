import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DEFAULT_HOME = {
  roleTitles: [
    "Front-End Developer",
    "MERN Full Stack Developer",
    "React Developer",
  ],
  description:
    "Passionate about building performant, pixel-perfect web apps. From clean UIs to robust back-end systems — I bring ideas to life with modern technologies.",
  experienceYears: 2,
  terminalName: "J. Nickshan",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#030609] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/10";

const labelClass = "text-sm font-semibold text-slate-200";

export default function HomeManagement({ token }) {
  const [form, setForm] = useState(DEFAULT_HOME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const loadHomeSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    

    try {
      const response = await fetch(`${API_URL}/api/settings/home`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load Home settings.");
      }

      const home = data.home || {};

      setForm({
        roleTitles:
          Array.isArray(home.roleTitles) && home.roleTitles.length > 0
            ? home.roleTitles
            : DEFAULT_HOME.roleTitles,
        description: home.description ?? DEFAULT_HOME.description,
        experienceYears: home.experienceYears ?? DEFAULT_HOME.experienceYears,
        terminalName: home.terminalName ?? DEFAULT_HOME.terminalName,
      });
    } catch (err) {
      setError(err.message || "Unable to load Home settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeSettings();
  }, [loadHomeSettings]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "experienceYears" ? value : value,
    }));

    
  }

  function updateRole(index, value) {
    setForm((current) => ({
      ...current,
      roleTitles: current.roleTitles.map((role, roleIndex) =>
        roleIndex === index ? value : role,
      ),
    }));

    
  }

  function addRole() {
    setForm((current) => ({
      ...current,
      roleTitles: [...current.roleTitles, ""],
    }));

    
  }

  function removeRole(index) {
    setForm((current) => ({
      ...current,
      roleTitles: current.roleTitles.filter(
        (_, roleIndex) => roleIndex !== index,
      ),
    }));

    
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    

    const roleTitles = form.roleTitles.map((role) => role.trim());

    if (roleTitles.length === 0 || roleTitles.some((role) => !role)) {
      setError("Add at least one role title and complete every role field.");
      setSaving(false);
      return;
    }

    if (!form.description.trim()) {
      setError("Home description cannot be empty.");
      setSaving(false);
      return;
    }

    if (!form.terminalName.trim()) {
      setError("Terminal name cannot be empty.");
      setSaving(false);
      return;
    }

    const experienceYears = Number(form.experienceYears);

    if (
      !Number.isInteger(experienceYears) ||
      experienceYears < 0 ||
      form.experienceYears === ""
    ) {
      setError("Experience years must be a whole number of 0 or more.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/settings/admin/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roleTitles,
          description: form.description.trim(),
          experienceYears,
          terminalName: form.terminalName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save Home settings.");
      }

      const savedHome = data.home || {};

      setForm({
        roleTitles: savedHome.roleTitles || roleTitles,
        description: savedHome.description ?? form.description.trim(),
        experienceYears: savedHome.experienceYears ?? experienceYears,
        terminalName: savedHome.terminalName ?? form.terminalName.trim(),
      });

      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.message || "Unable to save Home settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">
          Management
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Home Management
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Manage the role animation, introduction, experience years, and
          terminal name displayed on your homepage.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12] p-6 text-sm text-slate-400">
          Loading Home settings...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-[#080d12] p-4 sm:p-6"
        >
          {/* Animated role titles */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className={labelClass}>Animated Role Titles</label>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add the roles you want to cycle through on the homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={addRole}
                className="rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-2 text-xs font-semibold text-cyan transition hover:bg-cyan/20"
              >
                + Add Role
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {form.roleTitles.map((role, index) => (
                <div key={index} className="flex min-w-0 items-center gap-2">
                  <span className="w-6 shrink-0 text-xs text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <input
                    type="text"
                    value={role}
                    onChange={(event) => updateRole(index, event.target.value)}
                    placeholder="e.g. Front-End Developer"
                    aria-label={`Role title ${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#030609] px-3 py-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-cyan/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeRole(index)}
                    disabled={form.roleTitles.length === 1}
                    aria-label={`Remove role ${index + 1}`}
                    title={
                      form.roleTitles.length === 1
                        ? "At least one role is required"
                        : "Remove role"
                    }
                    className="shrink-0 rounded-lg border border-red-400/20 px-3 py-3 text-xs font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/8" />

          {/* Homepage description */}
          <div>
            <label htmlFor="home-description" className={labelClass}>
              Home Description
            </label>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              The introduction paragraph displayed beneath your animated role.
            </p>

            <textarea
              id="home-description"
              name="description"
              value={form.description}
              onChange={updateField}
              rows={4}
              maxLength={1000}
              placeholder="Write your homepage introduction..."
              className={inputClass}
              required
            />

            <p className="mt-1 text-right text-xs text-slate-500">
              {form.description.length}/1000 characters
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Experience years */}
            <div>
              <label htmlFor="experienceYears" className={labelClass}>
                Years of Experience / Learning
              </label>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Enter a whole number. This value is managed manually.
              </p>

              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                step="1"
                value={form.experienceYears}
                onChange={updateField}
                className={inputClass}
                required
              />
            </div>

            {/* Terminal name */}
            <div>
              <label htmlFor="terminalName" className={labelClass}>
                Terminal Display Name
              </label>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Changes the name shown in the terminal section.
              </p>

              <input
                id="terminalName"
                name="terminalName"
                type="text"
                value={form.terminalName}
                onChange={updateField}
                maxLength={100}
                placeholder="J. Nickshan"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5">
            <p className="text-xs leading-5 text-slate-500">
              Changes are saved to your portfolio database.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#38e2f7] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Home Settings"}
            </button>
          </div>
        </form>
      )}
      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        title="Home Settings Updated Successfully"
        message="Your homepage settings have been saved successfully. Your role titles, description, experience years, and terminal name are now updated."
        confirmText="Done"
        cancelText="Close"
        variant="success"
        onConfirm={() => setIsSuccessModalOpen(false)}
        onCancel={() => setIsSuccessModalOpen(false)}
      />
    </section>
  );
}

HomeManagement.propTypes = {
  token: PropTypes.string.isRequired,
};
