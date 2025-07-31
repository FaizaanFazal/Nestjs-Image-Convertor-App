import { Download, X } from "lucide-react";
import type { ConvertedMeta } from "../../hooks/useMultiUpload";

export type GridImage = {
  file: File;
  url: string;
  type: string;
  size: number;
};

interface ImageGridProps {
  images: GridImage[] | ConvertedMeta[];
  onRemove?: (idx: number) => void;
  onDownload?: (idx: number) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemove, onDownload }) => {
  const avgSize =
    images.length > 0
      ? Math.round(images.reduce((a, i) => a + i.size, 0) / images.length / 1024)
      : 0;
      
  return (
    <>
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
              {onRemove && (<button
                className="absolute right-2 top-2 bg-purple-700/70 rounded-full hover:bg-green-600 transition"
                aria-label="Remove image"
                onClick={() => onRemove(i)}
                tabIndex={0}
              >
                <X className="w-5 h-5 text-white" />
              </button>)}
              {onDownload && (
                <button
                  className="absolute right-2 top-2 bg-purple-700/70 rounded-full hover:bg-green-600 transition"
                  aria-label="Download image"
                  onClick={() => onDownload(i)}
                  tabIndex={0}
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
              )}
              <div
                className="
              absolute left-0 bottom-0 w-full
              bg-black/70 text-xs text-gray-200 px-1 py-0.5 rounded-b
              flex items-center justify-center
              z-0
            "
              >
                {img.size && (Math.round(img?.size / 1024))} KB
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {img.type ? (img.type.toUpperCase().split("/")[1]) : img.type || 'IMG'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Average size: {avgSize} KB
      </div>
    </>
  )
};
