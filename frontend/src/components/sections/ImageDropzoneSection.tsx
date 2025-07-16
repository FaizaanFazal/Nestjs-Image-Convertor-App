import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { ImageGrid, type GridImage } from "../ui/ImageGrid";

import { ArrowBigRight } from "lucide-react";
import { ConvertPanel } from "../ui/ControlPanel";

interface Props {
    images: GridImage[];
    setImages: (images: GridImage[]) => void;
}

export const ImageDropzoneSection: React.FC<Props> = ({ images, setImages }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = acceptedFiles.filter(file =>
                !images.some(img => img.file.name === file.name && img.file.size === file.size)
            );
            const newImages = newFiles.map(file => ({
                file,
                url: URL.createObjectURL(file),
                type: file.type,
                size: file.size,
            }));
            setImages([...images, ...newImages]);
        },
        [images, setImages]
    );

    const handleRemove = (idx: number) => {
        const next = [...images];
        next.splice(idx, 1);
        setImages(next);
    };

    const avgSize =
        images.length > 0
            ? Math.round(images.reduce((a, i) => a + i.size, 0) / images.length / 1024)
            : 0;

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/svg+xml": [],
        },
    });

    return (
        <section className={`w-full  ${images.length>0 ? 'flex flex-col md:flex-row items-stretch justify-between':'flex flex-row justify-center'} md:gap-4 py-8`}>
            {/* Grid */}
            <div className={` w-full flex flex-col items-center justify-start`}>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed border-purple-700 rounded-2xl p-8 w-full max-w-xl min-h-32 cursor-pointer bg-[#211E21] hover:bg-purple-900/20 transition
          ${isDragActive ? "border-purple-500 bg-purple-900/30" : ""}
          `}
                >
                    <input {...getInputProps()} />
                    <span className="text-base text-gray-400 font-bold select-none">
                        {isDragActive
                            ? "Drop it here!"
                            : images.length === 0
                                ? "Drag & drop or click to choose image(s)"
                                : "Add more images (drag/drop or click)"}
                    </span>
                </div>
                {images.length > 0 && (
                    <>
                        <ImageGrid images={images} onRemove={handleRemove} />
                        <div className="mt-2 text-sm text-gray-500">
                            Average size: {avgSize} KB
                        </div>
                    </>
                )}
            </div>
            {/* Center Arrow */}
            {images.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center md:w-1/4 w-full py-8">
                        <ArrowBigRight className="text-purple-500 w-20 h-20 md:w-28 md:h-28 animate-bounce" strokeWidth={2.5} />
                        <span className="text-lg text-purple-400 font-bold mt-2 hidden md:block">
                            Convert To
                        </span>
                    </div>
                    <div className=" w-full flex flex-col items-center justify-start">
                        <ConvertPanel images={images} />
                    </div>
                </>
            )}
        </section>
    );
};
