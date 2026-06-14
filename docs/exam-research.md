# ExamWalla — Target Exam Research & Implementation Assessment
> Last updated: June 2026 | Patterns reflect 2024-2025 cycles

---

## Quick Reference Summary

| Exam | Questions | Marks | Duration | Format | Negative | Impl. Difficulty |
|------|-----------|-------|----------|--------|----------|-----------------|
| SSC CGL Tier 1 | 100 | 200 | 60 min | MCQ only | −0.50 | 🟢 Easy |
| SSC CGL Tier 2 | 130 | 450 | 150 min | MCQ only | −1 / −0.50 | 🟡 Medium |
| RRB NTPC CBT 1 | 100 | 100 | 90 min | MCQ only | −1/3 | 🟢 Easy |
| RRB NTPC CBT 2 | 120 | 120 | 90 min | MCQ only | −1/3 | 🟢 Easy |
| RRB ALP CBT 1 | 75 | 75 | 60 min | MCQ only | −1/3 | 🟢 Easy |
| RRB ALP CBT 2 | 175 | 175 | 150 min | MCQ only | −1/3 | 🟡 Medium |
| IBPS PO Prelims | 100 | 100 | 60 min | MCQ | −0.25 | 🟢 Easy |
| IBPS PO Mains | 145 + essay | 225 | 190 min | MCQ + Descriptive | −0.25 | 🟡 Medium |
| IBPS Clerk Prelims | 100 | 100 | 60 min | MCQ only | −0.25 | 🟢 Easy |
| IBPS Clerk Mains | 155 | 200 | 120 min | MCQ only | −0.25 | 🟢 Easy |
| CUET UG | 150 (attempted) | 250 | Variable | MCQ only | −1 | 🟡 Medium |
| NEET UG | 180 | 720 | 180 min | MCQ only | −1 | 🟡 Medium* |
| JEE Main | 90 (attempt 75) | 300 | 180 min | MCQ + Numerical | −1 MCQ / 0 Num | 🟡 Medium |
| JEE Advanced | 54/paper × 2 | 360 | 3h × 2 | MCQ + Multi-correct + Numerical | Complex partial | 🔴 Hard |
| UPSC Prelims GS | 100 | 200 | 120 min | MCQ only | −1/3 | 🟡 Medium* |
| UPSC CSAT | 80 | 200 | 120 min | MCQ only | −1/3 | 🟢 Easy |
| CAT | 68 | 204 | 120 min | MCQ + TITA | −1 MCQ / 0 TITA | 🟡 Medium |
| SAT Digital | 98 | 1600 | 134 min | MCQ + Grid-in | None | 🟡 Medium |
| ACT 2025 | 171 | 36 composite | 125 min | MCQ only | None | 🟢 Easy |
| IELTS | 80 MCQ + tasks | 0–9 band | 165 min | MCQ + Essay + Speaking | Band-based | 🔴 Hard |
| TOEFL iBT | 48 MCQ + tasks | 0–120 | 116 min | MCQ + Essay + Speaking | Section-based | 🔴 Hard |

---

## 1. SSC CGL — Staff Selection Commission Combined Graduate Level

### Exam Structure
| Tier | Questions | Marks | Duration | Mode |
|------|-----------|-------|----------|------|
| Tier 1 | 100 | 200 | 60 min (15 min/section auto-close) | Online CBT |
| Tier 2 Paper I | 130 | 450 | 150 min | Online CBT |
| Tier 2 Paper II (JSO) | 100 | 200 | 120 min | Online CBT |
| Tier 3 | Essay/Letter | 100 | 60 min | Offline descriptive |

**Tier 1 Sections (25 Q × 4, 50 marks each):**
- General Intelligence & Reasoning
- General Awareness (Current Affairs, Static GK)
- Quantitative Aptitude
- English Comprehension

**Marking:** +2 correct / −0.50 wrong (Tier 1) | +1 / −1 (Tier 2 Paper I Math & Reasoning)

**Key syllabus topics:**
Reasoning: Analogy, Series, Coding-Decoding, Blood Relations, Direction, Puzzle, Venn Diagram, Matrix, Non-verbal
Quant: Percentage, Ratio, Profit-Loss, SI/CI, Time-Speed, Geometry, Trigonometry, Algebra, DI
English: Reading Comprehension, Cloze Test, Spotting Errors, Fill in the Blanks, Idioms
GK: History, Geography, Polity, Economy, Science, Current Affairs

### Implementation Assessment 🟢 Easy
- Pure MCQ, 4 clean sections
- Sectional time auto-close → needs a per-section timer that forces next section
- Question generation via Gemini: **Excellent** (broad GK, reasoning, English — Gemini handles all well)
- Tier 1 is the priority — highest student demand
- **Gotcha:** Sectional timer (15 min per section auto-closes) adds slight UI complexity vs standard timer
- **Skip for v1:** Tier 3 (descriptive essay)

---

## 2. RRB NTPC — Railway Recruitment Board Non-Technical Popular Categories

### Exam Structure
| Stage | Questions | Marks | Duration | Sections |
|-------|-----------|-------|----------|---------|
| CBT 1 | 100 | 100 | 90 min | GA (40), Maths (30), Reasoning (30) |
| CBT 2 | 120 | 120 | 90 min | GA (50), Maths (35), Reasoning (35) |
| CBAT | Aptitude | — | — | Psychometric (no negative) |
| TST | Typing | — | — | 30 WPM English / 25 WPM Hindi |

**Marking:** +1 / −1/3

**Key syllabus:**
GA: Indian Railways, Current Affairs, Indian History, Indian Polity, Science
Maths: Number System, HCF/LCM, Decimals, Percentages, SI/CI, Mensuration, Time-Distance
Reasoning: Analogy, Jumbling, Venn Diagram, Data Sufficiency, Statement-Conclusion

### Implementation Assessment 🟢 Easy
- Simplest exam on the list: 100 MCQ, 3 sections, single marking scheme
- No sectional time limits
- Question generation: **Good** — standard topics
- **Note:** Railway-specific GK (zones, HQs, terminology) needs to be in prompt context
- CBT 1 first; CBT 2 is similar with larger GA section

---

## 3. RRB ALP — Railway Recruitment Board Assistant Loco Pilot

### Exam Structure
| Stage | Questions | Marks | Duration | Notes |
|-------|-----------|-------|----------|-------|
| CBT 1 | 75 | 75 | 60 min | All candidates |
| CBT 2 Part A | 100 | 100 | 90 min | 70% weight |
| CBT 2 Part B | 75 | 75 | 60 min | Qualifying, trade-specific |
| CBAT (Stage 3) | Aptitude | — | 30% weight | No negative |

**Part B Trades:** Electrician, Electronics, IT, Fitter, Welder, Machinist, Refrigeration & AC, Diesel Mechanic, etc. (18 trade options)

**Marking:** +1 / −1/3 (CBT 1 & 2A) | No negative (CBT 2B, CBAT)

### Implementation Assessment 🟡 Medium
- CBT 1 is easy (same as NTPC structure, slightly shorter)
- **The challenge:** CBT 2 Part B is trade-specific — 18 different technical syllabus tracks
- Each trade needs its own question bank (Electrician questions ≠ Fitter questions)
- **Recommendation:** Implement CBT 1 + Part A first. Part B = one trade per sprint
- Question generation: **Good for CBT 1/2A** | **Requires careful prompting for trades** (technical accuracy)

---

## 4. IBPS PO — Probationary Officer

### Exam Structure
| Stage | Questions | Marks | Duration | Notes |
|-------|-----------|-------|----------|-------|
| Prelims | 100 | 100 | 60 min (20 min/section) | Qualifying |
| Mains Objective | 145 | 200 | 160 min | Counted in merit |
| Mains Descriptive | 2 tasks | 25 | 30 min | Letter + Essay |
| Interview | — | 100 | — | Final selection |

**Prelims Sections:**
- English Language: 30 Q, 20 min
- Quantitative Aptitude: 35 Q, 20 min
- Reasoning Ability: 35 Q, 20 min

**Mains Sections:**
- Reasoning & Computer Aptitude: 45 Q, 60 min
- English Language: 35 Q, 40 min
- Data Analysis & Interpretation: 35 Q, 45 min
- General / Economy / Banking Awareness: 40 Q, 35 min

**Marking:** +1 / −0.25

### Implementation Assessment 🟡 Medium
- Prelims: Pure MCQ with sectional time → **Easy**
- Mains Objective: Same, 5 sections with individual timers → **Easy**
- Mains Descriptive (letter/essay): Needs AI evaluation → **Medium** (use Gemini to grade)
- Banking Awareness: Gemini can generate but needs to be prompted with "Indian banking system, RBI policies, Basel norms" etc.
- **Plan:** Prelims mock first → Mains objective → Descriptive with AI grading (v2)

---

## 5. IBPS Clerk

### Exam Structure
| Stage | Questions | Marks | Duration | Notes |
|-------|-----------|-------|----------|-------|
| Prelims | 100 | 100 | 60 min (20 min/section) | Qualifying |
| Mains | 155 | 200 | 120 min | Final merit |

**Mains Sections:**
- General/Financial Awareness: 50 Q, 35 min
- English Language: 40 Q, 35 min
- Reasoning Ability & Computer Aptitude: 50 Q, 45 min
- Quantitative Aptitude: 50 Q, 45 min

**Marking:** +1 / −0.25 | No interview

### Implementation Assessment 🟢 Easy
- No descriptive component (unlike PO)
- Slightly easier than PO but same structure
- Financial Awareness: bank rates, schemes, insurance — well within Gemini's knowledge
- **Can share question generation logic with IBPS PO (same domains)**

---

## 6. CUET UG — Common University Entrance Test

### Exam Structure
| Section | Questions | Attempt | Duration | Marking |
|---------|-----------|---------|----------|---------|
| IA — Language (mandatory) | 50 | 40 | 45 min | +5/−1 |
| IB — Additional Language | 50 | 40 | 45 min | +5/−1 |
| II — Domain Subject | 50 per subject | 40 | 45 min each | +5/−1 |
| III — General Test | 60 | 50 | 60 min | +5/−1 |

**Student picks:** 1–2 languages + 2–6 domain subjects + optional general test
**Domain subjects (27 options):** Physics, Chemistry, Biology, Maths, Economics, History, Political Science, Geography, Sociology, Psychology, Accountancy, Business Studies, etc.
**Total exam duration:** Multiple slots; student attends only their chosen subjects

**Marking:** +5 / −1 (unique — highest per-question positive marking)

### Implementation Assessment 🟡 Medium
- MCQ format is easy
- **The challenge:** Students take different subject combinations — your app needs subject selection flow before test
- 27+ domain subjects = 27 different question banks needed
- Language comprehension sections need passage-based questions (Gemini handles this well)
- **Recommendation:** Build subject selector UI, generate per-subject question banks lazily (first user of each subject triggers generation)
- General Test + 2-3 popular domain subjects in v1 (Physics, Chemistry, Maths, Economics)

---

## 7. NEET UG — National Eligibility cum Entrance Test

### Exam Structure (2024-2025)
| Section | Questions | Marks | Notes |
|---------|-----------|-------|-------|
| Physics | 45 | 180 | — |
| Chemistry | 45 | 180 | — |
| Botany | 45 | 180 | — |
| Zoology | 45 | 180 | — |
| **Total** | **180** | **720** | |

**Duration:** 180 min (reduced from 200 min in 2025)
**Mode:** Offline (pen-and-paper) only
**Marking:** +4 / −1
**No sectional cutoff**

**Syllabus:** NCERT Class 11 & 12 (Physics, Chemistry, Biology)

### Implementation Assessment 🟡 Medium*
- Format is simplest possible: pure MCQ, 4 sections, no sectional timer
- **The asterisk:** Factual accuracy is CRITICAL for NEET
  - Wrong Biology facts = students learning incorrect content
  - Questions must match NCERT syllabus precisely
  - Gemini needs to be prompted with "NCERT Class 11/12 syllabus only"
- Diagram-based questions (biological diagrams) cannot be generated as text — limit to text-only questions
- **Question quality validation** becomes important here (wrong answers in medical exam prep = real harm)
- **Recommendation:** Add "Topic" tag to each question (Cell Biology, Genetics, Thermodynamics etc.) for filtered practice
- Start with Biology (most questions) → Chemistry → Physics

---

## 8. IIT JEE Main

### Exam Structure
| Section | Q per Subject | Type | Marking |
|---------|--------------|------|---------|
| MCQ | 20 per subject (60 total) | Single correct | +4 / −1 |
| Numerical | 10 per subject (30 total, attempt 5) | Integer input | +4 / 0 |
| **Total** | **90 (attempt 75)** | | |

**Subjects:** Physics, Chemistry, Mathematics (30 each)
**Duration:** 3 hours
**2 sessions per year** (Jan + Apr)

**Syllabus:** Class 11 + 12 Physics, Chemistry, Maths (NCERT + beyond)

### Implementation Assessment 🟡 Medium
- **New UI element needed:** Numerical Value input field (integer answer, not MCQ options)
- Separate marking for MCQ (−1 negative) vs Numerical (no negative)
- The exam has an "attempt 5 out of 10 numerical" choice — needs a skip-or-attempt mechanism
- Gemini can generate JEE-level MCQs but **numerical answers need to be verified** (math computation errors)
- **Recommendation:** Start with MCQ section only (60 questions) in v1. Add Numerical in v2.
- Questions with calculations: Gemini 2.5 Flash has decent math capability but verify answers

---

## 9. IIT JEE Advanced

### Exam Structure (Two Papers, 3 hours each)
Each paper has 3 subjects (Physics, Chemistry, Math) × multiple section types:

| Section Type | Questions | Marking (per Q) |
|-------------|-----------|-----------------|
| Single Correct MCQ | 4-6 per paper | +3 / −1 |
| Multiple Correct MCQ | 3-5 per paper | +4 full / partial (+1 to +3) / −2 wrong |
| Numerical Value | 5-6 per paper | +4 / 0 |
| Paragraph/Comprehension | 2-4 per paper | +3 / −1 |
| **Pattern changes every year** | | |

**Total:** ~54 questions per paper × 2 papers = 108 questions
**Duration:** 3 hours per paper (6 hours total across 2 days)

### Implementation Assessment 🔴 Hard
- **Multiple Correct MCQ** requires checkbox UI (not radio buttons) + partial marking logic
- Partial marking: getting some correct options right = 1/2/3 marks; getting any wrong = −2
- Pattern changes annually → maintaining the mock needs yearly updates
- High-level mathematics/physics — Gemini accuracy is inconsistent for advanced problems
- **Realistic assessment:** Don't implement JEE Advanced in v1 or v2
- **v3 approach:** MCQ and Numerical only (skip multi-correct for initial release), add multi-correct with partial scoring in v4

---

## 10. UPSC Civil Services Prelims

### Exam Structure
| Paper | Questions | Marks | Duration | Nature |
|-------|-----------|-------|----------|--------|
| GS Paper 1 | 100 | 200 | 120 min | Counts in rank |
| CSAT Paper 2 | 80 | 200 | 120 min | Qualifying (33% = 66/200) |

**GS Paper 1 Topics:**
- Indian History & Culture (ancient, medieval, modern)
- Indian & World Geography (physical, social, economic)
- Indian Polity (Constitution, governance, panchayati raj)
- Economic & Social Development
- Environment & Ecology (climate, biodiversity)
- General Science (basic physics, chemistry, biology)
- Current Events (national & international)

**CSAT Topics:**
- Comprehension, Communication Skills
- Basic Numeracy (Class 10 level)
- Data Interpretation
- Decision Making (no negative marking on DM questions)
- English Language Comprehension

**Marking:** +2 / −0.667 (GS Paper 1) | +2.5 / −0.833 (CSAT)

### Implementation Assessment 🟡 Medium*
- Format is MCQ, clean structure
- **The asterisk (big one):** Current Affairs — UPSC asks about events from the past 12 months
  - AI-generated current affairs questions will be outdated
  - Need to either: (a) tag questions with year, (b) focus on static GK only, (c) integrate news API
- Static syllabus topics: Gemini handles History, Geography, Polity, Economy very well
- Environment & Science: Good Gemini coverage
- **Recommendation:** Generate questions for static topics only. Clearly mark "Current Affairs" as a section that requires periodic refresh. Warn users.
- GS Paper 1 is high-demand; CSAT is simpler

---

## 11. CAT — Common Admission Test

### Exam Structure (2024-2025)
| Section | Q | MCQ | TITA | Time | Marking |
|---------|---|-----|------|------|---------|
| VARC | 24 | 20 | 4 | 40 min | +3 MCQ/−1; +3 TITA/0 |
| DILR | 20 | 14 | 6 | 40 min | +3 MCQ/−1; +3 TITA/0 |
| QA | 22 | 15 | 7 | 40 min | +3 MCQ/−1; +3 TITA/0 |
| **Total** | **66** | | | **120 min** | |

**TITA = Type In The Answer** (numerical/text input, no options, no negative marking)

**VARC:** Reading Comprehension passages (4-5 passages, 4-5 questions each) + Para-jumbles + Para-summary
**DILR:** Sets of Data Interpretation (bar charts, pie charts, tables) + Logical Reasoning puzzles
**QA:** Arithmetic, Algebra, Geometry, Number Theory, Modern Math

**Sectional time locks** — cannot go back to previous section

### Implementation Assessment 🟡 Medium
- **TITA questions:** Need a text/number input field UI (like JEE Numerical but for text too)
- **Passage-based questions:** Gemini needs to generate a passage AND 4-5 questions based on it — doable
- **DILR sets:** One prompt needs to generate a data table/chart scenario + 4-6 questions — harder to get consistent quality
- **Strict sectional timer that locks:** Implemented with a state machine (current section → cannot revisit)
- **Recommendation:** VARC + QA first (cleaner question types). DILR sets are harder to generate well — add in v2
- CAT aspirants are high-value users (IIM applicants)

---

## 12. SAT — Digital SAT (2024 Format)

### Exam Structure (Adaptive)
| Module | Q | Time | Content |
|--------|---|------|---------|
| Reading & Writing M1 | 27 | 32 min | Passage-based |
| Reading & Writing M2 | 27 | 32 min | Adapts to M1 performance |
| Math M1 | 22 | 35 min | MCQ + grid-in |
| Math M2 | 22 | 35 min | Adapts to M1 performance |
| **Total** | **98** | **136 min** | |

**Score:** 400–1600 (200–800 per section)
**No negative marking**
**Adaptive:** M2 is harder or easier depending on M1 score

**Math Grid-in:** Student types answer (no options, no negative). ~25% of Math questions.
**Reading & Writing:** Single short passage (25-150 words) per question — very different from old SAT

### Implementation Assessment 🟡 Medium
- **Grid-in questions:** Same as TITA — need text input UI
- **Adaptive difficulty:** To truly simulate SAT, M2 should be harder/easier based on M1 performance
  - Simple approach: Skip adaptive, serve mixed difficulty. Flag "SAT Adaptive mode coming soon"
  - Complex approach: Tag questions with difficulty (Easy/Medium/Hard), serve M2 based on M1 score
- **Short passage per question:** Gemini generates a 50-100 word passage + 1 question — actually easy to generate consistently
- Score reporting (200-800 scale) needs a conversion formula
- **Recommendation:** Non-adaptive version first. 2 sections, MCQ + text input. Add adaptive difficulty in v2.

---

## 13. ACT — 2025 Enhanced Format

### Exam Structure
| Section | Q | Time | Notes |
|---------|---|------|-------|
| English | 50 | 35 min | Grammar, Usage, Mechanics |
| Math | 45 | 50 min | Pre-algebra to Trig |
| Reading | 36 | 40 min | 4 passages, 9 Q each |
| Science (Optional) | 40 | 40 min | Data interpretation, not science facts |
| **Total (Core)** | **131** | **125 min** | Science now optional |

**Score:** 1–36 composite (avg of 3–4 sections)
**No negative marking**
**4 answer choices (not 5 as before)**

**Note:** Science section tests data interpretation/reasoning, NOT science facts — it's almost like a DI section

### Implementation Assessment 🟢 Easy
- Simplest international exam to implement
- All MCQ, no negative marking, no adaptive difficulty
- Science section is reasoning-based (not factual) — Gemini generates this well
- Passage-based Reading: same approach as CAT VARC
- Score composite calculation: simple average
- **Only challenge:** English section (grammar rules) — Gemini is strong here

---

## 14. IELTS — International English Language Testing System

### Exam Structure
| Section | Q | Time | Question Types |
|---------|---|------|---------------|
| Listening | 40 | 30 min + transfer | MCQ, Matching, Note completion |
| Reading | 40 | 60 min | MCQ, T/F/NG, Matching headings, Sentence completion |
| Writing | 2 tasks | 60 min | Task 1: 150 words (graph/letter), Task 2: 250 words (essay) |
| Speaking | 3 parts | 11-14 min | Face-to-face interview |

**Scoring:** Band 0–9 per section (0.5 increments) → Overall band = average
**No negative marking**
**Band 7+ = most UK universities | Band 6+ = most other countries**

### Implementation Assessment 🔴 Hard
- **Reading:** Implementable ✅ — MCQ, matching, passage-based
- **Listening:** Needs audio files ❌ (not AI-generatable easily in v1)
- **Writing:** Can be simulated ✅ but needs AI grading with rubric (Gemini can evaluate essays)
- **Speaking:** Cannot be implemented without Speech-to-Text pipeline ❌

**Realistic Scope:**
- **v1:** Reading mock tests only (40 Q, 60 min, passage-based)
- **v2:** Writing practice with AI feedback using Gemini
- **v3:** Listening (with pre-recorded audio or TTS-generated) + Speaking with STT
- Present as "IELTS Reading & Writing Practice" not "Full IELTS Mock"

---

## 15. TOEFL iBT — 2024 Revised Format

### Exam Structure
| Section | Q | Time | Types |
|---------|---|------|-------|
| Reading | 20 | 35 min | MCQ, Multiple-correct, Prose summary |
| Listening | 28 | 36 min | Lectures + conversations, MCQ |
| Speaking | 4 tasks | 16 min | Integrated (read+listen+speak) + Independent |
| Writing | 2 tasks | 29 min | Integrated (read+listen+write) + Academic |

**Score:** 0–120 (30 per section)
**No negative marking**

### Implementation Assessment 🔴 Hard
- Same structural problem as IELTS: Listening and Speaking require audio pipeline
- **Reading:** Implementable ✅ (academic passages + MCQ)
- **Writing:** AI-graded with Gemini ✅ (rubric-based evaluation)
- **Listening:** Needs audio ❌
- **Speaking:** Needs STT/TTS ❌
- **Integrated tasks:** Need to combine passage + audio → significantly complex

**Realistic Scope:**
- **v1:** Reading mock only
- **v2:** Writing practice with AI feedback
- Same as IELTS — market as "TOEFL Reading Practice"

---

## Implementation Roadmap Recommendation

### Phase 1 — Launch (Pure MCQ, Max Demand) 🟢
Priority order based on student volume × implementation ease:

1. **SSC CGL Tier 1** — 10M+ aspirants, easiest to build, highest ROI
2. **IBPS Clerk Prelims** — 5M+ aspirants, pure MCQ
3. **RRB NTPC CBT 1** — 5M+ aspirants, simplest format
4. **NEET UG** — 2M+ aspirants, pure MCQ (factual accuracy must be high)
5. **IBPS PO Prelims** — included with Clerk (same structure)

### Phase 2 — Extend (Mixed formats) 🟡
6. **UPSC Prelims GS Paper 1** — premium segment, high monetization potential
7. **CAT** (VARC + QA first) — MBA aspirants, premium users
8. **JEE Main** (MCQ only first) — massive market, needs numerical input UI
9. **CUET UG** (top 5 subjects) — growing market post-centralization
10. **ACT** — international students, easy to build

### Phase 3 — Advanced Features 🔴
11. **JEE Advanced** — needs multi-correct + partial marking UI
12. **SSC CGL Tier 2** — sectional complexity
13. **IELTS/TOEFL Reading** — reading-only mocks first
14. **SAT** — adaptive difficulty engine
15. **IELTS/TOEFL Writing** — AI grading pipeline

---

## Key Engineering Decisions per Format

| Feature Needed | Exams That Need It | Complexity |
|---------------|--------------------|------------|
| Standard MCQ + timer | All Phase 1 | Already built ✅ |
| Per-section timer (auto-close) | SSC CGL, IBPS, CAT | Medium — state machine |
| Numerical input field | JEE Main, CAT TITA, SAT grid-in | Medium — new Q type |
| Multiple correct checkboxes | JEE Advanced | Medium — new Q type |
| Partial marking logic | JEE Advanced | Hard |
| Passage-based Q groups | CAT VARC, UPSC, IELTS Reading | Medium |
| Subject selection UI | CUET UG | Medium |
| AI essay grading | IBPS PO Mains, IELTS/TOEFL Writing | Hard |
| Audio integration | IELTS/TOEFL Listening | Very Hard |
| Adaptive difficulty engine | SAT Digital | Hard |
| Score scale conversion | SAT (400-1600), ACT (1-36), IELTS (0-9) | Easy |
| Current Affairs refresh | UPSC, SSC CGL GK, IBPS GK | Medium (cron + Gemini) |
