import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { socket } from '../utils/socket';
import { sendLinkToBackend } from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';

export interface ConvertedMeta {
  sessionId: string;
  url: string;
}


const mockCloudinaryResponses = [
  {
    secure_url: "https://res.cloudinary.com/dv4owjcms/image/upload/v1753865797/mldlikxoelhbmo2igkrx.png",
    original_filename: "Capture",
    format: "png",
    bytes: 110852,
  },
  {
    secure_url: "https://res.cloudinary.com/dv4owjcms/image/upload/v1753865798/hlzxh9tfeoyzv8arhinp.png",
    original_filename: "Capture2",
    format: "png",
    bytes: 7527,
  }
];

export function useMultiUpload(files: File[], targetFormat: string) {
  const [converted, setConverted] = useState<ConvertedMeta[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [sessionId] = useState(() => uuid());

  useEffect(() => {
    const handler = (data: ConvertedMeta) => {
      console.log('SOCKET converted', data, 'MY SESSION:', sessionId);
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
    //----------------comment after development
    for (const mock of mockCloudinaryResponses) {
      try {
        await sendLinkToBackend({
          url: mock.secure_url,
          originalName: mock.original_filename,
          format: mock.format,
          size: mock.bytes,
          targetFormat,
          sessionId,
        });
      } catch {
        setErrors(e => [...e, mock.original_filename]);
      }
    }
    //-----------uncomment after development
    // for (const file of files) {
    //   try {
    //     // 1. Upload to Cloudinary and get the URL
    //     // const cloudinaryResult = await uploadToCloudinary(file);
    //     console.log("file uploaded successfully :", cloudinaryResult)
    //     // 2. Send URL and meta to backend (not the file itself!)
    //     await sendLinkToBackend({
    //       url: cloudinaryResult.secure_url,
    //       originalName: cloudinaryResult.original_filename,
    //       format: cloudinaryResult.format,
    //       size: file.size,
    //       targetFormat,
    //       sessionId,
    //     });
    //   } catch {
    //     setErrors(e => [...e, file.name]);
    //   }
    // }
  }

  return {
    converted,
    errors,
    startUpload,
  };
}
