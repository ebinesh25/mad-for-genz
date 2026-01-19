import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import CategoryFilter from "./components/CategoryFilter";
import TagFilter from "./components/TagFilter";
import AcronymCard from "./components/AcronymCard";
import RetryWithUrban from "./components/RetryWithUrban";
import { useDebounce } from "./hooks/useDebounce";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const searchResults = useQuery(api.acronyms.searchWithFilter, {
    searchTerm: debouncedSearchTerm,
    category: selectedCategory ?? '',
    tags: selectedTags,
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const displayAcronyms = searchResults || [];

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <header className="bg-charcoal-brown-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">MAD for GENZs</h1>
          
          <p className="text-silver-300">Search through 1000+ acronyms and abbreviations</p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search acronyms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-silver-300 rounded-lg text-lg focus:border-vanilla-custard-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Tag Filter */}
        <TagFilter
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />

        {/* Active Filters Display */}
        {(selectedCategory || selectedTags.length > 0) && (
          <div className="mb-4 text-sm text-silver-600">
            Active filters: {selectedCategory && `Category: ${selectedCategory}`}
            {selectedCategory && selectedTags.length > 0 && " | "}
            {selectedTags.length > 0 && `Tags: ${selectedTags.join(", ")}`}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-silver-600">
            {displayAcronyms.length} acronyms found
          </p>
        </div>

        {/* Acronym List */}
        <div className="space-y-4">
          {displayAcronyms.map((acronym) => (
            <AcronymCard key={acronym._id} {...acronym} />
          ))}
        </div>

        {displayAcronyms.length === 0 && Boolean(debouncedSearchTerm.trim()) && <RetryWithUrban searchTerm={debouncedSearchTerm} />}
      </div>
    </div>
  );
}
