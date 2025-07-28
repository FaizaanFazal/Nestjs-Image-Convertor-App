// uploadToCloudinary(file): unsigned upload preset
export async function uploadToCloudinary(file: File): Promise<{
  secure_url: string;
  original_filename: string;
  format: string;
}> {
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    { method: 'POST', body: form }
  );
  if (!res.ok) throw new Error('Cloudinary upload failed');
  return res.json();
}
