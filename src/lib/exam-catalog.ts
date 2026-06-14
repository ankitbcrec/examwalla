export interface ExamEntry {
  id: string;
  name: string;
  shortName?: string;
  category: "Government" | "Banking" | "Engineering" | "Medical" | "MBA" | "International" | "Finance" | "Undergraduate";
  emoji: string;
  description: string;
  tags: string[];          // for keyword matching
  difficulty: "Easy" | "Moderate" | "Hard" | "Very Hard";
  popular?: boolean;
}

export const EXAM_CATALOG: ExamEntry[] = [
  // ── Government ─────────────────────────────────────────────
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    shortName: "CGL",
    category: "Government",
    emoji: "🏛️",
    description: "Staff Selection Commission · Combined Graduate Level",
    tags: ["ssc", "cgl", "staff selection", "government job", "combined graduate", "reasoning", "quant", "english", "general awareness"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL",
    shortName: "CHSL",
    category: "Government",
    emoji: "🏛️",
    description: "Staff Selection Commission · Combined Higher Secondary Level",
    tags: ["ssc", "chsl", "staff selection", "government", "10+2", "higher secondary", "ldc", "deo"],
    difficulty: "Easy",
  },
  {
    id: "ssc-mts",
    name: "SSC MTS",
    shortName: "MTS",
    category: "Government",
    emoji: "🏛️",
    description: "Staff Selection Commission · Multi Tasking Staff",
    tags: ["ssc", "mts", "multi tasking", "government", "10th pass", "matric"],
    difficulty: "Easy",
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    shortName: "NTPC",
    category: "Government",
    emoji: "🚂",
    description: "Railway Recruitment Board · Non-Technical Popular Categories",
    tags: ["rrb", "ntpc", "railway", "railways", "non technical", "general awareness", "maths", "reasoning"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "rrb-alp",
    name: "RRB ALP",
    shortName: "ALP",
    category: "Government",
    emoji: "🚂",
    description: "Railway Recruitment Board · Assistant Loco Pilot",
    tags: ["rrb", "alp", "railway", "loco pilot", "technical", "electrician", "fitter", "mechanic"],
    difficulty: "Moderate",
  },
  {
    id: "rrb-group-d",
    name: "RRB Group D",
    category: "Government",
    emoji: "🚂",
    description: "Railway Recruitment Board · Group D Level 1",
    tags: ["rrb", "group d", "railway", "10th pass", "level 1", "helper", "track maintainer"],
    difficulty: "Easy",
  },
  {
    id: "upsc-prelims",
    name: "UPSC Civil Services",
    shortName: "UPSC",
    category: "Government",
    emoji: "🇮🇳",
    description: "UPSC · Civil Services Preliminary Examination · IAS / IPS / IFS",
    tags: ["upsc", "civil services", "ias", "ips", "ifs", "prelims", "general studies", "csat", "polity", "history", "geography", "economy", "environment"],
    difficulty: "Very Hard",
    popular: true,
  },
  {
    id: "upsc-csat",
    name: "UPSC CSAT",
    category: "Government",
    emoji: "🇮🇳",
    description: "UPSC · Civil Services Aptitude Test (Paper II)",
    tags: ["upsc", "csat", "civil services", "aptitude", "reasoning", "comprehension", "maths"],
    difficulty: "Moderate",
  },
  {
    id: "cds",
    name: "CDS Exam",
    category: "Government",
    emoji: "⚔️",
    description: "UPSC · Combined Defence Services",
    tags: ["cds", "combined defence", "army", "navy", "air force", "military", "defence", "upsc", "ota", "ima"],
    difficulty: "Moderate",
  },
  {
    id: "nda",
    name: "NDA Exam",
    category: "Government",
    emoji: "⚔️",
    description: "UPSC · National Defence Academy",
    tags: ["nda", "national defence", "army", "navy", "air force", "12th pass", "defence", "upsc"],
    difficulty: "Hard",
  },

  // ── Banking ─────────────────────────────────────────────────
  {
    id: "ibps-po",
    name: "IBPS PO",
    shortName: "PO",
    category: "Banking",
    emoji: "🏦",
    description: "IBPS · Probationary Officer · Public Sector Banks",
    tags: ["ibps", "po", "probationary officer", "bank", "banking", "prelims", "mains", "english", "quant", "reasoning", "banking awareness"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "ibps-clerk",
    name: "IBPS Clerk",
    category: "Banking",
    emoji: "🏦",
    description: "IBPS · Clerical Cadre · Public Sector Banks",
    tags: ["ibps", "clerk", "clerical", "bank", "banking", "prelims", "mains", "financial awareness"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "sbi-po",
    name: "SBI PO",
    category: "Banking",
    emoji: "🏦",
    description: "State Bank of India · Probationary Officer",
    tags: ["sbi", "po", "state bank", "probationary officer", "banking", "prelims", "mains", "descriptive"],
    difficulty: "Hard",
    popular: true,
  },
  {
    id: "sbi-clerk",
    name: "SBI Clerk",
    category: "Banking",
    emoji: "🏦",
    description: "State Bank of India · Junior Associate",
    tags: ["sbi", "clerk", "state bank", "junior associate", "banking", "prelims", "mains"],
    difficulty: "Moderate",
  },
  {
    id: "rbi-grade-b",
    name: "RBI Grade B",
    category: "Banking",
    emoji: "🏦",
    description: "Reserve Bank of India · Grade B Officer",
    tags: ["rbi", "grade b", "reserve bank", "officer", "finance", "economy", "esaf"],
    difficulty: "Very Hard",
  },
  {
    id: "nabard",
    name: "NABARD Grade A",
    category: "Banking",
    emoji: "🌾",
    description: "National Bank for Agriculture · Development Officer",
    tags: ["nabard", "grade a", "agriculture", "rural development", "bank"],
    difficulty: "Hard",
  },

  // ── Engineering ──────────────────────────────────────────────
  {
    id: "jee-main",
    name: "JEE Main",
    shortName: "JEE Main",
    category: "Engineering",
    emoji: "⚙️",
    description: "Joint Entrance Exam Main · NIT / IIIT / CFTI Admission",
    tags: ["jee", "jee main", "joint entrance", "engineering", "nit", "iiit", "b.tech", "physics", "chemistry", "maths", "mathematics"],
    difficulty: "Hard",
    popular: true,
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    shortName: "JEE Adv",
    category: "Engineering",
    emoji: "⚙️",
    description: "Joint Entrance Exam Advanced · IIT Admission",
    tags: ["jee", "jee advanced", "iit", "indian institute of technology", "engineering", "physics", "chemistry", "maths"],
    difficulty: "Very Hard",
    popular: true,
  },
  {
    id: "gate-cs",
    name: "GATE — Computer Science",
    shortName: "GATE CS",
    category: "Engineering",
    emoji: "💻",
    description: "Graduate Aptitude Test · CS & IT · PSU / M.Tech",
    tags: ["gate", "computer science", "cs", "it", "psu", "mtech", "algorithms", "os", "dbms", "cn", "engineering"],
    difficulty: "Hard",
  },
  {
    id: "gate-ece",
    name: "GATE — Electronics",
    shortName: "GATE ECE",
    category: "Engineering",
    emoji: "📡",
    description: "Graduate Aptitude Test · Electronics & Communication",
    tags: ["gate", "ece", "electronics", "communication", "signals", "circuits", "psu", "mtech"],
    difficulty: "Hard",
  },
  {
    id: "aws-saa",
    name: "AWS Solutions Architect",
    shortName: "AWS SAA",
    category: "Engineering",
    emoji: "☁️",
    description: "Amazon Web Services · SAA-C03 Certification",
    tags: ["aws", "cloud", "solutions architect", "amazon", "certification", "s3", "ec2", "lambda", "devops"],
    difficulty: "Moderate",
  },
  {
    id: "python-cert",
    name: "Python Certification",
    category: "Engineering",
    emoji: "🐍",
    description: "Python Professional Certification · PCEP / PCAP",
    tags: ["python", "programming", "coding", "pcep", "pcap", "certification", "tech"],
    difficulty: "Easy",
  },
  {
    id: "java-cert",
    name: "Java OCP Certification",
    shortName: "Java OCP",
    category: "Engineering",
    emoji: "☕",
    description: "Oracle Certified Professional · Java SE",
    tags: ["java", "ocp", "oracle", "certification", "programming", "oop", "spring"],
    difficulty: "Moderate",
  },

  // ── Medical ──────────────────────────────────────────────────
  {
    id: "neet-ug",
    name: "NEET UG",
    shortName: "NEET",
    category: "Medical",
    emoji: "🩺",
    description: "National Eligibility cum Entrance Test · MBBS / BDS",
    tags: ["neet", "medical", "mbbs", "bds", "biology", "botany", "zoology", "physics", "chemistry", "ncert", "doctor"],
    difficulty: "Very Hard",
    popular: true,
  },
  {
    id: "neet-pg",
    name: "NEET PG",
    category: "Medical",
    emoji: "🏥",
    description: "NEET Postgraduate · MD / MS Admission",
    tags: ["neet pg", "postgraduate", "md", "ms", "medical", "pg medical", "clinical"],
    difficulty: "Very Hard",
  },
  {
    id: "aiims",
    name: "AIIMS Nursing",
    category: "Medical",
    emoji: "🩺",
    description: "All India Institute of Medical Sciences · Nursing Officer",
    tags: ["aiims", "nursing", "medical", "nurse", "healthcare"],
    difficulty: "Moderate",
  },

  // ── MBA / Management ─────────────────────────────────────────
  {
    id: "cat",
    name: "CAT",
    shortName: "CAT",
    category: "MBA",
    emoji: "🎓",
    description: "Common Admission Test · IIM & Top MBA Colleges",
    tags: ["cat", "mba", "iim", "management", "varc", "dilr", "qa", "quant", "verbal", "logical reasoning", "data interpretation", "reading comprehension"],
    difficulty: "Very Hard",
    popular: true,
  },
  {
    id: "xat",
    name: "XAT",
    category: "MBA",
    emoji: "🎓",
    description: "Xavier Aptitude Test · XLRI & Top B-Schools",
    tags: ["xat", "mba", "xlri", "xavier", "decision making", "verbal", "quant", "gk"],
    difficulty: "Hard",
  },
  {
    id: "snap",
    name: "SNAP",
    category: "MBA",
    emoji: "🎓",
    description: "Symbiosis National Aptitude Test",
    tags: ["snap", "symbiosis", "mba", "management", "analytical", "verbal", "quant"],
    difficulty: "Moderate",
  },
  {
    id: "mat",
    name: "MAT",
    category: "MBA",
    emoji: "🎓",
    description: "Management Aptitude Test · AIMA",
    tags: ["mat", "management", "aima", "mba", "language", "intelligence", "quant", "gk"],
    difficulty: "Moderate",
  },

  // ── Undergraduate ────────────────────────────────────────────
  {
    id: "cuet-ug",
    name: "CUET UG",
    shortName: "CUET",
    category: "Undergraduate",
    emoji: "📚",
    description: "Common University Entrance Test · Central Universities",
    tags: ["cuet", "ug", "undergraduate", "central university", "du", "bhu", "jnu", "domain subject", "general test", "language"],
    difficulty: "Moderate",
    popular: true,
  },

  // ── Finance / Professional ───────────────────────────────────
  {
    id: "nism-xv",
    name: "NISM Series XV",
    shortName: "NISM XV",
    category: "Finance",
    emoji: "📈",
    description: "Research Analyst · SEBI Certification",
    tags: ["nism", "series xv", "research analyst", "sebi", "finance", "stock market", "securities", "investment", "equity"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "nism-viii",
    name: "NISM Series VIII",
    shortName: "NISM VIII",
    category: "Finance",
    emoji: "📊",
    description: "Equity Derivatives · SEBI Certification",
    tags: ["nism", "series viii", "equity derivatives", "futures", "options", "sebi", "derivatives", "finance"],
    difficulty: "Moderate",
  },
  {
    id: "ca-foundation",
    name: "CA Foundation",
    category: "Finance",
    emoji: "📊",
    description: "ICAI · Chartered Accountancy Foundation",
    tags: ["ca", "chartered accountant", "icai", "foundation", "accounts", "accountancy", "law", "economics", "maths"],
    difficulty: "Hard",
  },

  // ── International ────────────────────────────────────────────
  {
    id: "sat",
    name: "SAT",
    shortName: "SAT",
    category: "International",
    emoji: "🌎",
    description: "Scholastic Assessment Test · US College Admissions",
    tags: ["sat", "us college", "scholastic", "reading", "writing", "math", "college board", "american", "usa"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "act",
    name: "ACT",
    category: "International",
    emoji: "🌎",
    description: "American College Testing · US University Admissions",
    tags: ["act", "american college", "english", "math", "reading", "science", "us college", "usa"],
    difficulty: "Moderate",
  },
  {
    id: "ielts",
    name: "IELTS",
    shortName: "IELTS",
    category: "International",
    emoji: "🌐",
    description: "International English Language Testing System",
    tags: ["ielts", "english", "language test", "listening", "reading", "writing", "speaking", "uk", "canada", "australia", "band score"],
    difficulty: "Moderate",
    popular: true,
  },
  {
    id: "toefl",
    name: "TOEFL iBT",
    shortName: "TOEFL",
    category: "International",
    emoji: "🌐",
    description: "Test of English as a Foreign Language",
    tags: ["toefl", "english", "ibt", "ets", "us university", "reading", "listening", "speaking", "writing"],
    difficulty: "Moderate",
  },
  {
    id: "gre",
    name: "GRE",
    category: "International",
    emoji: "🎓",
    description: "Graduate Record Examination · US Graduate Schools",
    tags: ["gre", "graduate record", "verbal", "quant", "ets", "ms", "phd", "us masters", "analytical writing"],
    difficulty: "Hard",
  },
  {
    id: "gmat",
    name: "GMAT",
    category: "International",
    emoji: "💼",
    description: "Graduate Management Admission Test · Global MBA",
    tags: ["gmat", "management", "mba", "verbal", "quant", "data insights", "global", "business school"],
    difficulty: "Hard",
  },
];

// Category config
export const CATEGORY_META: Record<ExamEntry["category"], { color: string; bg: string }> = {
  Government:    { color: "text-orange-600",  bg: "bg-orange-50 dark:bg-orange-950/40" },
  Banking:       { color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-950/40" },
  Engineering:   { color: "text-violet-600",  bg: "bg-violet-50 dark:bg-violet-950/40" },
  Medical:       { color: "text-red-600",     bg: "bg-red-50 dark:bg-red-950/40" },
  MBA:           { color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  Undergraduate: { color: "text-pink-600",    bg: "bg-pink-50 dark:bg-pink-950/40" },
  Finance:       { color: "text-teal-600",    bg: "bg-teal-50 dark:bg-teal-950/40" },
  International: { color: "text-indigo-600",  bg: "bg-indigo-50 dark:bg-indigo-950/40" },
};

export const POPULAR_EXAMS = EXAM_CATALOG.filter((e) => e.popular);

// Fuzzy search — returns top N results scored by relevance
export function searchExams(query: string, limit = 8): ExamEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return POPULAR_EXAMS;

  return EXAM_CATALOG
    .map((exam) => {
      const name = exam.name.toLowerCase();
      const short = (exam.shortName ?? "").toLowerCase();
      let score = 0;

      // Name match (highest priority)
      if (name === q || short === q)                          score = 100;
      else if (name.startsWith(q) || short.startsWith(q))    score = 85;
      else if (name.includes(q) || short.includes(q))        score = 70;

      // Tag match
      exam.tags.forEach((tag) => {
        if (tag === q)               score = Math.max(score, 80);
        else if (tag.startsWith(q))  score = Math.max(score, 55);
        else if (tag.includes(q))    score = Math.max(score, 35);
      });

      // Category match
      if (exam.category.toLowerCase().includes(q)) score = Math.max(score, 30);

      // Description match
      if (exam.description.toLowerCase().includes(q)) score = Math.max(score, 25);

      // Boost popular exams slightly
      if (exam.popular && score > 0) score += 5;

      return { exam, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ exam }) => exam);
}
