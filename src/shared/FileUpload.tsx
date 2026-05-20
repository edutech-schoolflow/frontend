"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn } from "@/src/lib/utils";
import { Loader2, X } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  onFileSelected: (file: File) => void;
  uploading?: boolean;
  uploadedFileName?: string;
  onClear?: () => void;
  error?: string;
}

const FileUpload = ({
  label,
  accept = { "image/*": [".png", ".jpg", ".jpeg"], "application/pdf": [".pdf"] },
  maxSizeMB = 5,
  onFileSelected,
  uploading = false,
  uploadedFileName,
  onClear,
  error,
}: FileUploadProps) => {
  const [rejected, setRejected] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejected(null);
      if (fileRejections.length > 0) {
        setRejected(fileRejections[0].errors[0].message);
        return;
      }
      if (acceptedFiles[0]) onFileSelected(acceptedFiles[0]);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  const hasFile = !!uploadedFileName;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <p className="text-sm font-medium text-dark-blue">{label}</p>}

      {hasFile ? (
        <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <span>📄</span>
            <span className="max-w-[200px] truncate">{uploadedFileName}</span>
          </div>
          {onClear && (
            <button onClick={onClear} type="button">
              <X size={14} className="text-green-600 hover:text-red-500" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer transition-colors",
            isDragActive
              ? "border-brand-green bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-brand-green/50"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
          ) : (
            <>
              <span className="text-2xl mb-2">📁</span>
              <p className="text-sm text-grey-text text-center">
                {isDragActive
                  ? "Drop the file here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-grey-text mt-1">
                PDF or Image · Max {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      )}

      {(error ?? rejected) && (
        <p className="text-xs text-red-500">{error ?? rejected}</p>
      )}
    </div>
  );
};

export default FileUpload;
