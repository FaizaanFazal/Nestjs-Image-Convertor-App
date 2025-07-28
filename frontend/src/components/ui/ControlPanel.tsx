// src/components/ui/ConvertPanel.tsx
import { useMultiUpload } from '../../hooks/useMultiUpload';
import { useState } from 'react';
import { Download } from "lucide-react";
import { type GridImage } from "./ImageGrid";

const formats = [
  { label: "JPEG", value: "jpeg" },
  { label: "PNG", value: "png" },
  { label: "WEBP", value: "webp" },
  { label: "SVG", value: "svg" },
];

interface ConvertPanelProps {
  images: GridImage[];
}

export const ConvertPanel: React.FC<ConvertPanelProps> = ({ images }) => {
  const [targetType, setTargetType] = useState<string>("jpeg");
  const { converted, errors, startUpload } = useMultiUpload(
    images.map(img => img.file),
    targetType
  );
  const isProcessing = converted.length === 0 && images.length > 0;

  return (
    <div className="flex flex-col md:ml-12 items-center md:items-start mt-8 md:mt-0 w-full">
      <div className="flex items-center mb-4">
        <span className="text-5xl text-purple-500 font-black mr-3">→</span>
        <select
          className="rounded-2xl px-4 py-2 bg-[#292529] text-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={targetType}
          onChange={e => setTargetType(e.target.value)}
          disabled={isProcessing}
        >
          {formats.map(fmt => (
            <option key={fmt.value} value={fmt.value}>
              {fmt.label}
            </option>
          ))}
        </select>
        <button
          onClick={startUpload}
          disabled={isProcessing || images.length === 0}
          className={`ml-4 px-6 py-3 rounded-2xl bg-purple-600 text-lg font-bold text-white shadow transition 
            ${isProcessing || images.length === 0 
              ? "opacity-60 cursor-not-allowed" 
              : "hover:bg-purple-700"}`}
        >
          {isProcessing ? "Processing..." : "Convert"}
        </button>
      </div>
      <div className="text-xs text-gray-500 mb-4">
        Choose format and click convert
      </div>
      {converted.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2 w-full">
          {converted.map((img, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center bg-[#282528] p-2 rounded-xl"
            >
              <img
                src={img.url}
                alt=""
                className="h-16 w-16 object-cover rounded"
              />
              <a
                href={img.url}
                download
                className="absolute right-2 top-2 bg-purple-700/70 rounded-full hover:bg-green-600 transition"
                title="Download converted image"
                tabIndex={0}
              >
                <Download className="w-5 h-5 text-white" />
              </a>
            </div>
          ))}
        </div>
      )}
      {errors.length > 0 && (
        <div className="text-red-600 mt-4">
          Failed: {errors.join(', ')}
        </div>
      )}
    </div>
  );
};
