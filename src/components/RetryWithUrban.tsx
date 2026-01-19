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

  useEffect(() => {
    fetch(`https://unofficialurbandictionaryapi.com/api/search?term=${searchTerm}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;

  if (!data || data.length === 0) return <p>No results found</p>;

  // Use the first result
  const firstResult = data[0];
  console.log(firstResult)
  const acronymCard: AcronymCardProps = {
    acronym: firstResult.word,
    definition: firstResult.meaning,
    explanation: firstResult.example,
    category: "general",
    examples: [firstResult.example],
  };

  return <AcronymCard {...acronymCard} />;
}