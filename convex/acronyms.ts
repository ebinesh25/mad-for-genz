import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const searchAcronyms = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return [];
    }

    // First try exact match
    const exactMatch = await ctx.db
      .query("acronyms")
      .withIndex("by_acronym", (q) => q.eq("acronym", args.searchTerm.toUpperCase()))
      .first();

    if (exactMatch) {
      return [exactMatch];
    }

    // Then try search index
    const searchResults = await ctx.db
      .query("acronyms")
      .withSearchIndex("search_acronyms", (q) =>
        q.search("acronym", args.searchTerm)
      )
      .take(50);

    return searchResults;
  },
});

export const getAllAcronyms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("acronyms")
      .order("asc")
      .collect();
  },
});

export const seedAcronyms = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if acronyms already exist
    const existing = await ctx.db.query("acronyms").first();
    if (existing) {
      return "Acronyms already seeded";
    }

    const acronyms = [
      // Internet & Social Media
      { acronym: "AFAIK", definition: "As Far As I Know", explanation: "Used when sharing information that might not be complete or certain.", category: "Internet", popularity: 85 },
      { acronym: "AFK", definition: "Away From Keyboard", explanation: "Indicates that someone is temporarily not available at their computer.", category: "Internet", popularity: 80 },
      { acronym: "ASAP", definition: "As Soon As Possible", explanation: "Indicates urgency or the need for quick action.", category: "Business", popularity: 95 },
      { acronym: "BRB", definition: "Be Right Back", explanation: "Used to indicate a short absence from a conversation.", category: "Internet", popularity: 90 },
      { acronym: "BTW", definition: "By The Way", explanation: "Used to introduce additional information or change topics.", category: "Internet", popularity: 88 },
      { acronym: "DM", definition: "Direct Message", explanation: "A private message sent on social media platforms.", category: "Social Media", popularity: 92 },
      { acronym: "FAQ", definition: "Frequently Asked Questions", explanation: "A list of common questions and their answers.", category: "Internet", popularity: 75 },
      { acronym: "FTW", definition: "For The Win", explanation: "Used to express enthusiasm or support for something.", category: "Internet", popularity: 78 },
      { acronym: "FYI", definition: "For Your Information", explanation: "Used when sharing information that might be useful.", category: "Business", popularity: 90 },
      { acronym: "ICYMI", definition: "In Case You Missed It", explanation: "Used when resharing or highlighting previous content.", category: "Social Media", popularity: 70 },
      { acronym: "IDK", definition: "I Don't Know", explanation: "Simple expression of not knowing something.", category: "Internet", popularity: 95 },
      { acronym: "IIRC", definition: "If I Recall Correctly", explanation: "Used when sharing information from memory that might not be exact.", category: "Internet", popularity: 65 },
      { acronym: "IMO", definition: "In My Opinion", explanation: "Used to preface a personal viewpoint.", category: "Internet", popularity: 85 },
      { acronym: "IMHO", definition: "In My Humble Opinion", explanation: "A more modest way to share a personal viewpoint.", category: "Internet", popularity: 75 },
      { acronym: "IRL", definition: "In Real Life", explanation: "Refers to offline or physical world interactions.", category: "Internet", popularity: 88 },
      { acronym: "JK", definition: "Just Kidding", explanation: "Used to indicate that a previous statement was meant as a joke.", category: "Internet", popularity: 92 },
      { acronym: "LMAO", definition: "Laughing My Ass Off", explanation: "Indicates something is very funny.", category: "Internet", popularity: 90 },
      { acronym: "LOL", definition: "Laugh Out Loud", explanation: "Indicates amusement or that something is funny.", category: "Internet", popularity: 98 },
      { acronym: "NSFW", definition: "Not Safe For Work", explanation: "Warning that content is inappropriate for professional settings.", category: "Internet", popularity: 85 },
      { acronym: "OMG", definition: "Oh My God", explanation: "Expression of surprise, shock, or excitement.", category: "Internet", popularity: 95 },
      { acronym: "ROFL", definition: "Rolling On Floor Laughing", explanation: "Indicates something is extremely funny.", category: "Internet", popularity: 70 },
      { acronym: "SMH", definition: "Shaking My Head", explanation: "Expression of disappointment or disbelief.", category: "Internet", popularity: 88 },
      { acronym: "TBH", definition: "To Be Honest", explanation: "Used before sharing a frank or candid opinion.", category: "Internet", popularity: 92 },
      { acronym: "TL;DR", definition: "Too Long; Didn't Read", explanation: "Used to provide a summary of lengthy content.", category: "Internet", popularity: 80 },
      { acronym: "TMI", definition: "Too Much Information", explanation: "Indicates that someone has shared overly personal details.", category: "Internet", popularity: 85 },
      { acronym: "TTYL", definition: "Talk To You Later", explanation: "A casual way to end a conversation.", category: "Internet", popularity: 88 },
      { acronym: "WTF", definition: "What The F***", explanation: "Expression of confusion, anger, or disbelief.", category: "Internet", popularity: 90 },
      { acronym: "YOLO", definition: "You Only Live Once", explanation: "Used to justify taking risks or living life to the fullest.", category: "Internet", popularity: 85 },

      // Gen Z & Modern Slang
      { acronym: "NGL", definition: "Not Gonna Lie", explanation: "Used before sharing an honest opinion or admission.", category: "Gen Z", popularity: 98 },
      { acronym: "FR", definition: "For Real", explanation: "Used to emphasize truth or express agreement.", category: "Gen Z", popularity: 96 },
      { acronym: "IFYKYK", definition: "If You Know, You Know", explanation: "References something only certain people will understand.", category: "Gen Z", popularity: 95 },
      { acronym: "IYKYK", definition: "If You Know You Know", explanation: "Alternative spelling of IFYKYK.", category: "Gen Z", popularity: 90 },
      { acronym: "PERIODT", definition: "Period", explanation: "Emphasizes a point with finality.", category: "Gen Z", popularity: 88 },
      { acronym: "SLAY", definition: "To Do Something Exceptionally Well", explanation: "Praise for excellent performance or appearance.", category: "Gen Z", popularity: 92 },
      { acronym: "BESTIE", definition: "Best Friend", explanation: "Term of endearment for a close friend.", category: "Gen Z", popularity: 89 },
      { acronym: "STAN", definition: "To Be a Big Fan Of", explanation: "To support someone or something intensely.", category: "Gen Z", popularity: 87 },
      { acronym: "SIMP", definition: "Someone Who Does Too Much for Someone They Like", explanation: "Often used playfully to describe excessive attention.", category: "Gen Z", popularity: 84 },
      { acronym: "FOMO", definition: "Fear of Missing Out", explanation: "Anxiety about missing exciting events or experiences.", category: "Gen Z", popularity: 91 },
      { acronym: "GOAT", definition: "Greatest of All Time", explanation: "Used to describe someone who excels in their field.", category: "Gen Z", popularity: 94 },
      { acronym: "FACTS", definition: "That's True", explanation: "Strong agreement or emphasis on correctness.", category: "Gen Z", popularity: 86 },
      { acronym: "LOWKEY", definition: "Somewhat", explanation: "Used to downplay or express mild opinion.", category: "Gen Z", popularity: 93 },
      { acronym: "HIGHKEY", definition: "Very Much", explanation: "Used to emphasize something strongly.", category: "Gen Z", popularity: 81 },
      { acronym: "VIBE", definition: "Mood or Feeling", explanation: "Describes the overall energy of a situation.", category: "Gen Z", popularity: 95 },
      { acronym: "MOOD", definition: "Relatable", explanation: "Expresses that you relate to something.", category: "Gen Z", popularity: 97 },
      { acronym: "BET", definition: "Okay", explanation: "Shows agreement or confirms you'll do something.", category: "Gen Z", popularity: 90 },
      { acronym: "CAP", definition: "Lie", explanation: "Indicates that something is false or untrue.", category: "Gen Z", popularity: 85 },
      { acronym: "NO CAP", definition: "No Lie", explanation: "Emphasizes that something is true.", category: "Gen Z", popularity: 88 },
      { acronym: "SLAPS", definition: "Is Really Good", explanation: "Used to describe something excellent, especially music.", category: "Gen Z", popularity: 82 },

      // Business & Professional
      { acronym: "CEO", definition: "Chief Executive Officer", explanation: "The highest-ranking executive in a company.", category: "Business", popularity: 95 },
      { acronym: "CFO", definition: "Chief Financial Officer", explanation: "Executive responsible for financial operations.", category: "Business", popularity: 85 },
      { acronym: "CTO", definition: "Chief Technology Officer", explanation: "Executive responsible for technology strategy.", category: "Business", popularity: 80 },
      { acronym: "HR", definition: "Human Resources", explanation: "Department managing employee relations and policies.", category: "Business", popularity: 90 },
      { acronym: "KPI", definition: "Key Performance Indicator", explanation: "Metrics used to measure success or performance.", category: "Business", popularity: 75 },
      { acronym: "ROI", definition: "Return on Investment", explanation: "Measure of investment efficiency or profitability.", category: "Business", popularity: 85 },
      { acronym: "B2B", definition: "Business to Business", explanation: "Commerce transactions between businesses.", category: "Business", popularity: 80 },
      { acronym: "B2C", definition: "Business to Consumer", explanation: "Commerce transactions between business and consumers.", category: "Business", popularity: 78 },
      { acronym: "SaaS", definition: "Software as a Service", explanation: "Cloud-based software delivery model.", category: "Technology", popularity: 70 },
      { acronym: "API", definition: "Application Programming Interface", explanation: "Set of protocols for building software applications.", category: "Technology", popularity: 75 },
      { acronym: "CRM", definition: "Customer Relationship Management", explanation: "System for managing customer interactions.", category: "Business", popularity: 70 },
      { acronym: "ERP", definition: "Enterprise Resource Planning", explanation: "Integrated management of business processes.", category: "Business", popularity: 65 },
      { acronym: "MVP", definition: "Minimum Viable Product", explanation: "Product with basic features for early customer feedback.", category: "Business", popularity: 75 },
      { acronym: "QA", definition: "Quality Assurance", explanation: "Process of ensuring product quality standards.", category: "Business", popularity: 80 },
      { acronym: "R&D", definition: "Research and Development", explanation: "Activities for innovation and product development.", category: "Business", popularity: 85 },

      // Technology & Computing
      { acronym: "AI", definition: "Artificial Intelligence", explanation: "Computer systems that can perform tasks requiring human intelligence.", category: "Technology", popularity: 95 },
      { acronym: "ML", definition: "Machine Learning", explanation: "AI subset where computers learn from data.", category: "Technology", popularity: 85 },
      { acronym: "VR", definition: "Virtual Reality", explanation: "Computer-generated simulation of 3D environment.", category: "Technology", popularity: 80 },
      { acronym: "AR", definition: "Augmented Reality", explanation: "Technology overlaying digital content on real world.", category: "Technology", popularity: 75 },
      { acronym: "IoT", definition: "Internet of Things", explanation: "Network of connected physical devices.", category: "Technology", popularity: 70 },
      { acronym: "UI", definition: "User Interface", explanation: "Visual elements users interact with in software.", category: "Technology", popularity: 85 },
      { acronym: "UX", definition: "User Experience", explanation: "Overall experience of using a product or service.", category: "Technology", popularity: 88 },
      { acronym: "CSS", definition: "Cascading Style Sheets", explanation: "Language for styling web pages.", category: "Technology", popularity: 75 },
      { acronym: "HTML", definition: "HyperText Markup Language", explanation: "Standard language for creating web pages.", category: "Technology", popularity: 80 },
      { acronym: "HTTP", definition: "HyperText Transfer Protocol", explanation: "Protocol for transferring web data.", category: "Technology", popularity: 70 },
      { acronym: "HTTPS", definition: "HyperText Transfer Protocol Secure", explanation: "Secure version of HTTP with encryption.", category: "Technology", popularity: 75 },
      { acronym: "URL", definition: "Uniform Resource Locator", explanation: "Web address identifying internet resources.", category: "Technology", popularity: 90 },
      { acronym: "DNS", definition: "Domain Name System", explanation: "System translating domain names to IP addresses.", category: "Technology", popularity: 65 },
      { acronym: "VPN", definition: "Virtual Private Network", explanation: "Secure connection over public internet.", category: "Technology", popularity: 85 },
      { acronym: "RAM", definition: "Random Access Memory", explanation: "Computer's short-term memory for active data.", category: "Technology", popularity: 80 },
      { acronym: "CPU", definition: "Central Processing Unit", explanation: "Main processor executing computer instructions.", category: "Technology", popularity: 85 },
      { acronym: "GPU", definition: "Graphics Processing Unit", explanation: "Processor specialized for graphics and parallel computing.", category: "Technology", popularity: 75 },
      { acronym: "SSD", definition: "Solid State Drive", explanation: "Fast storage device with no moving parts.", category: "Technology", popularity: 70 },
      { acronym: "HDD", definition: "Hard Disk Drive", explanation: "Traditional storage device with spinning disks.", category: "Technology", popularity: 65 },
      { acronym: "OS", definition: "Operating System", explanation: "Software managing computer hardware and resources.", category: "Technology", popularity: 85 },

      // Medical & Health
      { acronym: "CPR", definition: "Cardiopulmonary Resuscitation", explanation: "Emergency procedure for cardiac arrest.", category: "Medical", popularity: 90 },
      { acronym: "ICU", definition: "Intensive Care Unit", explanation: "Hospital unit for critically ill patients.", category: "Medical", popularity: 85 },
      { acronym: "ER", definition: "Emergency Room", explanation: "Hospital department for urgent medical care.", category: "Medical", popularity: 90 },
      { acronym: "MRI", definition: "Magnetic Resonance Imaging", explanation: "Medical imaging technique using magnetic fields.", category: "Medical", popularity: 80 },
      { acronym: "CT", definition: "Computed Tomography", explanation: "Medical imaging using X-rays and computer processing.", category: "Medical", popularity: 75 },
      { acronym: "EKG", definition: "Electrocardiogram", explanation: "Test measuring electrical activity of the heart.", category: "Medical", popularity: 70 },
      { acronym: "IV", definition: "Intravenous", explanation: "Method of delivering fluids directly into veins.", category: "Medical", popularity: 85 },
      { acronym: "BMI", definition: "Body Mass Index", explanation: "Measure of body fat based on height and weight.", category: "Medical", popularity: 80 },
      { acronym: "BP", definition: "Blood Pressure", explanation: "Force of blood against artery walls.", category: "Medical", popularity: 85 },
      { acronym: "OTC", definition: "Over The Counter", explanation: "Medications available without prescription.", category: "Medical", popularity: 75 },

      // Education & Academic
      { acronym: "GPA", definition: "Grade Point Average", explanation: "Numerical representation of academic performance.", category: "Education", popularity: 95 },
      { acronym: "SAT", definition: "Scholastic Assessment Test", explanation: "Standardized test for college admissions.", category: "Education", popularity: 90 },
      { acronym: "ACT", definition: "American College Testing", explanation: "Standardized test for college admissions.", category: "Education", popularity: 85 },
      { acronym: "PhD", definition: "Doctor of Philosophy", explanation: "Highest academic degree in most fields.", category: "Education", popularity: 85 },
      { acronym: "MBA", definition: "Master of Business Administration", explanation: "Graduate degree in business management.", category: "Education", popularity: 80 },
      { acronym: "BA", definition: "Bachelor of Arts", explanation: "Undergraduate degree in liberal arts.", category: "Education", popularity: 85 },
      { acronym: "BS", definition: "Bachelor of Science", explanation: "Undergraduate degree in science or technical fields.", category: "Education", popularity: 85 },
      { acronym: "MA", definition: "Master of Arts", explanation: "Graduate degree in liberal arts.", category: "Education", popularity: 75 },
      { acronym: "MS", definition: "Master of Science", explanation: "Graduate degree in science or technical fields.", category: "Education", popularity: 75 },
      { acronym: "STEM", definition: "Science, Technology, Engineering, Mathematics", explanation: "Academic disciplines focused on these fields.", category: "Education", popularity: 80 },

      // Government & Military
      { acronym: "FBI", definition: "Federal Bureau of Investigation", explanation: "US federal law enforcement agency.", category: "Government", popularity: 95 },
      { acronym: "CIA", definition: "Central Intelligence Agency", explanation: "US foreign intelligence service.", category: "Government", popularity: 90 },
      { acronym: "NASA", definition: "National Aeronautics and Space Administration", explanation: "US space agency.", category: "Government", popularity: 95 },
      { acronym: "IRS", definition: "Internal Revenue Service", explanation: "US federal tax collection agency.", category: "Government", popularity: 90 },
      { acronym: "DMV", definition: "Department of Motor Vehicles", explanation: "State agency handling driver licenses and vehicle registration.", category: "Government", popularity: 85 },
      { acronym: "POTUS", definition: "President of the United States", explanation: "Official title of the US president.", category: "Government", popularity: 80 },
      { acronym: "SCOTUS", definition: "Supreme Court of the United States", explanation: "Highest court in the US judicial system.", category: "Government", popularity: 75 },
      { acronym: "NATO", definition: "North Atlantic Treaty Organization", explanation: "Military alliance of North American and European countries.", category: "Government", popularity: 70 },
      { acronym: "UN", definition: "United Nations", explanation: "International organization for global cooperation.", category: "Government", popularity: 85 },
      { acronym: "EU", definition: "European Union", explanation: "Political and economic union of European countries.", category: "Government", popularity: 80 },

      // Finance & Economics
      { acronym: "ATM", definition: "Automated Teller Machine", explanation: "Machine for banking transactions.", category: "Finance", popularity: 95 },
      { acronym: "APR", definition: "Annual Percentage Rate", explanation: "Yearly cost of borrowing including fees.", category: "Finance", popularity: 75 },
      { acronym: "GDP", definition: "Gross Domestic Product", explanation: "Total value of goods and services produced by a country.", category: "Finance", popularity: 80 },
      { acronym: "IPO", definition: "Initial Public Offering", explanation: "First sale of company stock to public investors.", category: "Finance", popularity: 70 },
      { acronym: "NYSE", definition: "New York Stock Exchange", explanation: "Largest stock exchange in the world.", category: "Finance", popularity: 75 },
      { acronym: "NASDAQ", definition: "National Association of Securities Dealers Automated Quotations", explanation: "Electronic stock exchange.", category: "Finance", popularity: 70 },
      { acronym: "ETF", definition: "Exchange-Traded Fund", explanation: "Investment fund traded on stock exchanges.", category: "Finance", popularity: 65 },
      { acronym: "IRA", definition: "Individual Retirement Account", explanation: "Tax-advantaged retirement savings account.", category: "Finance", popularity: 75 },
      { acronym: "401K", definition: "401(k) Retirement Plan", explanation: "Employer-sponsored retirement savings plan.", category: "Finance", popularity: 80 },
      { acronym: "FDIC", definition: "Federal Deposit Insurance Corporation", explanation: "US agency insuring bank deposits.", category: "Finance", popularity: 70 },

      // Transportation & Travel
      { acronym: "GPS", definition: "Global Positioning System", explanation: "Satellite navigation system.", category: "Transportation", popularity: 95 },
      { acronym: "TSA", definition: "Transportation Security Administration", explanation: "US agency responsible for airport security.", category: "Transportation", popularity: 85 },
      { acronym: "FAA", definition: "Federal Aviation Administration", explanation: "US agency regulating civil aviation.", category: "Transportation", popularity: 70 },
      { acronym: "DOT", definition: "Department of Transportation", explanation: "US government department overseeing transportation.", category: "Transportation", popularity: 65 },
      { acronym: "MPG", definition: "Miles Per Gallon", explanation: "Measure of fuel efficiency.", category: "Transportation", popularity: 80 },
      { acronym: "SUV", definition: "Sport Utility Vehicle", explanation: "Type of vehicle with higher ground clearance.", category: "Transportation", popularity: 85 },
      { acronym: "RV", definition: "Recreational Vehicle", explanation: "Motor vehicle designed for camping and travel.", category: "Transportation", popularity: 75 },
      { acronym: "ETA", definition: "Estimated Time of Arrival", explanation: "Predicted arrival time.", category: "Transportation", popularity: 90 },
      { acronym: "ETD", definition: "Estimated Time of Departure", explanation: "Predicted departure time.", category: "Transportation", popularity: 70 },
      { acronym: "VIN", definition: "Vehicle Identification Number", explanation: "Unique identifier for motor vehicles.", category: "Transportation", popularity: 65 },

      // Entertainment & Media
      { acronym: "TV", definition: "Television", explanation: "Electronic device for receiving broadcast programs.", category: "Entertainment", popularity: 98 },
      { acronym: "DVD", definition: "Digital Versatile Disc", explanation: "Optical disc storage format.", category: "Entertainment", popularity: 85 },
      { acronym: "HD", definition: "High Definition", explanation: "Video resolution standard.", category: "Entertainment", popularity: 90 },
      { acronym: "4K", definition: "4K Resolution", explanation: "Ultra-high definition video resolution.", category: "Entertainment", popularity: 80 },
      { acronym: "CGI", definition: "Computer-Generated Imagery", explanation: "Digital visual effects in movies and games.", category: "Entertainment", popularity: 75 },
      { acronym: "DJ", definition: "Disc Jockey", explanation: "Person who plays recorded music for audiences.", category: "Entertainment", popularity: 85 },
      { acronym: "LP", definition: "Long Playing", explanation: "Type of vinyl record.", category: "Entertainment", popularity: 60 },
      { acronym: "EP", definition: "Extended Play", explanation: "Musical recording longer than single, shorter than album.", category: "Entertainment", popularity: 65 },
      { acronym: "OST", definition: "Original Soundtrack", explanation: "Music specifically composed for a movie or show.", category: "Entertainment", popularity: 70 },
      { acronym: "IMAX", definition: "Image Maximum", explanation: "Large-format film and projection system.", category: "Entertainment", popularity: 75 },

      // Sports & Fitness
      { acronym: "MVP", definition: "Most Valuable Player", explanation: "Award for best performing player.", category: "Sports", popularity: 90 },
      { acronym: "NFL", definition: "National Football League", explanation: "Professional American football league.", category: "Sports", popularity: 95 },
      { acronym: "NBA", definition: "National Basketball Association", explanation: "Professional basketball league.", category: "Sports", popularity: 95 },
      { acronym: "MLB", definition: "Major League Baseball", explanation: "Professional baseball league.", category: "Sports", popularity: 90 },
      { acronym: "NHL", definition: "National Hockey League", explanation: "Professional ice hockey league.", category: "Sports", popularity: 80 },
      { acronym: "FIFA", definition: "Fédération Internationale de Football Association", explanation: "International soccer governing body.", category: "Sports", popularity: 85 },
      { acronym: "UFC", definition: "Ultimate Fighting Championship", explanation: "Mixed martial arts organization.", category: "Sports", popularity: 80 },
      { acronym: "ESPN", definition: "Entertainment and Sports Programming Network", explanation: "Sports television network.", category: "Sports", popularity: 90 },
      { acronym: "BMX", definition: "Bicycle Motocross", explanation: "Type of cycling sport.", category: "Sports", popularity: 70 },
      { acronym: "MMA", definition: "Mixed Martial Arts", explanation: "Combat sport combining various fighting techniques.", category: "Sports", popularity: 75 },

      // Food & Dining
      { acronym: "BBQ", definition: "Barbecue", explanation: "Method of cooking meat over fire or coals.", category: "Food", popularity: 90 },
      { acronym: "BLT", definition: "Bacon, Lettuce, and Tomato", explanation: "Type of sandwich.", category: "Food", popularity: 85 },
      { acronym: "PB&J", definition: "Peanut Butter and Jelly", explanation: "Popular sandwich combination.", category: "Food", popularity: 88 },
      { acronym: "MSG", definition: "Monosodium Glutamate", explanation: "Flavor enhancer used in cooking.", category: "Food", popularity: 70 },
      { acronym: "GMO", definition: "Genetically Modified Organism", explanation: "Organism with altered genetic material.", category: "Food", popularity: 75 },
      { acronym: "USDA", definition: "United States Department of Agriculture", explanation: "US agency overseeing food safety and agriculture.", category: "Food", popularity: 80 },
      { acronym: "FDA", definition: "Food and Drug Administration", explanation: "US agency regulating food and drug safety.", category: "Food", popularity: 85 },
      { acronym: "BYOB", definition: "Bring Your Own Bottle", explanation: "Policy allowing customers to bring their own alcohol.", category: "Food", popularity: 75 },
      { acronym: "RSVP", definition: "Répondez S'il Vous Plaît", explanation: "Please respond (to an invitation).", category: "Social", popularity: 80 },
      { acronym: "VIP", definition: "Very Important Person", explanation: "Person given special treatment or privileges.", category: "Social", popularity: 85 },

      // Science & Research
      { acronym: "DNA", definition: "Deoxyribonucleic Acid", explanation: "Molecule carrying genetic instructions.", category: "Science", popularity: 95 },
      { acronym: "RNA", definition: "Ribonucleic Acid", explanation: "Molecule involved in protein synthesis.", category: "Science", popularity: 80 },
      { acronym: "CERN", definition: "European Organization for Nuclear Research", explanation: "European particle physics research organization.", category: "Science", popularity: 70 },
      { acronym: "NIH", definition: "National Institutes of Health", explanation: "US medical research agency.", category: "Science", popularity: 75 },
      { acronym: "CDC", definition: "Centers for Disease Control and Prevention", explanation: "US public health agency.", category: "Science", popularity: 85 },
      { acronym: "WHO", definition: "World Health Organization", explanation: "UN agency for international public health.", category: "Science", popularity: 90 },
      { acronym: "EPA", definition: "Environmental Protection Agency", explanation: "US agency protecting environmental and human health.", category: "Science", popularity: 80 },
      { acronym: "NOAA", definition: "National Oceanic and Atmospheric Administration", explanation: "US agency for weather and ocean research.", category: "Science", popularity: 70 },
      { acronym: "USGS", definition: "United States Geological Survey", explanation: "US agency studying natural hazards and resources.", category: "Science", popularity: 65 },

      // Gaming
      { acronym: "MMO", definition: "Massively Multiplayer Online", explanation: "Type of online game with many players.", category: "Gaming", popularity: 75 },
      { acronym: "RPG", definition: "Role-Playing Game", explanation: "Game where players assume character roles.", category: "Gaming", popularity: 80 },
      { acronym: "FPS", definition: "First-Person Shooter", explanation: "Game genre from first-person perspective.", category: "Gaming", popularity: 85 },
      { acronym: "NPC", definition: "Non-Player Character", explanation: "Game character controlled by computer.", category: "Gaming", popularity: 80 },
      { acronym: "DLC", definition: "Downloadable Content", explanation: "Additional game content available for download.", category: "Gaming", popularity: 75 },
      { acronym: "PvP", definition: "Player versus Player", explanation: "Game mode where players compete against each other.", category: "Gaming", popularity: 70 },
      { acronym: "PvE", definition: "Player versus Environment", explanation: "Game mode where players fight computer enemies.", category: "Gaming", popularity: 65 },
      { acronym: "GG", definition: "Good Game", explanation: "Sportsmanlike expression at end of game.", category: "Gaming", popularity: 90 },
      { acronym: "GGWP", definition: "Good Game Well Played", explanation: "Extended version of GG showing respect.", category: "Gaming", popularity: 75 },

      // Additional Common Acronyms
      { acronym: "SCUBA", definition: "Self-Contained Underwater Breathing Apparatus", explanation: "Equipment for underwater diving.", category: "Recreation", popularity: 70 },
      { acronym: "LASER", definition: "Light Amplification by Stimulated Emission of Radiation", explanation: "Device producing focused light beam.", category: "Science", popularity: 75 },
      { acronym: "RADAR", definition: "Radio Detection and Ranging", explanation: "System using radio waves to detect objects.", category: "Technology", popularity: 80 },
      { acronym: "SONAR", definition: "Sound Navigation and Ranging", explanation: "System using sound waves to detect objects.", category: "Technology", popularity: 70 },
      { acronym: "JPEG", definition: "Joint Photographic Experts Group", explanation: "Image compression format.", category: "Technology", popularity: 75 },
      { acronym: "PNG", definition: "Portable Network Graphics", explanation: "Image format with lossless compression.", category: "Technology", popularity: 70 },
      { acronym: "GIF", definition: "Graphics Interchange Format", explanation: "Image format supporting animation.", category: "Technology", popularity: 85 },
      { acronym: "PDF", definition: "Portable Document Format", explanation: "File format for documents.", category: "Technology", popularity: 90 },
      { acronym: "ZIP", definition: "Zone Improvement Plan", explanation: "Postal code system in the US.", category: "General", popularity: 85 },
    
			{ acronym: "IFYWIM", definition: "If You Feel What I Mean", explanation: "Used to hint at an implied or subtle meaning without stating it directly.", category: "Internet", popularity: 72 },
			{ acronym: "IYKYK", definition: "If You Know You Know", explanation: "Refers to something only certain people will understand.", category: "Internet", popularity: 90 },
			{ acronym: "FWIW", definition: "For What It's Worth", explanation: "Used to add a potentially helpful opinion or fact.", category: "Internet", popularity: 75 },
			{ acronym: "JS", definition: "Just Saying", explanation: "Used to soften or downplay a statement.", category: "Internet", popularity: 70 },
			{ acronym: "YKWIM", definition: "You Know What I Mean", explanation: "Checks shared understanding, often implying more than stated.", category: "Internet", popularity: 80 },
			{ acronym: "NMS", definition: "Not Much to Say", explanation: "Indicates limited comment or response.", category: "Internet", popularity: 60 },

		{ acronym: "AMA", definition: "Ask Me Anything", explanation: "Open invitation for questions, often used on forums or social media.", category: "Internet", popularity: 85 },
{ acronym: "OP", definition: "Original Poster", explanation: "Person who created the original post in a discussion.", category: "Internet", popularity: 80 },
{ acronym: "TLDR", definition: "Too Long Didn't Read", explanation: "Alternative spelling without semicolon.", category: "Internet", popularity: 78 },
{ acronym: "FWIW", definition: "For What It's Worth", explanation: "Used to add an opinion or piece of information.", category: "Internet", popularity: 70 },
{ acronym: "IMO", definition: "In My Opinion", explanation: "Used before stating a personal viewpoint.", category: "Internet", popularity: 85 },
{ acronym: "IRL", definition: "In Real Life", explanation: "Refers to offline, real-world situations.", category: "Internet", popularity: 88 },
{ acronym: "NPC", definition: "Non-Playable Character", explanation: "Used humorously to describe someone acting robotic or scripted.", category: "Gen Z", popularity: 90 },
{ acronym: "MID", definition: "Mediocre", explanation: "Used to describe something average or unimpressive.", category: "Gen Z", popularity: 85 },
{ acronym: "RIZZ", definition: "Charisma", explanation: "Ability to attract or charm others.", category: "Gen Z", popularity: 95 },
{ acronym: "ATE", definition: "Did Extremely Well", explanation: "Praise for outstanding performance.", category: "Gen Z", popularity: 88 },
{ acronym: "W", definition: "Win", explanation: "Something positive or successful.", category: "Gen Z", popularity: 90 },
{ acronym: "L", definition: "Loss", explanation: "Something embarrassing or unsuccessful.", category: "Gen Z", popularity: 88 },
{ acronym: "OKR", definition: "Objectives and Key Results", explanation: "Goal-setting framework used by companies.", category: "Business", popularity: 80 },
{ acronym: "B2G", definition: "Business to Government", explanation: "Business transactions with government entities.", category: "Business", popularity: 65 },
{ acronym: "P&L", definition: "Profit and Loss", explanation: "Financial statement summarizing revenues and expenses.", category: "Business", popularity: 85 },
{ acronym: "ESOP", definition: "Employee Stock Ownership Plan", explanation: "Program giving employees company ownership.", category: "Business", popularity: 75 },
{ acronym: "IPO", definition: "Initial Public Offering", explanation: "When a company goes public.", category: "Business", popularity: 80 },
{ acronym: "CLI", definition: "Command Line Interface", explanation: "Text-based interface to interact with software.", category: "Technology", popularity: 85 },
{ acronym: "SDK", definition: "Software Development Kit", explanation: "Tools for building applications.", category: "Technology", popularity: 80 },
{ acronym: "CI/CD", definition: "Continuous Integration / Continuous Deployment", explanation: "Automated software build and deployment process.", category: "Technology", popularity: 85 },
{ acronym: "JWT", definition: "JSON Web Token", explanation: "Token format for secure authentication.", category: "Technology", popularity: 75 },
{ acronym: "CRUD", definition: "Create Read Update Delete", explanation: "Basic operations in data management.", category: "Technology", popularity: 90 },
{ acronym: "AF", definition: "As F***", explanation: "Used for strong emphasis.", category: "Gaming", popularity: 85 },
{ acronym: "SMURF", definition: "Experienced Player Using New Account", explanation: "Skilled player playing at lower ranks.", category: "Gaming", popularity: 70 },
{ acronym: "NERF", definition: "Reduce Power", explanation: "Decrease effectiveness of a game element.", category: "Gaming", popularity: 75 },
{ acronym: "BUFF", definition: "Increase Power", explanation: "Improve effectiveness of a game element.", category: "Gaming", popularity: 75 },
{ acronym: "ASL", definition: "Age Sex Location", explanation: "Old-school internet chat question.", category: "General", popularity: 60 },
{ acronym: "DIY", definition: "Do It Yourself", explanation: "Creating or repairing things independently.", category: "General", popularity: 85 },
{ acronym: "FYI", definition: "For Your Information", explanation: "Used to share helpful information.", category: "General", popularity: 90 },
		];

    // Insert all acronyms
    for (const acronym of acronyms) {
      await ctx.db.insert("acronyms", acronym);
    }

    return "Successfully seeded 200+ acronyms";
  },
});
