// src/components/CategoryFilter.tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getCategoryColor, getCategoryLabel } from "../lib/categories";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = useQuery(api.acronyms.listCategories);

  // Static color classes mapping for Tailwind JIT compiler compatibility
  const COLOR_CLASSES: Record<string, { selected: string; unselected: string }> = {
    beige: { selected: "bg-beige-500 text-white", unselected: "bg-beige-100 text-beige-700 hover:bg-beige-200" },
    silver: { selected: "bg-silver-500 text-white", unselected: "bg-silver-100 text-silver-700 hover:bg-silver-200" },
    'grey-olive': { selected: "bg-grey-olive-500 text-white", unselected: "bg-grey-olive-100 text-grey-olive-700 hover:bg-grey-olive-200" },
    'charcoal-brown': { selected: "bg-charcoal-brown-500 text-white", unselected: "bg-charcoal-brown-100 text-charcoal-brown-700 hover:bg-charcoal-brown-200" },
    'vanilla-custard': { selected: "bg-vanilla-custard-500 text-white", unselected: "bg-vanilla-custard-100 text-vanilla-custard-700 hover:bg-vanilla-custard-200" },
  };

  if (!categories) return <div>Loading categories...</div>;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? "bg-charcoal-brown-800 text-white"
            : "bg-silver-100 text-silver-700 hover:bg-silver-200"
        }`}
      >
        All Categories
      </button>
      {categories.map(({ category, count }) => {
        const color = getCategoryColor(category);
        const classes = COLOR_CLASSES[color] || COLOR_CLASSES.gray;
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${isSelected ? classes.selected : classes.unselected}`}
          >
            {getCategoryLabel(category)} ({count})
          </button>
        );
      })}
    </div>
  );
}
