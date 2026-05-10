import { useState } from "react";
import { uploadFileToCloudinary } from "../services/cloudinary.service";
import { toast } from "sonner"; // Assuming sonner is used based on package.json

export const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, folder?: string, flags?: string, resourceType: string = "auto"): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadFileToCloudinary(file, folder, flags, resourceType);
      return url;
    } catch (err: any) {
      const message = err?.message || "Failed to upload file to Cloudinary";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
};
