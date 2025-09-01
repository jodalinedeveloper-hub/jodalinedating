import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface IcebreakerSuggestionsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  "Most spontaneous thing you've ever done?",
  "What's a skill you'd love to learn?",
  "If you could eat only one food for the rest of your life, what would it be?",
];

const IcebreakerSuggestions = ({ onSelect }: IcebreakerSuggestionsProps) => {
  return (
    <div className="p-2 space-y-2">
        <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold">AI Icebreakers</h4>
        </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default IcebreakerSuggestions;