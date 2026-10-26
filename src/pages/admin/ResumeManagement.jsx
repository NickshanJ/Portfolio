import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function ResumeManagement({ token }) {
  const [resumeUrl, setResumeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResume() {
      try {
        const response = await fetch(`${API_URL}/api/settings/resume`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load resume details.");
        }

        if (!cancelled) {
          setResumeUrl(data.resumeUrl || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load resume details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    setError("");

    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("The resume file must be 10 MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const uploadResponse = await fetch(`${API_URL}/api/uploads/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.url || !uploadData.publicId) {
        throw new Error(uploadData.message || "Resume upload failed.");
      }

      const saveResponse = await fetch(`${API_URL}/api/settings/admin/resume`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeUrl: uploadData.url,
          resumePublicId: uploadData.publicId,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok || saveData.success === false) {
        throw new Error(saveData.message || "Unable to save resume details.");
      }

      setResumeUrl(uploadData.url);
      setSelectedFile(null);
      event.target.reset();

      setModal({
        variant: "success",
        title: "Resume Updated!",
        message: "Your resume has been uploaded and saved successfully.",
        confirmText: "Done",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to upload resume.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="space-y-5 sm:space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan sm:text-xs">
          Management
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Resume Management
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-400">
          Upload or replace the resume displayed to visitors on your portfolio.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#080d12]/90 shadow-[0_12px_40px_rgba(0,0,0,0.16)] p-4.5 sm:p-7">
        {loading ? (
          <p className="text-xs text-slate-400 sm:text-sm">
            Loading resume details...
          </p>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  Current resume status
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    resumeUrl
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      resumeUrl ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  {resumeUrl ? "Active & Downloadable" : "No Resume Configured"}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                {resumeUrl
                  ? "Your resume is active and can be viewed or downloaded from your portfolio."
                  : "Upload a PDF below to make your resume available on your portfolio."}
              </p>

              {resumeUrl && (
                <div className="mt-3.5">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-xs font-semibold text-cyan transition hover:bg-cyan/20 active:scale-[0.98] sm:text-sm"
                  >
                    <span>View current resume</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </div>

            <div className="h-px bg-white/10" />

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label
                  htmlFor="resume-file"
                  className="mb-1.5 block text-xs font-medium text-slate-200 sm:text-sm"
                >
                  Choose a PDF resume to upload
                </label>
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] || null);
                    setError("");
                  }}
                  className="block w-full min-w-0 rounded-xl border border-white/10 bg-[#05090d] transition-colors p-2.5 text-xs text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:font-semibold hover:file:bg-cyan/20 sm:p-3 sm:text-sm"
                />
                <p className="mt-1.5 text-[11px] text-slate-500 sm:text-xs">
                  PDF format only. Maximum file size: 10 MB.
                </p>

                {selectedFile && (
                  <div className="mt-2.5 rounded-lg border border-cyan/20 bg-cyan/5 p-2.5 text-xs text-cyan">
                    Selected file: {selectedFile.name} (
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-xs text-red-300 sm:text-sm"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-[#38e2f7] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {uploading
                  ? "Uploading..."
                  : resumeUrl
                    ? "Upload replacement resume"
                    : "Upload resume"}
              </button>
            </form>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(modal)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        variant={modal?.variant || "success"}
        confirmText={modal?.confirmText || "Done"}
        cancelText={modal?.cancelText || "Close"}
        onConfirm={() => setModal(null)}
        onCancel={() => setModal(null)}
      />
    </section>
  );
}

ResumeManagement.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ResumeManagement;