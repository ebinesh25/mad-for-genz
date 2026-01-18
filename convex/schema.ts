import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  acronyms: defineTable({
    acronym: v.string(),
    definition: v.string(),
    explanation: v.string(),
    category: v.string(),
    popularity: v.number(),
  })
    .index("by_acronym", ["acronym"])
    .searchIndex("search_acronyms", {
      searchField: "acronym",
      filterFields: ["category"],
    }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
