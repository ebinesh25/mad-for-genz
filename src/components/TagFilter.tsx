// src/components/TagFilter.tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function TagFilter({
  selectedTags,
  onTagToggle,
}: TagFilterProps) {
  const tags = useQuery(api.acronyms.listTags);

  if (!tags) return <div>Loading tags...</div>;

  return (
    <div role="group" aria-label="Filter by tags" className="flex flex-wrap gap-2 mb-4">
      {tags.map(({ tag, count }) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            aria-pressed={isSelected}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-indigo-500 text-white"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            #{tag} ({count})
          </button>
        );
      })}
      {selectedTags.length > 0 && (
        <button
          onClick={() => selectedTags.forEach(t => onTagToggle(t))}
          aria-label={`Clear all ${selectedTags.length} selected tags`}
          className="px-3 py-1 rounded-full text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          Clear tags
        </button>
      )}
    </div>
  );
}
