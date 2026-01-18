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
        examples: ["That's cap", "No cap for real", "Stop capping"],
      },
      "RIZZ": {
        tags: ["genz", "slang", "charisma", "social"],
        examples: ["He's got rizz", "Unspoken rizz", "Rizz god"],
      },
      "ATE": {
        tags: ["genz", "slang", "praise", "social"],
        examples: ["She ate that", "Didn't leave a crumb", "Ate and left no crumbs"],
      },
      "W": {
        tags: ["genz", "slang", "win", "social"],
        examples: ["Big W", "Taking the W", "We got the W"],
      },

      // Business
      "ASAP": {
        tags: ["business", "urgent", "professional", "work"],
        examples: ["Please reply ASAP", "As soon as possible", "ASAP thanks"],
      },
      "CEO": {
        tags: ["business", "corporate", "leadership"],
        examples: ["The CEO announced...", "Chief executive officer", "CEO of what?"],
      },
      "KPI": {
        tags: ["business", "metrics", "corporate"],
        examples: ["Track our KPIs", "Key performance indicators", "KPI targets"],
      },
      "ROI": {
        tags: ["business", "finance", "metrics"],
        examples: ["What's the ROI?", "Return on investment", "Positive ROI"],
      },
      "MVP": {
        tags: ["business", "startup", "product"],
        examples: ["Launch the MVP first", "Minimum viable product", "Our MVP is live"],
      },
      "QA": {
        tags: ["business", "tech", "testing"],
        examples: ["Send to QA", "Quality assurance", "QA team"],
      },
      "B2B": {
        tags: ["business", "sales", "corporate"],
        examples: ["B2B sales", "Business to business", "B2B marketing"],
      },
      "SaaS": {
        tags: ["business", "tech", "software"],
        examples: ["SaaS platform", "Software as a service", "B2B SaaS"],
      },

      // Technology
      "API": {
        tags: ["tech", "coding", "developer"],
        examples: ["Use the API", "Application programming interface", "API endpoint"],
      },
      "UI": {
        tags: ["tech", "design", "developer"],
        examples: ["The UI looks great", "User interface", "UI/UX design"],
      },
      "UX": {
        tags: ["tech", "design", "experience"],
        examples: ["Great UX", "User experience", "UX research"],
      },
      "AI": {
        tags: ["tech", "future", "computing"],
        examples: ["AI is changing everything", "Artificial intelligence", "AI tools"],
      },
      "VR": {
        tags: ["tech", "gaming", "immersive"],
        examples: ["VR headset", "Virtual reality", "In VR"],
      },
      "AR": {
        tags: ["tech", "immersive", "mobile"],
        examples: ["AR features", "Augmented reality", "AR app"],
      },
      "URL": {
        tags: ["tech", "web", "internet"],
        examples: ["What's the URL?", "Website link", "Copy the URL"],
      },
      "VPN": {
        tags: ["tech", "security", "privacy"],
        examples: ["Connect to VPN", "Virtual private network", "Use a VPN"],
      },

      // Gaming
      "GG": {
        tags: ["gaming", "sports", "polite"],
        examples: ["GG everyone", "Good game", "gg wp"],
      },
      "GGWP": {
        tags: ["gaming", "polite", "sports"],
        examples: ["GGWP", "Good game well played", "ggwp all"],
      },
      "NPC": {
        tags: ["gaming", "genz", "slang"],
        examples: ["NPC behavior", "Non-player character", "Such an NPC"],
      },
      "AFK": {
        tags: ["gaming", "social", "away"],
        examples: ["BRB AFK", "Away from keyboard", "going AFK"],
      },
      "PvP": {
        tags: ["gaming", "multiplayer", "competitive"],
        examples: ["PvP mode", "Player vs player", "PvP arena"],
      },
      "RPG": {
        tags: ["gaming", "genre", "roleplay"],
        examples: ["Play an RPG", "Role playing game", "RPG elements"],
      },
      "MMO": {
        tags: ["gaming", "multiplayer", "online"],
        examples: ["Play an MMO", "Massively multiplayer online", "MMO game"],
      },

      // Medical
      "CPR": {
        tags: ["medical", "emergency", "health"],
        examples: ["Perform CPR", "Cardiopulmonary resuscitation", "CPR certified"],
      },
      "ER": {
        tags: ["medical", "emergency", "hospital"],
        examples: ["Go to the ER", "Emergency room", "At the ER"],
      },
      "ICU": {
        tags: ["medical", "hospital", "critical"],
        examples: ["In the ICU", "Intensive care unit", "ICU patient"],
      },

      // Transportation
      "GPS": {
        tags: ["transportation", "tech", "navigation"],
        examples: ["Check GPS", "Global positioning system", "Follow the GPS"],
      },
      "SUV": {
        tags: ["transportation", "vehicle", "car"],
        examples: ["Drive an SUV", "Sport utility vehicle", "SUVs are popular"],
      },
      "RV": {
        tags: ["transportation", "travel", "vehicle"],
        examples: ["Live in an RV", "Recreational vehicle", "RV trip"],
      },
      "ETA": {
        tags: ["transportation", "travel", "time"],
        examples: ["What's the ETA?", "Estimated time of arrival", "ETA 10 min"],
      },

      // Food
      "BBQ": {
        tags: ["food", "cooking", "social"],
        examples: ["BBQ tonight", "Barbecue", "BBQ sauce"],
      },
      "BLT": {
        tags: ["food", "sandwich", "restaurant"],
        examples: ["I'll have a BLT", "Bacon lettuce tomato", "BLT sandwich"],
      },
      "BYOB": {
        tags: ["food", "social", "party"],
        examples: ["It's BYOB", "Bring your own bottle", "BYOB party"],
      },

      // Social
      "RSVP": {
        tags: ["social", "event", "etiquette"],
        examples: ["Please RSVP", "Please respond", "RSVP by Friday"],
      },
      "VIP": {
        tags: ["social", "status", "exclusive"],
        examples: ["VIP access", "Very important person", "VIP treatment"],
      },
      "DIY": {
        tags: ["social", "crafts", "hobby"],
        examples: ["DIY project", "Do it yourself", "DIY tutorial"],
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
