
import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, className }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        aria-label="Upload image"
      />

      {!preview ? (
        <div 
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 flex flex-col items-center justify-center text-center h-56 cursor-pointer hover:border-primary/50 transition-colors duration-200"
          onClick={handleCameraClick}
        >
          <Camera size={40} className="text-muted-foreground mb-4" />
          <p className="text-base font-medium mb-1">Capture proof of visit</p>
          <p className="text-sm text-muted-foreground">Take a photo or upload an image</p>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-4 gap-2"
          >
            <Upload size={14} />
            Select Image
          </Button>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-muted h-56">
          <img 
            src={preview} 
            alt="Preview" 
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoading ? "image-loading" : "image-loaded"
            )}
            onLoad={() => setIsLoading(false)}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full w-8 h-8"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
