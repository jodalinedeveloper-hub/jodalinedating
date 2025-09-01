import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";

interface Step3PreferencesProps {
  form: UseFormReturn<any>;
}

const lifestyleTags = ["Travel", "Foodie", "Fitness", "Movies", "Music", "Art"];

const Step3Preferences = ({ form }: Step3PreferencesProps) => {
  const handleTagToggle = (tag: string) => {
    const currentTags = form.getValues("lifestyleTags") || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    form.setValue("lifestyleTags", newTags);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="relationshipGoals"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Relationship Goals</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="long-term" />
                  </FormControl>
                  <FormLabel className="font-normal">Long-term relationship</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="casual" />
                  </FormControl>
                  <FormLabel className="font-normal">Something casual</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="friendship" />
                  </FormControl>
                  <FormLabel className="font-normal">Friendship</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ageRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age Range: {field.value?.join(' - ')}</FormLabel>
            <FormControl>
              <Slider
                defaultValue={field.value}
                onValueChange={field.onChange}
                min={18}
                max={65}
                step={1}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="maxDistance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Distance: {field.value?.[0]} km</FormLabel>
            <FormControl>
              <Slider
                defaultValue={field.value}
                onValueChange={field.onChange}
                min={5}
                max={150}
                step={5}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dealBreakers.smoker"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Deal-breaker: Must be a non-smoker
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
      <FormItem>
        <FormLabel>Lifestyle Tags</FormLabel>
        <div className="flex flex-wrap gap-2 pt-2">
          {lifestyleTags.map((tag) => (
            <Toggle
              key={tag}
              variant="outline"
              pressed={(form.getValues("lifestyleTags") || []).includes(tag)}
              onPressedChange={() => handleTagToggle(tag)}
            >
              {tag}
            </Toggle>
          ))}
        </div>
      </FormItem>
    </div>
  );
};

export default Step3Preferences;