// src/lib/categories.ts
export interface Category {
  value: string;
  label: string;
  color: string;
}

export const CATEGORIES = [
  { value: "Internet", label: "Internet", color: "beige" },
  { value: "Gen Z", label: "Gen Z", color: "silver" },
  { value: "Business", label: "Business", color: "grey-olive" },
  { value: "Technology", label: "Technology", color: "charcoal-brown" },
  { value: "Medical", label: "Medical", color: "vanilla-custard" },
  { value: "Education", label: "Education", color: "beige" },
  { value: "Government", label: "Government", color: "silver" },
  { value: "Finance", label: "Finance", color: "grey-olive" },
  { value: "Transportation", label: "Transportation", color: "charcoal-brown" },
  { value: "Entertainment", label: "Entertainment", color: "vanilla-custard" },
  { value: "Sports", label: "Sports", color: "beige" },
  { value: "Food", label: "Food", color: "silver" },
  { value: "Science", label: "Science", color: "grey-olive" },
  { value: "Gaming", label: "Gaming", color: "charcoal-brown" },
  { value: "Social Media", label: "Social Media", color: "vanilla-custard" },
  { value: "Social", label: "Social", color: "beige" },
  { value: "General", label: "General", color: "silver" },
  { value: "Recreation", label: "Recreation", color: "grey-olive" },
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
