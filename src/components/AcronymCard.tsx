// src/components/AcronymCard.tsx
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { getCategoryColor, getCategoryLabel } from "../lib/categories";

interface AcronymCardProps {
  _id: Id<"acronyms">;
  acronym: string;
  definition: string;
  explanation: string;
  category: string;
  tags?: string[];
  examples?: string[];
}

export default function AcronymCard({
  acronym,
  definition,
  explanation,
  category,
  tags = [],
  examples = [],
}: AcronymCardProps) {
  const COLOR_CLASSES: Record<string, string> = {
    beige: "bg-beige-500",
    silver: "bg-silver-500",
    'grey-olive': "bg-grey-olive-500",
    'charcoal-brown': "bg-charcoal-brown-500",
    'vanilla-custard': "bg-vanilla-custard-500",
  };

  const [showExamples, setShowExamples] = useState(false);
  const color = getCategoryColor(category);
  const badgeColor = COLOR_CLASSES[color] || COLOR_CLASSES.silver;

  return (
    <div className="border border-silver-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-beige-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-silver-900 mb-1">
            {acronym}
          </h3>
          <p className="text-silver-700 mb-2">
            {definition}
          </p>
          <p className="text-silver-600 text-sm mb-3">
            {explanation}
          </p>

          {/* Category Badge */}
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-1 ${badgeColor} text-white text-sm rounded`}
            >
              {getCategoryLabel(category)}
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 bg-silver-100 text-silver-600 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Examples */}
          {examples.length > 0 && (
            <details className="mt-3">
              <summary
                className="cursor-pointer text-sm text-grey-olive-600 hover:text-grey-olive-800"
                onClick={(e) => {
                  e.preventDefault();
                  setShowExamples(!showExamples);
                }}
              >
                {showExamples ? "Hide" : "Show"} examples
              </summary>
              {showExamples && (
                <ul className="mt-2 ml-4 list-disc text-sm text-silver-600">
                  {examples.map((example, index) => (
                    <li key={index}>"{example}"</li>
                  ))}
                </ul>
              )}
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
