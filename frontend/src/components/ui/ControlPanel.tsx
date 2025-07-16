import { useState } from "react";
import { type GridImage } from "./ImageGrid";

const formats = [
  { label: "JPEG", value: "jpeg" },
  { label: "PNG", value: "png" },
  { label: "WEBP", value: "webp" },
  { label: "SVG", value: "svg" },
];

interface ConvertPanelProps {
  images: GridImage[];
  onConvert?: (format: string) => void;
}

export const ConvertPanel: React.FC<ConvertPanelProps> = ({ images, onConvert }) => {
  const [targetType, setTargetType] = useState<string>("jpeg");

  const handleConvert = () => {
    if (onConvert) onConvert(targetType);
    // Actual upload/integration to backend goes here
    alert(`Convert to ${targetType} (API integration needed)`);
  };

  return (
    <div className="flex flex-col md:ml-12 items-center md:items-start mt-8 md:mt-0">
      <div className="flex items-center">
        <span className="text-5xl text-purple-500 font-black mr-3">→</span>
        <select
          className="rounded-2xl px-4 py-2 bg-[#292529] text-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={targetType}
          onChange={e => setTargetType(e.target.value)}
        >
          {formats.map(fmt => (
            <option key={fmt.value} value={fmt.value}>
              {fmt.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleConvert}
          className="ml-4 px-6 py-3 rounded-2xl bg-purple-600 text-lg font-bold text-white shadow hover:bg-purple-700 transition"
        >
          Convert
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Choose format and click convert
      </div>
    </div>
  );
};
