"use client";

import { useEffect, useState } from "react";
import AcronymCard from "./AcronymCard";

interface RetryWithUrbanProps {
  searchTerm: string;
}

type Result = {
  word: string;
  meaning: string;
  example: string;
  contributor: string;
  date: string;
};

type AcronymCardProps = {
  acronym: string;
  definition: string;
  explanation: string;
  category: string;
  tags?: string[];
  examples?: string[];
};

export default function RetryWithUrban({ searchTerm }: RetryWithUrbanProps) {
  const [data, setData] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(`https://unofficialurbandictionaryapi.com/api/search?term=${encodeURIComponent(searchTerm)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          setData([]);
        }
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err as Error);
        setData([]);
        setLoading(false);
      });
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">Failed to load results. Please try again.</p>;

  if (!data || data.length === 0) return <p>No results found</p>;

  // Use the first result
  const firstResult = data[0];
  console.log(firstResult)
  const acronymCard: AcronymCardProps = {
    acronym: firstResult.word.toUpperCase(),
    definition: firstResult.meaning,
    explanation: firstResult.example,
    category: "general",
    examples: [firstResult.example],
  };

  return <AcronymCard {...acronymCard} />;
}