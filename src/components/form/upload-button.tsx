"use client";
import Button from "@/components/ui/button";

export function UploadButton({
  accept,
  onFileSelect,
  buttonNode,
  uploadButtonLabel,
}: { accept?: string, onFileSelect: (file: File) => void, buttonNode?: React.ReactNode, uploadButtonLabel?: string }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="cursor-pointer block w-full relative">
        <div className="pointer-events-none">{buttonNode || <Button type="button">{uploadButtonLabel}</Button>}</div>
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
