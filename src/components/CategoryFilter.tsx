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
    blue: { selected: "bg-blue-500 text-white", unselected: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    purple: { selected: "bg-purple-500 text-white", unselected: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    green: { selected: "bg-green-500 text-white", unselected: "bg-green-100 text-green-700 hover:bg-green-200" },
    cyan: { selected: "bg-cyan-500 text-white", unselected: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200" },
    red: { selected: "bg-red-500 text-white", unselected: "bg-red-100 text-red-700 hover:bg-red-200" },
    yellow: { selected: "bg-yellow-500 text-white", unselected: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
    gray: { selected: "bg-gray-500 text-white", unselected: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    emerald: { selected: "bg-emerald-500 text-white", unselected: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
    orange: { selected: "bg-orange-500 text-white", unselected: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
    pink: { selected: "bg-pink-500 text-white", unselected: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
    indigo: { selected: "bg-indigo-500 text-white", unselected: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
    amber: { selected: "bg-amber-500 text-white", unselected: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
    teal: { selected: "bg-teal-500 text-white", unselected: "bg-teal-100 text-teal-700 hover:bg-teal-200" },
    violet: { selected: "bg-violet-500 text-white", unselected: "bg-violet-100 text-violet-700 hover:bg-violet-200" },
    sky: { selected: "bg-sky-500 text-white", unselected: "bg-sky-100 text-sky-700 hover:bg-sky-200" },
    rose: { selected: "bg-rose-500 text-white", unselected: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
    slate: { selected: "bg-slate-500 text-white", unselected: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
    lime: { selected: "bg-lime-500 text-white", unselected: "bg-lime-100 text-lime-700 hover:bg-lime-200" },
  };

  if (!categories) return <div>Loading categories...</div>;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? "bg-gray-800 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
