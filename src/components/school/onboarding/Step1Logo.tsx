import Image from "next/image";
import FileUpload from "@/src/shared/FileUpload";

type Props = {
  logoFile: File | null;
  logoPreviewUrl: string | null;
  onChange: (file: File, previewUrl: string) => void;
  onNext: () => void;
  onSkip: () => void;
};

export default function Step1Logo({
  logoFile,
  logoPreviewUrl,
  onChange,
  onNext,
  onSkip,
}: Props) {
  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    onChange(file, url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-dark-blue">
          Upload your school logo
        </h2>
        <p className="mt-1 text-sm text-grey-text">
          This appears on reports, invoices, and the parent portal.
        </p>
      </div>

      {logoPreviewUrl ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full border-2 border-brand-green">
            <Image
              src={logoPreviewUrl}
              alt="School logo preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(logoFile!, "")}
            className="text-sm text-grey-text underline"
          >
            Change logo
          </button>
        </div>
      ) : (
        <FileUpload
          label="School logo"
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".svg"] }}
          maxSizeMB={2}
          onFileSelected={handleFile}
        />
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:opacity-90"
        >
          {logoPreviewUrl ? "Continue" : "Continue without logo"}
        </button>
        {!logoPreviewUrl && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-grey-text underline"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
