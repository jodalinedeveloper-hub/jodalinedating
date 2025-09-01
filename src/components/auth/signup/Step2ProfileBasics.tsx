import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Step2ProfileBasicsProps {
  form: UseFormReturn<any>;
}

const Step2ProfileBasics = ({ form }: Step2ProfileBasicsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="woman">Woman</SelectItem>
                <SelectItem value="man">Man</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="orientation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sexual Orientation</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your orientation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="gay">Gay</SelectItem>
                <SelectItem value="bisexual">Bisexual</SelectItem>
                <SelectItem value="pansexual">Pansexual</SelectItem>
                <SelectItem value="queer">Queer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Nairobi, Kenya" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About Me</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us a little bit about yourself..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step2ProfileBasics;