import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { showError, showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Loader2, Pencil, UploadCloud, X } from "lucide-react";

const lifestyleTags = ["Travel", "Foodie", "Fitness", "Movies", "Music", "Art"];

const editProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  lifestyle_tags: z.array(z.string()).optional(),
  photo_urls: z.array(z.string()).min(1, "You must have at least one photo.").max(6, "You can upload a maximum of 6 photos."),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

interface EditProfileSheetProps {
  profile: any;
  onUpdate: () => void;
}

export const EditProfileSheet = ({ profile, onUpdate }: EditProfileSheetProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(profile.photo_urls || []);

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: profile.username || "",
      bio: profile.bio || "",
      lifestyle_tags: profile.lifestyle_tags || [],
      photo_urls: profile.photo_urls || [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const totalPhotos = previews.length + files.length;
    if (totalPhotos > 6) {
      showError("You can upload a maximum of 6 photos.");
      return;
    }

    setNewPhotos(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove: number, url: string) => {
    setPreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    
    // If it's an existing URL, update form value
    if (url.startsWith('http')) {
      const currentUrls = form.getValues("photo_urls");
      form.setValue("photo_urls", currentUrls.filter(u => u !== url));
    } else {
      // If it's a new file preview, remove from newPhotos
      const fileIndex = previews.indexOf(url) - form.getValues("photo_urls").length;
      setNewPhotos(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = form.getValues("lifestyle_tags") || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    form.setValue("lifestyle_tags", newTags);
  };

  const onSubmit = async (values: EditProfileValues) => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Upload new photos
      const uploadedUrls: string[] = [];
      for (const photo of newPhotos) {
        const fileName = `${Date.now()}_${photo.name}`;
        const filePath = `${user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('profile-photos').upload(filePath, photo);
        if (uploadError) throw new Error(`Failed to upload photo: ${uploadError.message}`);
        const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }

      // 2. Combine old and new photo URLs
      const finalPhotoUrls = [...values.photo_urls, ...uploadedUrls];

      // 3. Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          bio: values.bio,
          lifestyle_tags: values.lifestyle_tags,
          photo_urls: finalPhotoUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw new Error(`Failed to update profile: ${updateError.message}`);

      showSuccess("Profile updated successfully!");
      onUpdate(); // Refetch profile data on the profile page
      document.getElementById('close-sheet')?.click();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Your Profile</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
            <FormField
              control={form.control}
              name="photo_urls"
              render={() => (
                <FormItem>
                  <FormLabel>Your Photos</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                        <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeImage(index, src)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {previews.length < 6 && (
                      <label className="aspect-square flex flex-col items-center justify-center bg-muted rounded-md cursor-pointer hover:bg-muted/80">
                        <UploadCloud className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                        <Input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" multiple onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="username" render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem>
                <FormLabel>About Me</FormLabel>
                <FormControl><Textarea placeholder="Tell us about yourself..." className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <div className="flex flex-wrap gap-2 pt-2">
                {lifestyleTags.map((tag) => (
                  <Toggle key={tag} variant="outline" pressed={(form.watch("lifestyle_tags") || []).includes(tag)} onPressedChange={() => handleTagToggle(tag)}>
                    {tag}
                  </Toggle>
                ))}
              </div>
            </FormItem>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="ghost" id="close-sheet">Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};