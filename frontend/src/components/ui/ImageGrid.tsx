import { X } from "lucide-react";

export type GridImage = {
  file: File;
  url: string;
  type: string;
  size: number;
};

interface ImageGridProps {
  images: GridImage[];
  onRemove: (idx: number) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemove }) => (
  <div className="flex flex-wrap gap-4 mt-6 w-full max-w-xl">
    {images.map((img, i) => (
      <div
        key={i}
        className="relative flex flex-col items-center bg-[#282528] p-2 rounded-xl"
      >
        {/* Image Container with hover group */}
        <div className="relative group">
          <img
            src={img.url}
            alt=""
            className="h-24 w-24 object-cover rounded"
          />
          {/* Overlay with X, only visible on hover */}
          <button
            className="
              absolute inset-0 flex items-center justify-center
              bg-black/70 opacity-0 group-hover:opacity-100
              transition-opacity rounded
              focus:opacity-100
              z-10
            "
            aria-label="Remove image"
            onClick={() => onRemove(i)}
            tabIndex={0}
          >
            <X className="w-8 h-8 text-white" />
          </button>
          <div
            className="
              absolute left-0 bottom-0 w-full
              bg-black/70 text-xs text-gray-200 px-1 py-0.5 rounded-b
              flex items-center justify-center
              z-0
            "
          >
            {Math.round(img.size / 1024)} KB
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {img.type.toUpperCase().split("/")[1] || img.type}
        </div>
      </div>
    ))}
  </div>
);
