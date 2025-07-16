import { useState } from "react";
import type { GridImage } from "../components/ui/ImageGrid";
import { ImageDropzoneSection } from "../components/sections/ImageDropzoneSection";


const HomePage: React.FC = () => {
  const [images, setImages] = useState<GridImage[]>([]);
  return (
    <main className="flex-1 flex flex-col w-full items-center bg-[#2C292C] min-h-screen relative">
      <div className="w-full flex flex-col items-center pt-8 md:pt-4">
        <h1 className="text-3xl md:text-5xl font-black text-purple-400 mb-2 tracking-tight">
          Image Convertor
        </h1>
        <p className="text-base md:text-lg text-gray-300 font-medium mb-3">
          {images.length === 0
            ? "Drop your image(s) here or click to select!"
            : "Add more images (or remove any)!"}
        </p>
      </div>
      <ImageDropzoneSection images={images} setImages={setImages} />
    </main>
  );
};

export default HomePage;
