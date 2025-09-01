import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Step3PhotoUploadProps {
  form: UseFormReturn<any>;
}

const Step3PhotoUpload = ({ form }: Step3PhotoUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const currentFiles = form.getValues("photos") || [];
    const combinedFiles = [...currentFiles, ...files].slice(0, 6);
    form.setValue("photos", combinedFiles, { shouldValidate: true });

    const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (indexToRemove: number) => {
    const currentFiles = form.getValues("photos") || [];
    const updatedFiles = currentFiles.filter((_: any, index: number) => index !== indexToRemove);
    form.setValue("photos", updatedFiles, { shouldValidate: true });

    const updatedPreviews = updatedFiles.map(file => URL.createObjectURL(file));
    setPreviews(updatedPreviews);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="photos"
        render={() => (
          <FormItem>
            <FormLabel>Your Photos</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {previews.length < 6 && (
                <div
                  className="aspect-square flex flex-col items-center justify-center bg-muted rounded-md cursor-pointer hover:bg-muted/80"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step3PhotoUpload;