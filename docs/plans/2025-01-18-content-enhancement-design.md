# Content Enhancement Feature Design

**Date:** 2025-01-18
**Status:** Design Approved

## Overview

Add content enhancement features to the acronym lookup website: Categories, Tags, and Usage Examples. These features enable users to browse and discover acronyms through filterable navigation, with real-world usage context.

## Goals

- Enable users to browse acronyms by category and filter by tags
- Provide usage examples showing real-world context for each acronym
- Keep implementation simple using embedded fields (Approach 1)
- Seed initial content manually, with expansion to user submissions later

---

## Database Schema

### Schema Updates

Extend the existing `acronyms` table in `convex/schema.ts`:

```typescript
acronyms: defineTable({
  // Existing fields
  term: v.string(),
  definition: v.string(),
  explanation: v.string(),

  // New fields
  category: v.string(),              // Single category
  tags: v.array(v.string()),         // Multiple tags
  examples: v.array(v.string()),     // Usage examples
})
  .index("by_category", ["category"])
  // ... existing indexes remain
```

### Category Values

Predefined categories stored as a const:
- `tech` - Technology and computing
- `social` - Social media and communication
- `gaming` - Gaming terminology
- `business` - Business and workplace
- `education` - Educational terms
- `slang` - General slang
- `lifestyle` - Lifestyle and casual

### Tag Conventions

- Free-form strings, normalized to lowercase
- No special characters for consistent filtering
- Examples: `texting`, `casual`, `formal`, `professional`, `emoji`

### Examples Format

- 1-3 usage examples per acronym
- Show real-world context
- Example: `["BRB, grabbing coffee!", "brb 5 min"]`

---

## Backend API

### New Queries

#### `listCategories`

Returns all categories with acronym counts.

```typescript
query: async ({ db }) => {
  const acronyms = await db.query("acronyms").collect();
  const categoryCounts = acronyms.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));
}
```

#### `listTags`

Returns all tags with usage counts (similar to `listCategories`).

#### `searchWithFilter`

Enhanced search with optional category and tag filters.

```typescript
query: async ({ db }, { searchTerm, category, tags }) => {
  let query = db.query("acronyms");

  // Apply category filter
  if (category) {
    query = query.withIndex("by_category", q => q.eq("category", category));
  }

  let results = await query.collect();

  // Apply search term filter
  if (searchTerm) {
    results = filterBySearchTerm(results, searchTerm);
  }

  // Apply tag filter
  if (tags?.length) {
    results = results.filter(a => tags.some(t => a.tags.includes(t)));
  }

  return results;
}
```

#### `getByCategory`

Get all acronyms for a specific category.

### New Mutations

#### `seedExamples`

Admin-only mutation to bulk-add examples to existing acronyms.

#### `addExample` (Future)

Add single example (reserved for when user submissions are enabled).

---

## UI Components

### New Components

#### `CategoryFilter.tsx`

Sidebar or top-bar displaying all categories as clickable chips.

- Displays category name + count badge
- Highlights selected category
- "All Categories" option to clear filter

#### `TagFilter.tsx`

Chips for tags, displaying top 10-15 most used tags.

- Multi-select capability
- "Clear tags" button

#### `AcronymCard.tsx` (Enhanced)

Enhanced result card with new content display.

```tsx
<div className="acronym-card">
  <h3>{term}</h3>
  <Badge category={category} />
  <div className="tags">
    {tags.map(tag => <TagPill key={tag}>{tag}</TagPill>)}
  </div>
  <p>{definition}</p>
  <details>
    <summary>Examples</summary>
    <ul>
      {examples.map(example => <li key={example}>{example}</li>)}
    </ul>
  </details>
</div>
```

### App.tsx Updates

- Add state for `selectedCategory` and `selectedTags`
- Pass filters to `searchWithFilter` query
- Render filter components above/below search bar

---

## Data Seeding Strategy

### Migration Script

Create `convex/seed.ts` with comprehensive mapping:

```typescript
export default mutation(async ({ db }) => {
  const acronyms = await db.query("acronyms").collect();

  const updates = {
    "LOL": {
      category: "social",
      tags: ["slang", "texting", "casual"],
      examples: ["LOL that was hilarious!", "lol i can't even"]
    },
    "BRB": {
      category: "social",
      tags: ["texting", "casual"],
      examples: ["BRB, grabbing coffee", "brb 5 min"]
    },
    // ... ~100 common acronyms
  };

  for (const acronym of acronyms) {
    if (updates[acronym.term]) {
      await db.patch(acronym._id, updates[acronym.term]);
    }
  }
});
```

### Seeding Phases

1. **Phase 1**: Seed ~100 most common acronyms with categories + examples
2. **Phase 2**: Bulk-assign tags based on keyword patterns
3. **Phase 3**: Manual review and refinement

### Execution

```bash
npx convex run seed
```

---

## Implementation Files

### New Files

- `src/components/CategoryFilter.tsx`
- `src/components/TagFilter.tsx`
- `src/components/AcronymCard.tsx` (refactor from inline)
- `convex/seed.ts`

### Modified Files

- `convex/schema.ts` - Add new fields and index
- `convex/acronyms.ts` - Add new queries and mutations
- `src/App.tsx` - Integrate filters and enhanced cards

---

## Future Enhancements

Out of scope for this implementation:

- User submission system for examples
- Category management interface
- Advanced tag management
- Trending acronyms based on usage
- "Acronym of the day" feature
