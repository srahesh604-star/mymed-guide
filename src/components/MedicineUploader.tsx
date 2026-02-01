import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MedicineUploaderProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

export function MedicineUploader({ onImageSelected, isAnalyzing }: MedicineUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {preview ? (
        <div className="relative animate-scale-in">
          <div className="relative rounded-2xl overflow-hidden shadow-card bg-card">
            <img
              src={preview}
              alt="Medicine preview"
              className="w-full h-auto max-h-80 object-contain bg-muted/50"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-card">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <span className="font-medium">Analyzing medicine...</span>
                </div>
              </div>
            )}
            {!isAnalyzing && (
              <button
                onClick={clearPreview}
                className="absolute top-3 right-3 p-2 rounded-full bg-foreground/80 text-background hover:bg-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all duration-300",
            "bg-card hover:bg-secondary/50",
            dragActive
              ? "border-primary bg-medical-teal-light scale-[1.02]"
              : "border-border"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-8 sm:p-12 flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full gradient-medical flex items-center justify-center shadow-soft">
              <ImageIcon className="h-10 w-10 text-primary-foreground" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Upload Medicine Image
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Take a photo or upload an image of your medicine for instant AI-powered analysis
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 gap-2 h-12 gradient-medical text-primary-foreground border-0 shadow-soft hover:shadow-card transition-shadow"
              >
                <Camera className="h-5 w-5" />
                Take Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1 gap-2 h-12 border-primary/30 hover:bg-primary/5 hover:border-primary"
              >
                <Upload className="h-5 w-5" />
                Upload
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              or drag and drop an image here
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
