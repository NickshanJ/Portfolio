import { useEffect, useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const EMPTY_ABOUT = {
  profileImage: { url: "", publicId: "" },
  paragraphs: [],
  infoItems: [],
};

export default function AboutManagement({ token }) {
  const [about, setAbout] = useState(EMPTY_ABOUT);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "success",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadAbout() {
      try {
        const response = await fetch(`${API_URL}/api/admin/about`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load About content.");
        }

        setAbout({
          ...EMPTY_ABOUT,
          ...data.about,
          profileImage: {
            ...EMPTY_ABOUT.profileImage,
            ...data.about?.profileImage,
          },
          paragraphs: data.about?.paragraphs || [],
          infoItems: data.about?.infoItems || [],
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load About content.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAbout();
    return () => controller.abort();
  }, [token]);

  function updateParagraph(index, text) {
    setAbout((current) => ({
      ...current,
      paragraphs: current.paragraphs.map((item, i) =>
        i === index ? { ...item, text } : item,
      ),
    }));
  }

  function addParagraph() {
    setAbout((current) => ({
      ...current,
      paragraphs: [...current.paragraphs, { text: "" }],
    }));
  }

  function removeParagraph(index) {
    setAbout((current) => ({
      ...current,
      paragraphs: current.paragraphs.filter((_, i) => i !== index),
    }));
  }

  function moveItem(items, index, direction, setter, key) {
    const next = [...items];
    const target = index + direction;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];

    setter((current) => ({
      ...current,
      [key]: next,
    }));
  }

  function updateInfoItem(index, field, value) {
    setAbout((current) => ({
      ...current,
      infoItems: current.infoItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addInfoItem() {
    setAbout((current) => ({
      ...current,
      infoItems: [...current.infoItems, { label: "", value: "" }],
    }));
  }

  function removeInfoItem(index) {
    setAbout((current) => ({
      ...current,
      infoItems: current.infoItems.filter((_, i) => i !== index),
    }));
  }

  async function uploadImage() {
    if (!imageFile) return about.profileImage;

    const formData = new FormData();
    formData.append("file", imageFile);

    setUploading(true);

    try {
      const response = await fetch(`${API_URL}/api/uploads/about-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Image upload failed.");
      }

      return { url: data.url, publicId: data.publicId };
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const paragraphs = about.paragraphs
      .map((item) => ({ text: item.text.trim() }))
      .filter((item) => item.text);

    const infoItems = about.infoItems.map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }));

    if (infoItems.some((item) => !item.label || !item.value)) {
      setModal({
        isOpen: true,
        title: "Incomplete Information",
        message:
          "Please complete or delete every information card before saving.",
        variant: "danger",
      });
      return;
    }

    setSaving(true);

    try {
      const profileImage = await uploadImage();

      const response = await fetch(`${API_URL}/api/admin/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profileImage, paragraphs, infoItems }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save About content.");
      }

      setAbout({
        ...EMPTY_ABOUT,
        ...data.about,
        profileImage: data.about.profileImage || EMPTY_ABOUT.profileImage,
        paragraphs: data.about.paragraphs || [],
        infoItems: data.about.infoItems || [],
      });

      setImageFile(null);
      setMessage("");

      setModal({
        isOpen: true,
        title: "About Updated Successfully",
        message:
          "Your profile image, description, and information cards have been saved successfully.",
        variant: "success",
      });
    } catch (err) {
      setError("");

      setModal({
        isOpen: true,
        title: "Update Failed",
        message:
          err.message || "Unable to save About content. Please try again.",
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400";
  const buttonClass =
    "rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";

  if (loading) {
    return (
      <p className="p-6 text-sm text-slate-400">Loading About content...</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">About Management</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage your profile image, biography, and information cards.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-white/10 p-4 sm:p-6">
        <h3 className="font-semibold">Profile Image</h3>

        {about.profileImage.url && (
          <img
            src={about.profileImage.url}
            alt="About profile preview"
            className="h-40 w-32 rounded-xl border border-white/10 object-cover"
          />
        )}

        <label className="block text-sm text-slate-300">
          Upload a new image (JPG, PNG, or WebP; maximum 5 MB)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          />
        </label>

        {imageFile && (
          <p className="text-xs text-slate-400">Selected: {imageFile.name}</p>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Description Paragraphs</h3>
            <p className="mt-1 text-xs text-slate-400">
              Add, edit, remove, or reorder your biography paragraphs.
            </p>
          </div>
          <button type="button" className={buttonClass} onClick={addParagraph}>
            + Add paragraph
          </button>
        </div>

        {about.paragraphs.map((item, index) => (
          <div
            key={item._id || `paragraph-${index}`}
            className="space-y-2 rounded-xl border border-white/10 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm text-slate-300">
                Paragraph {index + 1}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={buttonClass}
                  disabled={index === 0}
                  onClick={() =>
                    moveItem(
                      about.paragraphs,
                      index,
                      -1,
                      setAbout,
                      "paragraphs",
                    )
                  }
                  aria-label="Move paragraph up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={buttonClass}
                  disabled={index === about.paragraphs.length - 1}
                  onClick={() =>
                    moveItem(about.paragraphs, index, 1, setAbout, "paragraphs")
                  }
                  aria-label="Move paragraph down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  onClick={() => removeParagraph(index)}
                >
                  Delete
                </button>
              </div>
            </div>
            <textarea
              className={inputClass}
              rows={4}
              maxLength={3000}
              value={item.text}
              onChange={(event) => updateParagraph(index, event.target.value)}
              placeholder="Write a paragraph about yourself..."
            />
          </div>
        ))}

        {about.paragraphs.length === 0 && (
          <p className="text-sm text-slate-500">No paragraphs added yet.</p>
        )}
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Information Cards</h3>
            <p className="mt-1 text-xs text-slate-400">
              These cards will appear in two columns on desktop and one column
              on mobile.
            </p>
          </div>
          <button type="button" className={buttonClass} onClick={addInfoItem}>
            + Add card
          </button>
        </div>

        {about.infoItems.map((item, index) => (
          <div
            key={item._id || `info-${index}`}
            className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-2"
          >
            <label className="text-sm text-slate-300">
              Label
              <input
                className={inputClass}
                maxLength={60}
                value={item.label}
                onChange={(event) =>
                  updateInfoItem(index, "label", event.target.value)
                }
                placeholder="e.g. Location"
              />
            </label>

            <label className="text-sm text-slate-300">
              Value
              <input
                className={inputClass}
                maxLength={200}
                value={item.value}
                onChange={(event) =>
                  updateInfoItem(index, "value", event.target.value)
                }
                placeholder="e.g. Tamil Nadu, India"
              />
            </label>

            <div className="flex gap-2 sm:col-span-2">
              <button
                type="button"
                className={buttonClass}
                disabled={index === 0}
                onClick={() =>
                  moveItem(about.infoItems, index, -1, setAbout, "infoItems")
                }
                aria-label="Move card up"
              >
                ↑ Move up
              </button>
              <button
                type="button"
                className={buttonClass}
                disabled={index === about.infoItems.length - 1}
                onClick={() =>
                  moveItem(about.infoItems, index, 1, setAbout, "infoItems")
                }
                aria-label="Move card down"
              >
                ↓ Move down
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                onClick={() => removeInfoItem(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {about.infoItems.length === 0 && (
          <p className="text-sm text-slate-500">
            No information cards added yet.
          </p>
        )}
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          {uploading
            ? "Uploading image..."
            : saving
              ? "Saving..."
              : "Save About Content"}
        </button>
      </div>
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        variant={modal.variant}
        confirmText="Close"
        cancelText="Dismiss"
        onConfirm={() => setModal((current) => ({ ...current, isOpen: false }))}
        onCancel={() => setModal((current) => ({ ...current, isOpen: false }))}
      />
    </form>
  );
}