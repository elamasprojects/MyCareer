"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, X, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createResource } from "@/lib/mutations";

interface UploadResourceProps {
  classId: string;
  subjectId: string;
}

export default function UploadResource({
  classId,
  subjectId,
}: UploadResourceProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF");
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError("El archivo no puede ser mayor a 50MB");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // Build file path: /{user_id}/{subject_id}/{filename}
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const timestamp = Date.now();
      const filePath = `${user.id}/${subjectId}/${timestamp}_${sanitizedName}`;

      // Upload to Supabase Storage
      setProgress(30);
      const { error: uploadError } = await supabase.storage
        .from("class-resources")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;
      setProgress(70);

      // Get the public URL (signed URL since bucket is private)
      const { data: urlData } = await supabase.storage
        .from("class-resources")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

      setProgress(85);

      // Create resource row via server action
      startTransition(async () => {
        await createResource({
          class_id: classId,
          title: file.name.replace(/\.pdf$/i, ""),
          type: "pdf",
          url: urlData?.signedUrl ?? undefined,
          file_path: filePath,
        });

        setProgress(100);
        setSuccess(true);
        setUploading(false);
        router.refresh();

        // Reset success state after a moment
        setTimeout(() => {
          setSuccess(false);
          setProgress(0);
        }, 2500);
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al subir el archivo";
      setError(message);
      setUploading(false);
      setProgress(0);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const isProcessing = uploading || isPending;

  return (
    <div className="space-y-2">
      {/* Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-dashed text-sm transition-all duration-200
          ${
            success
              ? "border-[var(--green)]/30 bg-[var(--green-dim)] text-[var(--green)]"
              : isProcessing
              ? "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dim)] cursor-wait"
              : "border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]"
          }
          disabled:pointer-events-none
        `}
      >
        {success ? (
          <>
            <CheckCircle2 size={16} />
            Subido
          </>
        ) : isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload size={16} />
            Subir PDF
          </>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Progress bar */}
      {isProcessing && progress > 0 && (
        <div className="w-full h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="shrink-0 hover:text-[var(--text)] transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
