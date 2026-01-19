import { useState, useEffect } from "react";
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
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // Auto-collapse filters when search is initiated
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setFiltersExpanded(false);
    }
  }, [debouncedSearchTerm]);

  const searchResults = useQuery(api.acronyms.searchWithFilter, {
    searchTerm: debouncedSearchTerm,
    category: selectedCategory ?? '',
    tags: selectedTags,
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, t]
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

        {/* Collapsible Filters */}
        <div className="mb-6">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="w-full px-2 py-2 flex items-center gap-2 text-silver-500 hover:text-silver-700 transition-colors focus:outline-none"
          >
            <svg
              className={`w-4 h-4 transition-transform ${filtersExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-sm font-medium">Filters</span>
          </button>

          {filtersExpanded && (
            <div className="mt-3 px-2">
              {/* Category Filter */}
              <div className="mb-4">
                <h3 className="text-xs font-medium text-silver-500 mb-2 uppercase tracking-wide">Category</h3>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Tag Filter */}
              <div>
                <h3 className="text-xs font-medium text-silver-500 mb-2 uppercase tracking-wide">Tags</h3>
                <TagFilter
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                />
              </div>
            </div>
          )}
        </div>

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
