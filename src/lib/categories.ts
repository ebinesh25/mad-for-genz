// src/lib/categories.ts
export interface Category {
  value: string;
  label: string;
  color: string;
}

export const CATEGORIES = [
  { value: "Internet", label: "Internet", color: "blue" },
  { value: "Gen Z", label: "Gen Z", color: "purple" },
  { value: "Business", label: "Business", color: "green" },
  { value: "Technology", label: "Technology", color: "cyan" },
  { value: "Medical", label: "Medical", color: "red" },
  { value: "Education", label: "Education", color: "yellow" },
  { value: "Government", label: "Government", color: "gray" },
  { value: "Finance", label: "Finance", color: "emerald" },
  { value: "Transportation", label: "Transportation", color: "orange" },
  { value: "Entertainment", label: "Entertainment", color: "pink" },
  { value: "Sports", label: "Sports", color: "indigo" },
  { value: "Food", label: "Food", color: "amber" },
  { value: "Science", label: "Science", color: "teal" },
  { value: "Gaming", label: "Gaming", color: "violet" },
  { value: "Social Media", label: "Social Media", color: "sky" },
  { value: "Social", label: "Social", color: "rose" },
  { value: "General", label: "General", color: "slate" },
  { value: "Recreation", label: "Recreation", color: "lime" },
] as const;

export type CategoryValue = typeof CATEGORIES[number]["value"];

function getCategory(category: CategoryValue | string): Category | undefined {
  return CATEGORIES.find(c => c.value === category);
}

export function getCategoryColor(category: CategoryValue | string): string {
  const cat = getCategory(category);
  return cat ? cat.color : "gray";
}

export function getCategoryLabel(category: CategoryValue | string): string {
  const cat = getCategory(category);
  return cat ? cat.label : category;
}
