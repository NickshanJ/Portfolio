import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

const LEGACY_ICON_MAP = {
  FaReact: "simple-icons:react", FaNodeJs: "simple-icons:nodedotjs",
  FaHtml5: "simple-icons:html5", FaCss3Alt: "simple-icons:css3", FaGithub: "simple-icons:github",
  SiJavascript: "simple-icons:javascript", SiTypescript: "simple-icons:typescript",
  SiTailwindcss: "simple-icons:tailwindcss", SiExpress: "simple-icons:express",
  SiMongodb: "simple-icons:mongodb", SiPostman: "simple-icons:postman",
  SiNetlify: "simple-icons:netlify", SiRender: "simple-icons:render", SiAmazons3: "simple-icons:amazonaws",
};
const SIMPLE_ICON_ALIASES = { html: "html5", css: "css3", js: "javascript", tailwind: "tailwindcss", node: "nodedotjs", nodejs: "nodedotjs", expressjs: "express", postgres: "postgresql", aws: "amazonaws", amazonaws: "amazonaws", python: "python", mysql: "mysql", react: "react", javascript: "javascript", typescript: "typescript", mongodb: "mongodb", docker: "docker", git: "git", github: "github", java: "java", php: "php", firebase: "firebase", figma: "figma", wordpress: "wordpress", canva: "canva" };
function normalizeIconIdentifier(icon) {
  const raw = String(icon || "").trim();
  if (!raw) return "";
  if (LEGACY_ICON_MAP[raw]) return LEGACY_ICON_MAP[raw];
  if (raw.includes(":")) return raw.toLowerCase();
  const slug = raw.toLowerCase().replace(/\s+/g, "-");
  return `simple-icons:${SIMPLE_ICON_ALIASES[slug] || slug}`;
}
function iconUrl(icon) {
  const id = normalizeIconIdentifier(icon);
  const match = id.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
  if (!match) return null;
  // Keep the source URL independent of the selected color. CSS applies color,
  // so changing the color never triggers a new icon request.
  return `https://api.iconify.design/${match[1]}/${match[2]}.svg`;
}

function IconPreview({ icon, color, size = 30 }) {
  const src = iconUrl(icon);
  const [failedSrc, setFailedSrc] = useState("");

  // Track failure per URL. If the color changes, a failure from the previous
  // image cannot accidentally hide the new preview.
  const failed = Boolean(src && failedSrc === src);

  if (!src || failed) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white/5 font-bold text-slate-400"
        style={{ width: size, height: size }}
        aria-label="Icon preview unavailable"
        title="Icon preview unavailable"
      >
        {String(icon || "?").trim().slice(0, 1).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <span
      key={src}
      className="inline-block shrink-0"
      role="img"
      aria-label={`${String(icon || "Skill").trim()} icon preview`}
      style={{
        width: size,
        height: size,
        backgroundColor: color || "#61DAFB",
        WebkitMask: `url("${src}") center / contain no-repeat`,
        mask: `url("${src}") center / contain no-repeat`,
      }}
    >
      <img src={src} alt="" width={size} height={size} onError={() => setFailedSrc(src)} style={{ display: "none" }} />
    </span>
  );
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const emptyForm = {
  name: "",
  icon: "",
  color: "#61DAFB",
  order: 1,
  published: true,
};

export default function SkillManagement({ token }) {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [modal, setModal] = useState(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load skills.");
      }

      setSkills(Array.isArray(data.skills) ? data.skills : []);
    } catch (err) {
      setError(err.message || "Unable to load skills.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  function startAdd() {
    const nextOrder =
      skills.length > 0
        ? Math.max(...skills.map((skill) => Number(skill.order) || 0)) + 1
        : 1;

    setEditingId(null);
    setForm({
      ...emptyForm,
      order: nextOrder,
    });
    setError("");
    setShowForm(true);
  }

  function startEdit(skill) {
    setEditingId(skill._id);
    setForm({
      name: skill.name || "",
      icon: skill.icon || "",
      color: skill.color || "#61DAFB",
      order: skill.order ?? 1,
      published: skill.published ?? true,
    });
    setError("");
    setShowForm(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.name.trim()) throw new Error("Please enter a skill name.");
      if (!form.icon.trim()) throw new Error("Please enter an icon name or Iconify identifier.");
      if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(form.color)) throw new Error("Please choose a valid 3- or 6-digit hexadecimal color.");
      if (!Number.isInteger(Number(form.order)) || Number(form.order) < 0) throw new Error("Display order must be a non-negative whole number.");
      const payload = {
        name: form.name.trim(),
        icon: normalizeIconIdentifier(form.icon),
        color: form.color,
        order: Number(form.order),
        published: form.published,
      };

      const response = await fetch(
        editingId
          ? `${API_URL}/api/admin/skills/${editingId}`
          : `${API_URL}/api/admin/skills`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save skill.");
      }

      const wasEditing = Boolean(editingId);
      const skillName = payload.name;

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await loadSkills();

      setModal({
        title: wasEditing ? "Skill Updated!" : "Skill Added!",
        message: wasEditing
          ? `"${skillName}" was updated successfully.`
          : `"${skillName}" was added successfully.`,
        variant: "success",
        confirmText: "OK",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to save skill.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    const skill = pendingDelete;
    setDeletingId(skill._id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/skills/${skill._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete skill.");
      }

      setSkills((current) => current.filter((item) => item._id !== skill._id));

      setPendingDelete(null);

      setModal({
        title: "Skill Deleted!",
        message: `"${skill.name}" was deleted successfully.`,
        variant: "success",
        confirmText: "OK",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to delete skill.");
      setModal(null);
      setPendingDelete(null);
    } finally {
      setDeletingId("");
    }
  }

  function closeModal() {
    if (deletingId) return;
    setModal(null);
    setPendingDelete(null);
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan sm:text-xs">
            Management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-3xl">
            Skill Management
          </h2>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Add, edit, and control the skills displayed on your portfolio.
          </p>
          {!loading && <p className="mt-2 text-xs text-slate-500">{skills.length} total · {skills.filter((skill) => skill.published).length} published · {skills.filter((skill) => !skill.published).length} drafts</p>}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[#38e2f7] sm:w-auto"
          >
            <span className="text-lg">+</span>
            Add Skill
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300"
        >
          {error}
          <button
            type="button"
            onClick={loadSkills}
            className="ml-3 font-semibold text-white underline"
          >
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-[#080d12] p-4 sm:p-6 lg:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">
              {editingId ? "Edit Skill" : "Add Skill"}
            </h3>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError("");
              }}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Skill name *</span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                maxLength={80}
                placeholder="e.g. React"
                className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </label>

            <div className="space-y-1.5 text-sm text-slate-300">
              <label htmlFor="skill-icon-input" className="block">Icon name or Iconify identifier *</label>
              <div className="flex items-stretch gap-3">
                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#060a0e] px-3 focus-within:ring-1 focus-within:ring-cyan">
                  <input
                    id="skill-icon-input"
                    name="icon"
                    value={form.icon}
                    onChange={updateField}
                    required
                    maxLength={100}
                    placeholder="e.g. mysql or logos:docker"
                    className="min-w-0 w-full bg-transparent py-3 text-sm text-white outline-none"
                  />
                </div>
                <div className="flex w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-[#060a0e] px-2 py-2" title="Live icon preview">
                  <IconPreview icon={form.icon} color={form.color} size={30} />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">Preview</span>
                </div>
              </div>
              <span className="block text-xs leading-5 text-slate-500">
                Type a short name such as <code className="text-slate-300">mysql</code>, <code className="text-slate-300">python</code>, or <code className="text-slate-300">react</code>. You can also enter a full ID such as <code className="text-slate-300">logos:docker</code>. Preview updates as you type.
              </span>
              {form.icon.trim() && (
                <span className="block break-all text-[11px] text-slate-500">Saved as: {normalizeIconIdentifier(form.icon)}</span>
              )}
            </div>

            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Brand color</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#060a0e] px-3">
                <input
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={updateField}
                  className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                />
                <span className="text-sm text-slate-300">{form.color}</span>
              </div>
            </label>

            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Display order</span>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={updateField}
                min="0"
                step="1"
                required
                className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={updateField}
              className="h-4 w-4 accent-cyan"
            />
            Publish this skill on my portfolio
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#38e2f7] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {saving ? "Saving..." : editingId ? "Update Skill" : "Save Skill"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12] p-8 text-center text-sm text-slate-400">
          Loading skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12] px-5 py-12 text-center">
          <h3 className="font-semibold text-white">No skills yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            Add your first skill to start managing your portfolio skills.
          </p>
          {!showForm && (
            <button
              type="button"
              onClick={startAdd}
              className="mt-5 rounded-xl bg-cyan px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-[#38e2f7]"
            >
              + Add your first skill
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <article
              key={skill._id}
              className="rounded-2xl border border-white/10 bg-[#080d12] p-4 transition hover:border-cyan/30 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <IconPreview icon={skill.icon} color={skill.color || "#61DAFB"} size={28} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="wrap-break-word font-bold text-white">
                      {skill.name}
                    </h3>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {skill.icon}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${
                    skill.published
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {skill.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Order: {skill.order ?? 1}</span>
                <span>{skill.color || "#61DAFB"}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3.5">
                <button
                  type="button"
                  onClick={() => startEdit(skill)}
                  className="min-h-10 rounded-xl border border-cyan/30 bg-cyan/5 px-3 py-2 text-xs font-semibold text-cyan hover:bg-cyan/15 sm:text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingDelete(skill);
                    setModal({
                      title: "Delete Skill?",
                      message: `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`,
                      variant: "danger",
                      confirmText: "Delete Skill",
                      cancelText: "Cancel",
                    });
                  }}
                  disabled={deletingId === skill._id}
                  className="min-h-10 rounded-xl border border-red-400/25 bg-red-400/5 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/15 disabled:opacity-50 sm:text-sm"
                >
                  {deletingId === skill._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={Boolean(modal)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        variant={modal?.variant || "danger"}
        confirmText={modal?.confirmText || "Confirm"}
        cancelText={modal?.cancelText || "Cancel"}
        isLoading={Boolean(deletingId)}
        loadingText="Deleting..."
        onConfirm={() => {
          if (modal?.variant === "success") {
            setModal(null);
            return;
          }

          confirmDelete();
        }}
        onCancel={closeModal}
      />
    </section>
  );
}

SkillManagement.propTypes = {
  token: PropTypes.string.isRequired,
};