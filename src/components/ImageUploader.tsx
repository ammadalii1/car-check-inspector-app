
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Image } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...images];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result.toString());
          onImagesChange([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Images</span>
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddImage}
          className="gap-2"
        >
          <Image className="h-4 w-4" />
          Add Image
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative group overflow-hidden rounded-md border border-gray-200">
              <img
                src={src}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-8 text-center text-gray-500">
          <p>No images uploaded yet</p>
          <p className="text-sm mt-1">Click "Add Image" to upload</p>
        </div>
      )}
    </div>
  );
}
