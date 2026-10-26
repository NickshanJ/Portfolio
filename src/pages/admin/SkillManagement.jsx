import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

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
      const payload = {
        name: form.name.trim(),
        icon: form.icon.trim(),
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
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Skill Management
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-400">
            Add, edit, and control the skills displayed on your portfolio.
          </p>
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
          className="space-y-5 rounded-2xl border border-white/10 bg-[#080d12]/90 shadow-[0_12px_40px_rgba(0,0,0,0.16)] p-4 sm:p-6 lg:p-7"
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
                className="w-full rounded-xl border border-white/10 bg-[#05090d] transition-colors px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan"
              />
            </label>

            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Icon identifier *</span>
              <input
                name="icon"
                value={form.icon}
                onChange={updateField}
                required
                maxLength={100}
                placeholder="e.g. simple-icons:mysql"
                className="w-full rounded-xl border border-white/10 bg-[#05090d] transition-colors px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan"
              />
              <span className="block text-xs text-slate-500">
                Enter an Iconify identifier, for example simple-icons:mysql.
                Find icons at icon-sets.iconify.design.
              </span>
            </label>

            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Brand color</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#05090d] transition-colors px-3">
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
                className="w-full rounded-xl border border-white/10 bg-[#05090d] transition-colors px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan"
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
        <div className="rounded-2xl border border-white/10 bg-[#080d12]/90 shadow-[0_12px_40px_rgba(0,0,0,0.16)] p-8 text-center text-sm text-slate-400">
          Loading skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12]/90 shadow-[0_12px_40px_rgba(0,0,0,0.16)] px-5 py-12 text-center">
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
              className="rounded-2xl border border-white/10 bg-[#080d12]/90 shadow-[0_12px_40px_rgba(0,0,0,0.16)] p-4 transition hover:border-cyan/30 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white/5"
                    style={{ backgroundColor: skill.color || "#61DAFB" }}
                  />
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