import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const searchResults = useQuery(api.acronyms.searchAcronyms, { searchTerm });
  const allAcronyms = useQuery(api.acronyms.getAllAcronyms);
  
  const displayAcronyms = searchTerm.trim() ? searchResults : allAcronyms;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Acronym Dictionary</h1>
          <p className="text-gray-300">Search through 1000+ acronyms and abbreviations</p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search acronyms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {displayAcronyms?.length ? `${displayAcronyms.length} acronyms found` : 'Loading...'}
          </p>
        </div>

        {/* Acronym List */}
        <div className="space-y-4">
          {displayAcronyms?.map((acronym) => (
            <div key={acronym._id} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {acronym.acronym}
                  </h3>
                  <p className="text-gray-700 mb-2">
                    {acronym.definition}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {acronym.explanation}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded">
                    {acronym.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayAcronyms?.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-600">No acronyms found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
