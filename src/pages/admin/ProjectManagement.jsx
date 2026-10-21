import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function emptyProjectForm(initialOrder = 1) {
  return {
    title: "",
    description: "",
    category: "Web Development",
    technologies: "",
    liveUrl: "",
    frontendUrl: "",
    backendUrl: "",
    image: "",
    imagePublicId: "",
    featured: false,
    published: true,
    order: initialOrder,
  };
}

function ProjectForm({ token, project, initialOrder, onCancel, onSaved }) {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => {
    if (!project) return emptyProjectForm(initialOrder);

    return {
      ...emptyProjectForm(),
      ...project,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      order: project.order ?? 1,
    };
  });

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function uploadImage() {
    if (!imageFile) return form.image;

    const body = new FormData();
    body.append("file", imageFile);

    setUploading(true);

    try {
      const response = await fetch(`${API_URL}/api/uploads/project-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Image upload failed.");
      }

      setForm((current) => ({
        ...current,
        image: data.url,
        imagePublicId: data.publicId,
      }));

      return data.url;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.image && !imageFile) {
      setError("Please select a project image.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        ...form,
        image: imageUrl,
        technologies: form.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
        order: Number(form.order),
      };

      const response = await fetch(
        project
          ? `${API_URL}/api/admin/projects/${project._id}`
          : `${API_URL}/api/admin/projects`,
        {
          method: project ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save project.");
      }

      onSaved(project ? "updated" : "created");
    } catch (submitError) {
      setError(submitError.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white sm:text-xl">
            {project ? "Edit Project" : "Add Project"}
          </h3>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            {project
              ? "Update project details, links, or image."
              : "Add a new featured or regular project to your portfolio."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="self-start rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:self-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 sm:text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:text-sm">
          <span>Project title *</span>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
            maxLength={120}
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
            placeholder="e.g. BE Biosal"
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:text-sm">
          <span>Category</span>
          <input
            name="category"
            value={form.category}
            onChange={updateField}
            maxLength={60}
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
            placeholder="e.g. Full Stack Web Development"
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:col-span-2 sm:text-sm">
          <span>Description *</span>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            required
            maxLength={3000}
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
            placeholder="Describe what the project accomplishes, features built, and problems solved..."
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:col-span-2 sm:text-sm">
          <span>Technologies (comma-separated)</span>
          <input
            name="technologies"
            value={form.technologies}
            onChange={updateField}
            placeholder="React, TypeScript, Tailwind CSS, Vite"
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:col-span-2 sm:text-sm">
          <span>
            Project image {project ? "(optional — select to replace)" : "*"}
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              setImageFile(event.target.files?.[0] || null);
              setError("");
            }}
            required={!form.image}
            className="block w-full min-w-0 rounded-xl border border-white/10 bg-[#060a0e] p-2.5 file:mr-3 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cyan hover:file:bg-cyan/20 sm:p-3 sm:text-sm"
          />
          <span className="block text-[11px] text-slate-500 sm:text-xs">
            PNG, JPG, or WebP format. Maximum size: 5 MB.
          </span>
        </label>

        {form.image && (
          <div className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-slate-400">
              Current Preview
            </span>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#060a0e]">
              <img
                src={form.image}
                alt="Project preview"
                className="h-44 w-full object-cover sm:h-52"
              />
            </div>
          </div>
        )}

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:text-sm">
          <span>Live Demo URL</span>
          <input
            type="url"
            name="liveUrl"
            value={form.liveUrl}
            onChange={updateField}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:text-sm">
          <span>Display order</span>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={updateField}
            min="0"
            step="1"
            required
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:text-sm">
          <span>Frontend repository URL</span>
          <input
            type="url"
            name="frontendUrl"
            value={form.frontendUrl}
            onChange={updateField}
            placeholder="https://github.com/..."
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
          />
        </label>

        <label className="space-y-1.5 text-xs font-medium text-slate-300 sm:text-sm">
          <span>Backend repository URL</span>
          <input
            type="url"
            name="backendUrl"
            value={form.backendUrl}
            onChange={updateField}
            placeholder="https://github.com/..."
            className="w-full rounded-xl border border-white/10 bg-[#060a0e] px-3.5 py-2.5 text-sm text-white  transition focus:outline-none focus:ring-1 focus:ring-cyan sm:py-3"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-white/10 bg-[#060a0e] p-3.5 sm:gap-6 sm:p-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-300 sm:text-sm">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={updateField}
            className="h-4 w-4 rounded accent-cyan"
          />
          Featured project
        </label>

        <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-300 sm:text-sm">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={updateField}
            className="h-4 w-4 rounded accent-cyan"
          />
          Published on portfolio
        </label>
      </div>

      <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#38e2f7] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {uploading
            ? "Uploading image..."
            : saving
              ? "Saving project..."
              : project
                ? "Update Project"
                : "Save Project"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 active:scale-[0.98] sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  token: PropTypes.string.isRequired,
  project: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    technologies: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    liveUrl: PropTypes.string,
    frontendUrl: PropTypes.string,
    backendUrl: PropTypes.string,
    image: PropTypes.string,
    imagePublicId: PropTypes.string,
    featured: PropTypes.bool,
    published: PropTypes.bool,
    order: PropTypes.number,
  }),
  initialOrder: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};

function ProjectManagement({ token }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [modal, setModal] = useState(null);
  const [pendingDeleteProject, setPendingDeleteProject] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load projects.");
      }

      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const nextProjectOrder =
    projects.length > 0
      ? Math.max(...projects.map((project) => Number(project.order) || 0)) + 1
      : 1;

  function handleDelete(project) {
    setPendingDeleteProject(project);
    setModal({
      type: "confirmDelete",
      variant: "danger",
      title: "Delete Project?",
      message: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      confirmText: "Delete Project",
      cancelText: "Cancel",
    });
  }

  async function confirmDelete() {
    if (!pendingDeleteProject) return;

    const project = pendingDeleteProject;

    setDeletingId(project._id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/projects/${project._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete project.");
      }

      setProjects((current) =>
        current.filter((item) => item._id !== project._id),
      );

      setPendingDeleteProject(null);

      setModal({
        type: "success",
        variant: "success",
        title: "Project Deleted!",
        message: `"${project.title}" has been deleted successfully.`,
        confirmText: "Done",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to delete project.");
      setModal(null);
      setPendingDeleteProject(null);
    } finally {
      setDeletingId("");
    }
  }

  function closeModal() {
    if (deletingId) return;

    setModal(null);
    setPendingDeleteProject(null);
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan sm:text-xs">
            Management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-3xl">
            Project Management
          </h2>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Manage the projects displayed on your portfolio showcase.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-[#38e2f7] active:scale-[0.98] sm:w-auto"
          >
            <span className="text-lg leading-none">+</span>
            Add Project
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-xs text-red-300 sm:text-sm"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={loadProjects}
            className="font-semibold text-white underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {showForm ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12] p-4 sm:p-6 lg:p-7">
          <ProjectForm
            key={editingProject?._id || "new-project"}
            token={token}
            project={editingProject}
            initialOrder={nextProjectOrder}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            onSaved={async (action) => {
              setShowForm(false);
              setEditingProject(null);
              await loadProjects();

              setModal({
                type: "success",
                variant: "success",
                title:
                  action === "created" ? "Project Added!" : "Project Updated!",
                message:
                  action === "created"
                    ? "Your new project has been added successfully."
                    : "Your project changes have been saved successfully.",
                confirmText: "Done",
                cancelText: "Close",
              });
            }}
          />
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12] p-8 text-center text-xs text-slate-400 sm:text-sm">
          Loading projects...
        </div>
      ) : projects.length === 0 && !error ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d12] px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/[0.07] text-cyan">
            <DashboardIcon type="projects" />
          </div>
          <h3 className="mt-4 font-semibold text-white">No projects yet</h3>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Your created projects will appear here once you add them.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-[#38e2f7] sm:text-sm"
          >
            + Add your first project
          </button>
        </div>
      ) : !loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080d12] transition hover:border-cyan/30"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#060a0e]">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    <div className="text-center">
                      <DashboardIcon type="projects" />
                      <p className="mt-2 text-xs">No project image</p>
                    </div>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-2 sm:inset-x-3 sm:top-3">
                  {project.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-[#1e1405]/90 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                      ★ Featured
                    </span>
                  ) : (
                    <span />
                  )}

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${
                      project.published
                        ? "border-emerald-400/30 bg-[#071b13]/90 text-emerald-300"
                        : "border-amber-400/30 bg-[#211707]/90 text-amber-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        project.published ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word text-base font-bold text-white sm:text-lg">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {project.category || "Web Development"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-lg border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-xs font-bold text-cyan">
                      Order #{project.order ?? 1}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-400 sm:line-clamp-3 sm:text-sm">
                    {project.description}
                  </p>

                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.slice(0, 5).map((technology) => (
                          <span
                            key={technology}
                            className="rounded-md border border-white/10 bg-white/4 px-2 py-0.5 text-[11px] text-slate-300"
                          >
                            {technology}
                          </span>
                        ))}
                        {project.technologies.length > 5 && (
                          <span className="px-1 py-0.5 text-[11px] text-slate-500">
                            +{project.technologies.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                </div>

                {/* Action Buttons: 2 equal touch targets on mobile & desktop */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-cyan/30 bg-cyan/5 px-3 py-2 text-xs font-semibold text-cyan transition hover:bg-cyan/15 active:scale-[0.98] sm:text-sm"
                  >
                    <span aria-hidden="true">✎</span>
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    disabled={deletingId === project._id}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-red-400/25 bg-red-400/5 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    <span aria-hidden="true">×</span>
                    {deletingId === project._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <ConfirmationModal
        isOpen={Boolean(modal)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        variant={modal?.variant || "danger"}
        confirmText={modal?.confirmText || "Confirm"}
        cancelText={modal?.cancelText || "Cancel"}
        isLoading={Boolean(deletingId)}
        loadingText="Deleting..."
        onConfirm={modal?.type === "confirmDelete" ? confirmDelete : closeModal}
        onCancel={closeModal}
      />
    </section>
  );
}

ProjectManagement.propTypes = {
  token: PropTypes.string.isRequired,
};

function DashboardIcon({ type = "overview" }) {
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
  type: PropTypes.oneOf(["overview", "projects", "resume", "skills"]),
};

export default ProjectManagement;