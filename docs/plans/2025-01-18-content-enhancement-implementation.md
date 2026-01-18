# Content Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Categories (refine existing), Tags, and Usage Examples to the acronym lookup website with filterable browsing.

**Architecture:** Embedded fields approach (Approach 1) - add `tags` and `examples` arrays directly to existing acronym documents. Category field already exists. Backend queries for filtering by category/tags. UI components for clickable filter chips with counts.

**Tech Stack:** Convex (backend), React 19.2.1, Vite 6.2.0, Tailwind CSS, TypeScript

---

## Task 1: Update Database Schema

**Files:**
- Modify: `convex/schema.ts:6-18`

**Step 1: Add tags and examples fields to schema**

Edit the `acronyms` table definition to include the new fields. The `category` field already exists.

```typescript
acronyms: defineTable({
  acronym: v.string(),
  definition: v.string(),
  explanation: v.string(),
  category: v.string(),
  tags: v.array(v.string()),    // NEW: multiple tags per acronym
  examples: v.array(v.string()), // NEW: usage examples
  popularity: v.number(),
})
  .index("by_acronym", ["acronym"])
  .index("by_category", ["category"]) // NEW: index for category filtering
  .searchIndex("search_acronyms", {
    searchField: "acronym",
    filterFields: ["category"],
  }),
```

**Step 2: Run Convex dev to apply schema changes**

Run: `npx convex dev`

Expected: Convex detects schema change and prompts to apply. Type `y` to confirm.

**Step 3: Verify schema is deployed**

Run: `npx convex dashboard` or check browser console for any schema errors.

Expected: No errors, schema updated successfully.

**Step 4: Commit**

```bash
git add convex/schema.ts
git commit -m "feat: add tags and examples fields to acronym schema"
```

---

## Task 2: Create Category Constants

**Files:**
- Create: `src/lib/categories.ts`

**Step 1: Create category constants file**

```typescript
// src/lib/categories.ts
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

export function getCategoryColor(category: string): string {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.color : "gray";
}

export function getCategoryLabel(category: string): string {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.label : category;
}
```

**Step 2: Commit**

```bash
git add src/lib/categories.ts
git commit -m "feat: add category constants with colors"
```

---

## Task 3: Add Backend Query - List Categories with Counts

**Files:**
- Modify: `convex/acronyms.ts:41-42` (add after getAllAcronyms)

**Step 1: Add listCategories query**

```typescript
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const acronyms = await ctx.db.query("acronyms").collect();
    const categoryCounts = acronyms.reduce((acc, acronym) => {
      const cat = acronym.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  },
});
```

**Step 2: Run dev to verify query loads**

Run: `npm run dev` (keep running)

Expected: No TypeScript errors in browser console.

**Step 3: Commit**

```bash
git add convex/acronyms.ts
git commit -m "feat: add listCategories query"
```

---

## Task 4: Add Backend Query - List Tags with Counts

**Files:**
- Modify: `convex/acronyms.ts` (add after listCategories)

**Step 1: Add listTags query**

```typescript
export const listTags = query({
  args: {},
  handler: async (ctx) => {
    const acronyms = await ctx.db.query("acronyms").collect();
    const tagCounts = acronyms.reduce((acc, acronym) => {
      for (const tag of acronym.tags || []) {
        const normalizedTag = tag.toLowerCase().trim();
        if (normalizedTag) {
          acc[normalizedTag] = (acc[normalizedTag] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .filter(t => t.count >= 2) // Only show tags used 2+ times
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 tags
  },
});
```

**Step 2: Verify query loads**

Check browser console: No errors.

**Step 3: Commit**

```bash
git add convex/acronyms.ts
git commit -m "feat: add listTags query"
```

---

## Task 5: Add Backend Query - Search with Filters

**Files:**
- Modify: `convex/acronyms.ts` (add new query, keep existing searchAcronyms)

**Step 1: Add searchWithFilter query**

```typescript
export const searchWithFilter = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("acronyms");

    // Apply category filter if provided
    if (args.category) {
      query = query.withIndex("by_category", (q) =>
        q.eq("category", args.category!)
      );
    }

    let results = await query.collect();

    // Apply tag filter if provided
    if (args.tags && args.tags.length > 0) {
      results = results.filter((acronym) =>
        args.tags!.some((tag) => acronym.tags?.includes(tag))
      );
    }

    // Apply search term if provided
    if (args.searchTerm && args.searchTerm.trim()) {
      const term = args.searchTerm.toLowerCase();
      results = results.filter(
        (a) =>
          a.acronym.toLowerCase().includes(term) ||
          a.definition.toLowerCase().includes(term)
      );
    }

    return results;
  },
});
```

**Step 2: Verify query loads**

Check browser console: No errors.

**Step 3: Commit**

```bash
git add convex/acronyms.ts
git commit -m "feat: add searchWithFilter query with category and tag filtering"
```

---

## Task 6: Create CategoryFilter Component

**Files:**
- Create: `src/components/CategoryFilter.tsx`

**Step 1: Create CategoryFilter component**

```tsx
// src/components/CategoryFilter.tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
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
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? `bg-${color}-500 text-white`
                : `bg-${color}-100 text-${color}-700 hover:bg-${color}-200`
            }`}
          >
            {getCategoryLabel(category)} ({count})
          </button>
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/CategoryFilter.tsx
git commit -m "feat: add CategoryFilter component"
```

---

## Task 7: Create TagFilter Component

**Files:**
- Create: `src/components/TagFilter.tsx`

**Step 1: Create TagFilter component**

```tsx
// src/components/TagFilter.tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function TagFilter({
  selectedTags,
  onTagToggle,
}: TagFilterProps) {
  const tags = useQuery(api.acronyms.listTags);

  if (!tags) return <div>Loading tags...</div>;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(({ tag, count }) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-indigo-500 text-white"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            #{tag} ({count})
          </button>
        );
      })}
      {selectedTags.length > 0 && (
        <button
          onClick={() => selectedTags.forEach(t => onTagToggle(t))}
          className="px-3 py-1 rounded-full text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          Clear tags
        </button>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TagFilter.tsx
git commit -m "feat: add TagFilter component"
```

---

## Task 8: Create Enhanced AcronymCard Component

**Files:**
- Create: `src/components/AcronymCard.tsx`

**Step 1: Create AcronymCard component**

```tsx
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
  const [showExamples, setShowExamples] = useState(false);
  const color = getCategoryColor(category);

  return (
    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {acronym}
          </h3>
          <p className="text-gray-700 mb-2">
            {definition}
          </p>
          <p className="text-gray-600 text-sm mb-3">
            {explanation}
          </p>

          {/* Category Badge */}
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-1 bg-${color}-500 text-white text-sm rounded`}
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
                  className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
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
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  setShowExamples(!showExamples);
                }}
              >
                {showExamples ? "Hide" : "Show"} examples
              </summary>
              {showExamples && (
                <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
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
```

**Step 2: Commit**

```bash
git add src/components/AcronymCard.tsx
git commit -m "feat: add AcronymCard component with tags and examples"
```

---

## Task 9: Update App.tsx with Filters

**Files:**
- Modify: `src/App.tsx:1-77`

**Step 1: Replace App.tsx with filtered version**

```tsx
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import CategoryFilter from "./components/CategoryFilter";
import TagFilter from "./components/TagFilter";
import AcronymCard from "./components/AcronymCard";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const searchResults = useQuery(api.acronyms.searchWithFilter, {
    searchTerm,
    category: selectedCategory,
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
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search acronyms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
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
          <div className="mb-4 text-sm text-gray-600">
            Active filters: {selectedCategory && `Category: ${selectedCategory}`}
            {selectedCategory && selectedTags.length > 0 && " | "}
            {selectedTags.length > 0 && `Tags: ${selectedTags.join(", ")}`}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {displayAcronyms.length} acronyms found
          </p>
        </div>

        {/* Acronym List */}
        <div className="space-y-4">
          {displayAcronyms.map((acronym) => (
            <AcronymCard key={acronym._id} {...acronym} />
          ))}
        </div>

        {displayAcronyms.length === 0 && (searchTerm || selectedCategory || selectedTags.length > 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No acronyms found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify UI renders**

Check browser: Filters should appear, search should work.

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate CategoryFilter, TagFilter, and AcronymCard into App"
```

---

## Task 10: Create Seed Migration Script

**Files:**
- Create: `convex/seedContentEnhancement.ts`

**Step 1: Create seed migration script**

```typescript
// convex/seedContentEnhancement.ts
import { mutation } from "./_generated/server";

export const seedTagsAndExamples = mutation({
  args: {},
  handler: async (ctx) => {
    const acronyms = await ctx.db.query("acronyms").collect();

    // Comprehensive mapping of acronyms to tags and examples
    const updates: Record<string, { tags: string[]; examples: string[] }> = {
      // Internet & Social Media
      "LOL": {
        tags: ["slang", "texting", "casual", "social"],
        examples: ["LOL that was hilarious!", "lol i can't even", "LOL same"],
      },
      "BRB": {
        tags: ["texting", "casual", "social"],
        examples: ["BRB, grabbing coffee", "brb 5 min", "BRB gotta run"],
      },
      "BTW": {
        tags: ["social", "casual", "conversation"],
        examples: ["BTW, did you see the news?", "btw here's the link"],
      },
      "DM": {
        tags: ["social", "messaging", "communication"],
        examples: ["DM me the details", "Check your DMs", "I'll DM you"],
      },
      "TBH": {
        tags: ["slang", "social", "honest", "casual"],
        examples: ["TBH I didn't like it", "tbh same", "TBH I'm tired"],
      },
      "NGL": {
        tags: ["slang", "social", "honest", "genz"],
        examples: ["NGL that's kinda true", "ngl I didn't study", "NGL looks good"],
      },
      "FR": {
        tags: ["slang", "social", "agreement", "genz"],
        examples: ["FR tho", "for real though", "FR that happened"],
      },
      "IMO": {
        tags: ["social", "opinion", "casual"],
        examples: ["IMO the best one", "imo it's fine", "In my opinion"],
      },
      "FYI": {
        tags: ["business", "professional", "information"],
        examples: ["FYI meeting is at 3pm", "Just so you know", "fyi here's the file"],
      },
      "IRL": {
        tags: ["social", "casual", "lifestyle"],
        examples: ["Have we met IRL?", "in real life", "IRL friends"],
      },
      "ICYMI": {
        tags: ["social", "media", "sharing"],
        examples: ["ICYMI this went viral", "In case you missed it"],
      },
      "TL;DR": {
        tags: ["internet", "casual", "summary"],
        examples: ["TL;DR they won", "Too long didn't read", "tl dr basically yes"],
      },

      // Gen Z Slang
      "IFYKYK": {
        tags: ["genz", "slang", "exclusive", "social"],
        examples: ["That vibe ifykyk", "if you know you know"],
      },
      "PERIODT": {
        tags: ["genz", "slang", "emphasis", "social"],
        examples: ["She ate that periodt", "periodt.", "And that's final periodt"],
      },
      "SLAY": {
        tags: ["genz", "slang", "praise", "social"],
        examples: ["You slay!", "She slayed that outfit", "Slay queen"],
      },
      "BESTIE": {
        tags: ["genz", "social", "friendship", "casual"],
        examples: ["Hey bestie!", "My besties are coming", "Bestie vibes"],
      },
      "STAN": {
        tags: ["genz", "slang", "fandom", "social"],
        examples: ["I stan this artist", "We stan", "stanning hard"],
      },
      "FOMO": {
        tags: ["genz", "social", "anxiety", "lifestyle"],
        examples: ["Major FOMO right now", "Fear of missing out", "FOMO is real"],
      },
      "GOAT": {
        tags: ["genz", "sports", "praise", "slang"],
        examples: ["Messi is the GOAT", "Greatest of all time", "GOAT status"],
      },
      "MOOD": {
        tags: ["genz", "slang", "relatable", "social"],
        examples: ["Big mood", "That's a mood", "literally mood"],
      },
      "BET": {
        tags: ["genz", "slang", "agreement", "social"],
        examples: ["Bet, see you there", "You bet", "bet let's go"],
      },
      "CAP": {
        tags: ["genz", "slang", "lie", "social"],
        examples: ["That's cap", ["No cap for real"], ["Stop capping"]],
      },
      "RIZZ": {
        tags: ["genz", "slang", "charisma", "social"],
        examples: ["He's got rizz", "Unspoken rizz", "Rizz god"],
      },
      "ATE": {
        tags: ["genz", "slang", "praise", "social"],
        examples: ["She ate that", ["Didn't leave a crumb"], ["Ate and left no crumbs"]],
      },
      "W": {
        tags: ["genz", "slang", "win", "social"],
        examples: ["Big W", ["Taking the W"], ["We got the W"]],
      },

      // Business
      "ASAP": {
        tags: ["business", "urgent", "professional", "work"],
        examples: ["Please reply ASAP", ["As soon as possible"], ["ASAP thanks"]],
      },
      "CEO": {
        tags: ["business", "corporate", "leadership"],
        examples: ["The CEO announced...", ["Chief executive officer"], ["CEO of what?"]],
      },
      "KPI": {
        tags: ["business", "metrics", "corporate"],
        examples: ["Track our KPIs", ["Key performance indicators"], ["KPI targets"]],
      },
      "ROI": {
        tags: ["business", "finance", "metrics"],
        examples: ["What's the ROI?", ["Return on investment"], ["Positive ROI"]],
      },
      "MVP": {
        tags: ["business", "startup", "product"],
        examples: ["Launch the MVP first", ["Minimum viable product"], ["Our MVP is live"]],
      },
      "QA": {
        tags: ["business", "tech", "testing"],
        examples: ["Send to QA", ["Quality assurance"], ["QA team"]],
      },
      "B2B": {
        tags: ["business", "sales", "corporate"],
        examples: ["B2B sales", ["Business to business"], ["B2B marketing"]],
      },
      "SaaS": {
        tags: ["business", "tech", "software"],
        examples: ["SaaS platform", ["Software as a service"], ["B2B SaaS"]],
      },

      // Technology
      "API": {
        tags: ["tech", "coding", "developer"],
        examples: ["Use the API", ["Application programming interface"], ["API endpoint"]],
      },
      "UI": {
        tags: ["tech", "design", "developer"],
        examples: ["The UI looks great", ["User interface"], ["UI/UX design"]],
      },
      "UX": {
        tags: ["tech", "design", "experience"],
        examples: ["Great UX", ["User experience"], ["UX research"]],
      },
      "AI": {
        tags: ["tech", "future", "computing"],
        examples: ["AI is changing everything", ["Artificial intelligence"], ["AI tools"]],
      },
      "VR": {
        tags: ["tech", "gaming", "immersive"],
        examples: ["VR headset", ["Virtual reality"], ["In VR"]],
      },
      "AR": {
        tags: ["tech", "immersive", "mobile"],
        examples: ["AR features", ["Augmented reality"], ["AR app"]],
      },
      "URL": {
        tags: ["tech", "web", "internet"],
        examples: ["What's the URL?", ["Website link"], ["Copy the URL"]],
      },
      "VPN": {
        tags: ["tech", "security", "privacy"],
        examples: ["Connect to VPN", ["Virtual private network"], ["Use a VPN"]],
      },

      // Gaming
      "GG": {
        tags: ["gaming", "sports", "polite"],
        examples: ["GG everyone", ["Good game"], ["gg wp"]],
      },
      "GGWP": {
        tags: ["gaming", "polite", "sports"],
        examples: ["GGWP", ["Good game well played"], ["ggwp all"]],
      },
      "NPC": {
        tags: ["gaming", "genz", "slang"],
        examples: ["NPC behavior", ["Non-player character"], ["Such an NPC"]],
      },
      "AFK": {
        tags: ["gaming", "social", "away"],
        examples: ["BRB AFK", ["Away from keyboard"], ["going AFK"]],
      },
      "PvP": {
        tags: ["gaming", "multiplayer", "competitive"],
        examples: ["PvP mode", ["Player vs player"], ["PvP arena"]],
      },
      "RPG": {
        tags: ["gaming", "genre", "roleplay"],
        examples: ["Play an RPG", ["Role playing game"], ["RPG elements"]],
      },
      "MMO": {
        tags: ["gaming", "multiplayer", "online"],
        examples: ["Play an MMO", ["Massively multiplayer online"], ["MMO game"]],
      },

      // Medical
      "CPR": {
        tags: ["medical", "emergency", "health"],
        examples: ["Perform CPR", ["Cardiopulmonary resuscitation"], ["CPR certified"]],
      },
      "ER": {
        tags: ["medical", "emergency", "hospital"],
        examples: ["Go to the ER", ["Emergency room"], ["At the ER"]],
      },
      "ICU": {
        tags: ["medical", "hospital", "critical"],
        examples: ["In the ICU", ["Intensive care unit"], ["ICU patient"]],
      },

      // Transportation
      "GPS": {
        tags: ["transportation", "tech", "navigation"],
        examples: ["Check GPS", ["Global positioning system"], ["Follow the GPS"]],
      },
      "SUV": {
        tags: ["transportation", "vehicle", "car"],
        examples: ["Drive an SUV", ["Sport utility vehicle"], ["SUVs are popular"]],
      },
      "RV": {
        tags: ["transportation", "travel", "vehicle"],
        examples: ["Live in an RV", ["Recreational vehicle"], ["RV trip"]],
      },
      "ETA": {
        tags: ["transportation", "travel", "time"],
        examples: ["What's the ETA?", ["Estimated time of arrival"], ["ETA 10 min"]],
      },

      // Food
      "BBQ": {
        tags: ["food", "cooking", "social"],
        examples: ["BBQ tonight", ["Barbecue"], ["BBQ sauce"]],
      },
      "BLT": {
        tags: ["food", "sandwich", "restaurant"],
        examples: ["I'll have a BLT", ["Bacon lettuce tomato"], ["BLT sandwich"]],
      },
      "BYOB": {
        tags: ["food", "social", "party"],
        examples: ["It's BYOB", ["Bring your own bottle"], ["BYOB party"]],
      },

      // Social
      "RSVP": {
        tags: ["social", "event", "etiquette"],
        examples: ["Please RSVP", ["Please respond"], ["RSVP by Friday"]],
      },
      "VIP": {
        tags: ["social", "status", "exclusive"],
        examples: ["VIP access", ["Very important person"], ["VIP treatment"]],
      },
      "DIY": {
        tags: ["social", "crafts", "hobby"],
        examples: ["DIY project", ["Do it yourself"], ["DIY tutorial"]],
      },
    };

    let updatedCount = 0;

    for (const acronym of acronyms) {
      const update = updates[acronym.acronym];
      if (update) {
        await ctx.db.patch(acronym._id, {
          tags: update.tags,
          examples: update.examples,
        });
        updatedCount++;
      }
    }

    return `Seeded tags and examples for ${updatedCount} acronyms`;
  },
});
```

**Step 2: Run the seed**

Run: `npx convex run seedContentEnhancement`

Expected: Returns message like "Seeded tags and examples for X acronyms"

**Step 3: Verify data in browser**

Check browser: Acronyms should now show tags and examples.

**Step 4: Commit**

```bash
git add convex/seedContentEnhancement.ts
git commit -m "feat: add seed script for tags and examples"
```

---

## Task 11: Create components directory index

**Files:**
- Create: `src/components/index.ts`

**Step 1: Create barrel export for components**

```typescript
// src/components/index.ts
export { default as CategoryFilter } from "./CategoryFilter";
export { default as TagFilter } from "./TagFilter";
export { default as AcronymCard } from "./AcronymCard";
```

**Step 2: Commit**

```bash
git add src/components/index.ts
git commit -m "chore: add components barrel export"
```

---

## Task 12: Final Testing

**Files:**
- No file modifications

**Step 1: Test full functionality**

1. Open browser to `http://localhost:5173`
2. Test search: Type "LOL" - should show results
3. Test category filter: Click "Internet" - should filter
4. Test tag filter: Click "#slang" - should filter
5. Test combined filters: Category + Tag + Search
6. Test "Show examples" on acronym cards
7. Test "Clear tags" button
8. Test "All Categories" button

**Step 2: Verify no console errors**

Check browser console: Should be clean, no errors.

**Step 3: Run type check**

Run: `npm run lint` or `npx tsc --noEmit`

Expected: No TypeScript errors.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete content enhancement features with tags and examples"
```

---

## Task 13: Create Feature Documentation

**Files:**
- Create: `docs/features/content-enhancement.md`

**Step 1: Write feature documentation**

```markdown
# Content Enhancement Features

## Overview

The acronym lookup now supports:
- **Category Filtering**: Browse by predefined categories
- **Tag Filtering**: Filter by multiple tags with multi-select
- **Usage Examples**: Real-world examples for common acronyms

## Features

### Category Filter
- Located at top of page below search bar
- Shows all categories with acronym counts
- Click to filter, click "All Categories" to clear
- Color-coded by category type

### Tag Filter
- Located below category filter
- Shows top 15 most-used tags
- Multi-select: click multiple tags
- "Clear tags" button appears when tags selected

### Usage Examples
- Click "Show examples" on any acronym card
- Displays 1-3 real-world usage examples
- Examples show context for how acronym is used

## Usage

1. **Browse by Category**: Click a category chip to see only acronyms in that category
2. **Combine Filters**: Use category + tag + search together
3. **View Examples**: Expand acronym cards to see usage examples

## Categories

18 categories available: Internet, Gen Z, Business, Technology, Medical, Education, Government, Finance, Transportation, Entertainment, Sports, Food, Science, Gaming, Social Media, Social, General, Recreation

## Tags

Tags are normalized (lowercase) and include: slang, texting, casual, social, business, professional, genz, gaming, tech, coding, and more.
```

**Step 2: Commit**

```bash
git add docs/features/content-enhancement.md
git commit -m "docs: add content enhancement feature documentation"
```

---

## Task 14: Clean Up and Finalize

**Files:**
- No file modifications

**Step 1: Run full test suite**

Run: `npm run lint`

Expected: No errors.

**Step 2: Build production bundle**

Run: `npm run build`

Expected: Build succeeds with no errors.

**Step 3: Review git log**

Run: `git log --oneline -15`

Expected: See all commits from this implementation.

**Step 4: Final summary commit**

```bash
git tag -a v1.1.0 -m "Release content enhancement features"
git push origin main --tags
```

---

## Summary of Changes

**Files Created:**
- `src/lib/categories.ts` - Category constants with colors
- `src/components/CategoryFilter.tsx` - Category filter UI
- `src/components/TagFilter.tsx` - Tag filter UI
- `src/components/AcronymCard.tsx` - Enhanced acronym display
- `src/components/index.ts` - Component barrel export
- `convex/seedContentEnhancement.ts` - Data seeding script
- `docs/features/content-enhancement.md` - Feature documentation

**Files Modified:**
- `convex/schema.ts` - Added tags and examples fields
- `convex/acronyms.ts` - Added 3 new queries (listCategories, listTags, searchWithFilter)
- `src/App.tsx` - Integrated all new components

**Total Commits:** 14 incremental commits

**Test Commands:**
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npx convex run seedContentEnhancement` - Seed example data
