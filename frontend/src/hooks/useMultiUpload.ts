// src/hooks/useMultiUpload.ts
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { socket } from '../utils/socket';
import { uploadOriginalToBackend } from '../utils/api';

export interface ConvertedMeta {
  sessionId: string;
  url: string;
}

export function useMultiUpload(files: File[], targetFormat: string) {
  const [converted, setConverted] = useState<ConvertedMeta[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [sessionId] = useState(() => uuid());

  useEffect(() => {
    const handler = (data: ConvertedMeta) => {
      if (data.sessionId === sessionId) {
        setConverted(c => [...c, data]);
      }
    };
    socket.on('converted', handler);
    return () => {
      socket.off('converted', handler);
    };
  }, [sessionId]);

  async function startUpload() {
    setConverted([]);
    setErrors([]);

    for (const file of files) {
      try {
        await uploadOriginalToBackend(file, targetFormat, sessionId);
      } catch {
        setErrors(e => [...e, file.name]);
      }
    }
  }

  return {
    converted,
    errors,
    startUpload,
  };
}
