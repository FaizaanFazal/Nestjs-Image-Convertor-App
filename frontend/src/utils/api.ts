// export async function uploadImagesForConversion(
//   files: File[],
//   targetFormat: string
// ): Promise<{ sessionId: string; jobs: any[] }> {
//   const form = new FormData();
//   files.forEach(file => form.append('files', file));
//   form.append('targetFormat', targetFormat);

//   const response = await fetch('/api/convert', {
//     method: 'POST',
//     body: form,
//   });

//   if (!response.ok) {
//     throw new Error('Failed to upload images');
//   }
//   return response.json();
// }

// // notifyBackend(meta): POST to your NestJS API
export interface ImageMeta {
  url: string;
  originalName: string;
  size: number;
}

export async function notifyBackend(meta: ImageMeta) {
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meta),
  });
  if (!res.ok) throw new Error('Backend notification failed');
  return res.json();
}


export interface UploadResponse {
  jobId: string;
  originalUrl: string;
}

export async function uploadOriginalToBackend(
  file: File,
  targetFormat: string,
  sessionId: string
): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('targetFormat', targetFormat);
  form.append('sessionId', sessionId);

  const res = await fetch('/api/images', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

