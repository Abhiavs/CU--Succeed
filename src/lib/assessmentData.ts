import { averageWheelScore } from "./wheelScoring";

export interface WheelDimension {
  id: string;
  name: string;
  shortName: string;
  category: "Technical" | "Behavioral" | "Execution" | "Strategic";
  description: string;
  prompt: string;
  benchmark: number; // 1-10 industry benchmark
  color: string;
  iconName: string;
}

export const WHEEL_DIMENSIONS: WheelDimension[] = [
  {
    id: "technical",
    name: "Technical & Domain Acumen",
    shortName: "Technical",
    category: "Technical",
    description: "Depth of core domain expertise, practical tooling, systems understanding, and applied skills.",
    prompt: "How confident are you in executing real-world technical problems without external supervision?",
    benchmark: 7.8,
    color: "#10B981", // Emerald
    iconName: "Code2",
  },
  {
    id: "problemSolving",
    name: "Problem Solving & Analytical Logic",
    shortName: "Logic & Solv.",
    category: "Technical",
    description: "Structured thinking, root-cause identification, quantitative reasoning, and breaking complex problems into sub-problems.",
    prompt: "How effectively can you formulate clean, structured solutions to unfamiliar problems?",
    benchmark: 8.2,
    color: "#06B6D4", // Cyan
    iconName: "BrainCircuit",
  },
  {
    id: "communication",
    name: "Communication & Executive Presence",
    shortName: "Communication",
    category: "Behavioral",
    description: "Verbal clarity, concise written expression, active listening, and convincing presentation of ideas.",
    prompt: "How persuasively and clearly do you articulate complex concepts to diverse audiences?",
    benchmark: 7.5,
    color: "#3B82F6", // Blue
    iconName: "MessageSquareText",
  },
  {
    id: "emotionalIntelligence",
    name: "Emotional Intelligence & Self-Awareness",
    shortName: "EQ & Empathy",
    category: "Behavioral",
    description: "Understanding one's emotional triggers, managing workplace stress, empathy, and interpersonal tact.",
    prompt: "How well do you regulate emotions, handle constructive critique, and maintain team harmony under stress?",
    benchmark: 8.0,
    color: "#8B5CF6", // Purple
    iconName: "HeartPulse",
  },
  {
    id: "leadership",
    name: "Leadership & Proactive Ownership",
    shortName: "Leadership",
    category: "Strategic",
    description: "Taking initiative, guiding peers, accountability for outcomes, and inspiring collaborative momentum.",
    prompt: "When goals are ambiguous, how naturally do you step forward to coordinate and deliver results?",
    benchmark: 7.0,
    color: "#EC4899", // Pink
    iconName: "ShieldStar",
  },
  {
    id: "timeManagement",
    name: "Time Management & Execution Discipline",
    shortName: "Time & Focus",
    category: "Execution",
    description: "Prioritization frameworks, managing sprint deliverables, punctuality, and deep work focus.",
    prompt: "How consistently do you deliver high-priority milestones on schedule without quality degradation?",
    benchmark: 7.6,
    color: "#F59E0B", // Amber
    iconName: "ClockCheck",
  },
  {
    id: "careerClarity",
    name: "Career Clarity & Continuous Learning",
    shortName: "Vision & Plan",
    category: "Strategic",
    description: "Defined career trajectory, curiosity for emerging industry trends, and self-directed upskilling habits.",
    prompt: "How well-defined is your 3-year professional roadmap and daily upskilling regimen?",
    benchmark: 7.2,
    color: "#14B8A6", // Teal
    iconName: "Compass",
  },
  {
    id: "adaptability",
    name: "Adaptability & Grit / Resilience",
    shortName: "Adaptability",
    category: "Execution",
    description: "Embracing fast-paced change, overcoming failures, unlearning outdated habits, and growth mindset.",
    prompt: "How quickly do you pivot and maintain high enthusiasm when confronted with major obstacles or change?",
    benchmark: 8.4,
    color: "#6366F1", // Indigo
    iconName: "Zap",
  },
];

export interface PsychometricQuestion {
  id: string;
  dimension: string;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    score: number; // 1 to 4
  }[];
}

/*
 * ============================================================
 * PSYCHOMETRIC SECTIONS
 *
 * 30 questions total, divided into 3 sections of 10 questions.
 * Each question scores 1–4, so each section max is 40.
 * Overall total: 30–120.
 *
 * Section assignment is driven by the `parameter` field on
 * each Question in the database. The admin sets this when
 * creating the question.
 * ============================================================
 */

export const PSYCHOMETRIC_SECTIONS = [
  {
    id: "self-belief",
    name: "Self-Belief & Self-Awareness",
    parameter: "Self-Belief & Self-Awareness",
    questionRange: "Q1–10",
    maxScore: 40,
  },
  {
    id: "communication",
    name: "Communication & Social Confidence",
    parameter: "Communication & Social Confidence",
    questionRange: "Q11–20",
    maxScore: 40,
  },
  {
    id: "action-resilience",
    name: "Action, Resilience & Decision-Making",
    parameter: "Action, Resilience & Decision-Making",
    questionRange: "Q21–30",
    maxScore: 40,
  },
] as const;

export type PsychometricSectionId = (typeof PSYCHOMETRIC_SECTIONS)[number]["id"];

/*
 * ============================================================
 * OVERALL SCORING INTERPRETATION
 *
 * Total possible: 30–120
 * ============================================================
 */

export function getOverallConfidenceLevel(totalScore: number) {
  if (totalScore >= 90) return { label: "High Confidence", range: "90–120" };
  if (totalScore >= 60) return { label: "Moderate Confidence", range: "60–89" };
  return { label: "Low Confidence", range: "30–59" };
}

/*
 * ============================================================
 * PER-SECTION SCORING INSIGHTS
 *
 * Each section has 4 tiers based on raw score /40.
 * Each tier has a label and 3 insight paragraphs.
 * ============================================================
 */

export interface SectionInsight {
  tier: string;
  range: string;
  paragraphs: [string, string, string];
}

export const SECTION_INSIGHTS: Record<PsychometricSectionId, SectionInsight[]> = {
  "self-belief": [
    {
      tier: "Needs Strong Development",
      range: "0–10",
      paragraphs: [
        "Self-belief is an area for development. Your responses suggest that you may sometimes doubt your abilities or focus more on your limitations than your strengths.",
        "You may be highly affected by comparison or mistakes. Building a more balanced view of your abilities can help you feel more secure in yourself.",
        "Start with small wins. Recognizing your strengths, accepting mistakes as part of learning, and setting achievable goals can gradually strengthen your self-belief.",
      ],
    },
    {
      tier: "Developing",
      range: "11–20",
      paragraphs: [
        "You are beginning to recognize your abilities. Your responses show some self-belief, although you may still experience moments of self-doubt.",
        "You may sometimes underestimate yourself. Comparing yourself with others or worrying about mistakes can affect how confidently you see your own potential.",
        "Focus on progress rather than perfection. Acknowledging your improvements and learning from setbacks can help make your self-belief more consistent.",
      ],
    },
    {
      tier: "Good",
      range: "21–30",
      paragraphs: [
        "You show a healthy level of self-belief. You generally recognize your strengths and trust yourself to handle challenges.",
        "You appear reasonably comfortable with self-improvement. You can acknowledge areas that need development without completely losing confidence in yourself.",
        "Keep building on this foundation. Taking on new challenges and reflecting on your achievements can make your confidence even stronger.",
      ],
    },
    {
      tier: "Strong",
      range: "31–40",
      paragraphs: [
        "You demonstrate strong self-belief. You appear comfortable recognizing your strengths and trusting your ability to learn and improve.",
        "You show healthy self-awareness. You can acknowledge mistakes or areas for improvement without allowing them to define your abilities.",
        "Your mindset supports continuous growth. Continue challenging yourself while keeping your confidence grounded in self-awareness and learning.",
      ],
    },
  ],

  "communication": [
    {
      tier: "Needs Strong Development",
      range: "0–10",
      paragraphs: [
        "Communication confidence is an area for development. You may hesitate to express your thoughts or interact in situations where you feel observed or judged.",
        "Fear of mistakes or judgment may sometimes hold you back. This can make it harder to participate even when you have something valuable to contribute.",
        "Start speaking in small, comfortable situations. Asking questions, sharing opinions and participating in group activities can gradually make communication feel easier.",
      ],
    },
    {
      tier: "Developing",
      range: "11–20",
      paragraphs: [
        "You are developing confidence in communication. You can express yourself in familiar situations but may hesitate in unfamiliar or challenging settings.",
        "You may sometimes hold back your opinions. Concern about how others perceive you could affect your willingness to speak openly.",
        "Regular participation can help. Small steps such as introducing yourself, asking questions and contributing to discussions can strengthen your communication confidence.",
      ],
    },
    {
      tier: "Good",
      range: "21–30",
      paragraphs: [
        "You show good communication confidence. You are generally comfortable expressing your thoughts and participating with others.",
        "You appear reasonably comfortable in social situations. Disagreement or unfamiliar interactions may challenge you occasionally, but they do not usually stop you from communicating.",
        "Keep practicing active communication. Taking opportunities to speak, present and participate can make your confidence more consistent across different situations.",
      ],
    },
    {
      tier: "Strong",
      range: "31–40",
      paragraphs: [
        "You demonstrate strong communication confidence. You appear comfortable expressing your thoughts and interacting with different people.",
        "You handle social situations with confidence. You are generally willing to ask questions, share opinions and communicate even when others may disagree.",
        "Your communication can become a strength. Continue practicing listening, presenting and constructive discussion to make your confidence even more effective.",
      ],
    },
  ],

  "action-resilience": [
    {
      tier: "Needs Strong Development",
      range: "0–10",
      paragraphs: [
        "Taking action is an area for development. You may sometimes avoid opportunities because of fear of failure, uncertainty or self-doubt.",
        "Setbacks may affect your confidence. A difficult experience or mistake can sometimes make it harder for you to try again.",
        "Build confidence through small actions. Taking manageable challenges, making simple decisions independently and learning from mistakes can gradually strengthen your resilience.",
      ],
    },
    {
      tier: "Developing",
      range: "11–20",
      paragraphs: [
        "You are developing confidence in taking action. You may take initiative in familiar situations but hesitate when something feels uncertain or challenging.",
        "You may sometimes allow fear of failure to influence your decisions. This can prevent you from exploring opportunities that could help you grow.",
        "Practice stepping slightly outside your comfort zone. Taking small initiatives and treating mistakes as learning experiences can build stronger resilience.",
      ],
    },
    {
      tier: "Good",
      range: "21–30",
      paragraphs: [
        "You show good confidence in taking action. You are generally willing to make decisions, accept challenges and move forward when situations become difficult.",
        "You demonstrate reasonable resilience. Setbacks may affect you temporarily, but you are usually able to recover and continue.",
        "Keep challenging yourself. Taking initiative in unfamiliar situations and volunteering for new responsibilities can further strengthen your confidence.",
      ],
    },
    {
      tier: "Strong",
      range: "31–40",
      paragraphs: [
        "You demonstrate strong action-oriented confidence. You appear willing to take initiative and make decisions even when situations are unfamiliar.",
        "You show strong resilience. Mistakes and setbacks are more likely to be treated as experiences to learn from rather than reasons to give up.",
        "You have a strong growth-oriented approach. Continue taking meaningful challenges, accepting constructive feedback and using difficult situations as opportunities to develop.",
      ],
    },
  ],
};

/*
 * Get the insight for a section given its raw score (0–40).
 */
export function getSectionInsight(
  sectionId: PsychometricSectionId,
  rawScore: number
): SectionInsight {
  const insights = SECTION_INSIGHTS[sectionId];
  if (rawScore >= 31) return insights[3];
  if (rawScore >= 21) return insights[2];
  if (rawScore >= 11) return insights[1];
  return insights[0];
}

/*
 * Map a question's parameter to its section id.
 * Falls back to index-based assignment for backward compat.
 */
export function getSectionIdFromParameter(
  parameter: string | null | undefined
): PsychometricSectionId | null {
  if (!parameter) return null;
  const normalised = parameter.trim().toLowerCase();

  for (const section of PSYCHOMETRIC_SECTIONS) {
    if (section.parameter.toLowerCase() === normalised) {
      return section.id;
    }
  }

  return null;
}

/*
 * Legacy sample questions (kept for reference / tests).
 * The real questions live in the database.
 */
export const PSYCHOMETRIC_QUESTIONS: PsychometricQuestion[] = [];

export interface AptitudeQuestion {
  id: string;
  section: "Quantitative" | "Logical Reasoning" | "Verbal & Communication";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: "apt-1",
    section: "Quantitative",
    difficulty: "Medium",
    question: "A train running at 72 km/h crosses a 260m long platform in 23 seconds. What is the length of the train?",
    options: [
      { id: "A", text: "180 meters" },
      { id: "B", text: "200 meters" },
      { id: "C", text: "220 meters" },
      { id: "D", text: "240 meters" },
    ],
    correctAnswer: "B",
    explanation: "Speed = 72 km/h = 72 * (5/18) = 20 m/s. Total distance in 23s = 20 * 23 = 460m. Train length = 460 - 260 = 200m.",
  },
  {
    id: "apt-2",
    section: "Quantitative",
    difficulty: "Medium",
    question: "If A can complete a work in 12 days and B can complete the same work in 18 days, how many days will they take working together?",
    options: [
      { id: "A", text: "6.8 days" },
      { id: "B", text: "7.2 days" },
      { id: "C", text: "8.0 days" },
      { id: "D", text: "9.5 days" },
    ],
    correctAnswer: "B",
    explanation: "Combined rate = (1/12) + (1/18) = (3 + 2)/36 = 5/36 per day. Time taken = 36/5 = 7.2 days.",
  },
  {
    id: "apt-3",
    section: "Quantitative",
    difficulty: "Easy",
    question: "A merchant marks an item 25% above cost price and allows a discount of 10% on the marked price. What is the net profit percentage?",
    options: [
      { id: "A", text: "12.5%" },
      { id: "B", text: "15.0%" },
      { id: "C", text: "10.0%" },
      { id: "D", text: "14.2%" },
    ],
    correctAnswer: "A",
    explanation: "Let CP = 100. MP = 125. SP = 125 * 0.90 = 112.5. Profit = 112.5 - 100 = 12.5%.",
  },
  {
    id: "apt-4",
    section: "Logical Reasoning",
    difficulty: "Medium",
    question: "In a certain code, 'VENTURE' is written as 'CUZXQVG'. How is 'TRAINER' written in that code?",
    options: [
      { id: "A", text: "UQBJOHS" },
      { id: "B", text: "VPBKPIT" },
      { id: "C", text: "TPCLPHS" },
      { id: "D", text: "UPCKQIR" },
    ],
    correctAnswer: "A",
    explanation: "Pattern shifts letters with offset. Evaluating character correspondence yields 'UQBJOHS'.",
  },
  {
    id: "apt-5",
    section: "Logical Reasoning",
    difficulty: "Hard",
    question: "Statements:\n1. All engineers are innovators.\n2. Some innovators are leaders.\nConclusions:\nI. Some engineers are leaders.\nII. All leaders are innovators.",
    options: [
      { id: "A", text: "Only Conclusion I follows" },
      { id: "B", text: "Only Conclusion II follows" },
      { id: "C", text: "Either I or II follows" },
      { id: "D", text: "Neither I nor II follows" },
    ],
    correctAnswer: "D",
    explanation: "From 'All A are B' and 'Some B are C', no definite relation between A and C can be deduced without additional overlap. Hence neither follows.",
  },
  {
    id: "apt-6",
    section: "Logical Reasoning",
    difficulty: "Medium",
    question: "Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is the person in the photo related to Rohit?",
    options: [
      { id: "A", text: "Mother" },
      { id: "B", text: "Sister" },
      { id: "C", text: "Cousin" },
      { id: "D", text: "Aunt" },
    ],
    correctAnswer: "B",
    explanation: "Grandfather's only son is Rohit's father. The daughter of Rohit's father is Rohit's sister.",
  },
  {
    id: "apt-7",
    section: "Verbal & Communication",
    difficulty: "Easy",
    question: "Choose the word most nearly OPPOSITE in meaning to 'METICULOUS':",
    options: [
      { id: "A", text: "Careless" },
      { id: "B", text: "Precise" },
      { id: "C", text: "Punctual" },
      { id: "D", text: "Diligent" },
    ],
    correctAnswer: "A",
    explanation: "'Meticulous' means showing great attention to detail. The direct antonym is 'Careless'.",
  },
  {
    id: "apt-8",
    section: "Verbal & Communication",
    difficulty: "Medium",
    question: "Select the sentence with the correct grammatical structure and subject-verb agreement:",
    options: [
      { id: "A", text: "Each of the candidate have submitted their credentials on time." },
      { id: "B", text: "Each of the candidates has submitted their credentials on time." },
      { id: "C", text: "Each of the candidates have submit their credentials on time." },
      { id: "D", text: "Each candidates has submitted their credentials on time." },
    ],
    correctAnswer: "B",
    explanation: "'Each of the [plural noun]' takes a singular verb ('has submitted').",
  },
];

export interface CompositeResult {
  overallReadiness: number; // 0 - 100
  percentile: number; // e.g. 92nd percentile
  tier: string; // e.g. "Industry Elite", "Placement Ready", "Emerging Talent"
  psychometricScore: number;
  psychometricArchetype: {
    title: string;
    badge: string;
    description: string;
    keyStrengths: string[];
    growthAreas: string[];
  };
  aptitudeScore: number;
  aptitudeSectionBreakdown: {
    quantitative: number;
    logical: number;
    verbal: number;
  };
  wheelAverage: number;
  wheelBreakdown: Record<string, number>;
  recommendations: {
    title: string;
    description: string;
    priority: "High" | "Medium" | "Strategic";
  }[];
}

export function calculateCompositeProfile(
  psyScore: number,
  aptScore: number,
  wheelScores: Record<string, number>
): CompositeResult {
  /*
   * The wheel average is the rating total divided by the number of
   * dimensions actually on the wheel (5 for PRE and POST), then
   * scaled to the 0–100 composite scale. Shared with the wheel
   * submission path so the composite cannot drift from the score.
   */
  const wheelKeys = Object.keys(wheelScores);

  const wheelAvg =
    wheelKeys.length > 0
      ? averageWheelScore(
          wheelKeys.reduce((acc, k) => acc + (wheelScores[k] || 0), 0),
          wheelKeys.length
        ) * 10
      : 75;

  const validPsy = Math.min(100, Math.max(0, psyScore || 78));
  const validApt = Math.min(100, Math.max(0, aptScore || 72));
  const validWheel = Math.min(100, Math.max(0, wheelAvg));

  // Weighted formula: 40% Aptitude + 30% Psychometric + 30% Wheel
  const composite = Math.round(validApt * 0.4 + validPsy * 0.3 + validWheel * 0.3);
  const percentile = Math.min(99, Math.max(45, Math.round(composite * 1.08)));

  let tier = "Emerging Talent";
  if (composite >= 85) tier = "Industry Ready (Tier 1)";
  else if (composite >= 70) tier = "Placement Ready (Proficient)";
  else if (composite >= 55) tier = "Core Developing";

  let archetype = {
    title: "Strategic Problem Solver",
    badge: "Analytical Leader",
    description: "Demonstrates balanced analytical rigor with strong emotional composure and team coordination skills.",
    keyStrengths: ["Structured Root-Cause Analysis", "Resilience under ambiguity", "Data-driven communication"],
    growthAreas: ["Executive Speed in Decision-Making", "Cross-Domain Technical Breadth"],
  };

  if (validApt >= 80 && validPsy >= 80) {
    archetype = {
      title: "The High-Impact Architect",
      badge: "Top 5% Talent",
      description: "Combines exceptional logical precision with mature leadership presence and continuous learning discipline.",
      keyStrengths: ["High-speed analytical reasoning", "Calm crisis mitigation", "Inspirational ownership"],
      growthAreas: ["Delegating operational tasks", "Public speaking at scale"],
    };
  } else if (validPsy > validApt) {
    archetype = {
      title: "The Empathetic Catalyst",
      badge: "People & Strategy",
      description: "Exhibits superior team synergy, emotional intelligence, and diplomatic consensus-building.",
      keyStrengths: ["Stakeholder alignment", "High emotional quotient", "Constructive feedback receptivity"],
      growthAreas: ["Speed in quantitative computation", "Edge-case stress testing"],
    };
  }

  return {
    overallReadiness: composite,
    percentile,
    tier,
    psychometricScore: validPsy,
    psychometricArchetype: archetype,
    aptitudeScore: validApt,
    aptitudeSectionBreakdown: {
      quantitative: Math.round(validApt * 0.95),
      logical: Math.round(validApt * 1.02),
      verbal: Math.round(validApt * 0.98),
    },
    wheelAverage: Math.round(validWheel / 10 * 10) / 10,
    wheelBreakdown: wheelScores,
    recommendations: [
      {
        title: "Master High-Pressure Speed Drills",
        description: "Engage in 20-minute rapid quantitative and data interpretation challenges to boost assessment velocity.",
        priority: "High",
      },
      {
        title: "Elevate Executive Communication",
        description: "Practice presenting technical trade-offs using the Pyramid Principle (Answer First, Evidence Second).",
        priority: "Medium",
      },
      {
        title: "Deepen Applied Domain Portfolio",
        description: "Complete one end-to-end production architecture project aligned with target industry tech stacks.",
        priority: "Strategic",
      },
    ],
  };
}
