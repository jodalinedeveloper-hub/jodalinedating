import { useState, useEffect } from "react";
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
import { UserProfile } from "@/types";

const lifestyleTags = ["Travel", "Foodie", "Fitness", "Movies", "Music", "Art"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const editProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),
  lifestyle_tags: z.array(z.string()).optional(),
  photo_urls: z.array(z.string()), // Existing URLs
  new_photos: z.array(z.any()) // New File objects
    .refine(files => !files || files.every(file => file instanceof File), "Invalid file format.")
    .refine(files => !files || files.every(file => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      files => !files || files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
}).refine(data => (data.photo_urls.length + (data.new_photos?.length || 0)) >= 1, {
    message: "You must have at least one photo.",
    path: ["photo_urls"], // Attach error to the photo upload area
}).refine(data => (data.photo_urls.length + (data.new_photos?.length || 0)) <= 6, {
    message: "You can upload a maximum of 6 photos.",
    path: ["photo_urls"],
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

interface EditProfileSheetProps {
  profile: UserProfile;
  onUpdate: () => void;
}

export const EditProfileSheet = ({ profile, onUpdate }: EditProfileSheetProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(profile.photo_urls || []);

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: profile.username || "",
      bio: profile.bio || "",
      lifestyle_tags: profile.lifestyle_tags || [],
      photo_urls: profile.photo_urls || [],
      new_photos: [],
    },
  });

  const existingUrls = form.watch("photo_urls");
  const newPhotos = form.watch("new_photos");

  useEffect(() => {
    const newPhotoPreviews = newPhotos.map(file => URL.createObjectURL(file));
    setPreviews([...existingUrls, ...newPhotoPreviews]);

    return () => {
      newPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [existingUrls, newPhotos]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const currentNewPhotos = form.getValues("new_photos");
    const currentExistingUrls = form.getValues("photo_urls");

    const totalPhotos = currentExistingUrls.length + currentNewPhotos.length + files.length;
    if (totalPhotos > 6) {
      showError("You can upload a maximum of 6 photos.");
      return;
    }
    
    form.setValue("new_photos", [...currentNewPhotos, ...files], { shouldValidate: true });
  };

  const removeImage = (indexToRemove: number) => {
    const currentExistingUrls = form.getValues("photo_urls");
    const currentNewPhotos = form.getValues("new_photos");

    if (indexToRemove < currentExistingUrls.length) {
      const updatedUrls = currentExistingUrls.filter((_, i) => i !== indexToRemove);
      form.setValue("photo_urls", updatedUrls, { shouldValidate: true });
    } else {
      const newPhotoIndex = indexToRemove - currentExistingUrls.length;
      const updatedNewPhotos = currentNewPhotos.filter((_, i) => i !== newPhotoIndex);
      form.setValue("new_photos", updatedNewPhotos, { shouldValidate: true });
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
      if (values.new_photos) {
        for (const photo of values.new_photos) {
          const fileName = `${Date.now()}_${photo.name}`;
          const filePath = `${user.id}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('profile-photos').upload(filePath, photo);
          if (uploadError) throw new Error(`Failed to upload photo: ${uploadError.message}`);
          const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
          uploadedUrls.push(publicUrl);
        }
      }

      const finalPhotoUrls = [...values.photo_urls, ...uploadedUrls];

      // 2. Update profile in the database
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

      // 3. Delete orphaned photos from storage
      const initialUrls = profile.photo_urls || [];
      const urlsToDelete = initialUrls.filter(url => !finalPhotoUrls.includes(url));
      if (urlsToDelete.length > 0) {
        const pathsToDelete = urlsToDelete.map(url => {
          const urlParts = url.split('/');
          return `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
        });
        const { error: deleteError } = await supabase.storage.from('profile-photos').remove(pathsToDelete);
        if (deleteError) {
          console.error("Failed to delete orphaned photos:", deleteError);
        }
      }

      showSuccess("Profile updated successfully!");
      onUpdate();
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
              name="photo_urls" // Error messages will attach here
              render={() => (
                <FormItem>
                  <FormLabel>Your Photos</FormLabel>
                  <div className="grid grid-cols-3 gap-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                        <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => removeImage(index)}>
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