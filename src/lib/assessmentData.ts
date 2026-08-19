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
    score: number; // 1 to 5
    trait: string;
  }[];
}

export const PSYCHOMETRIC_QUESTIONS: PsychometricQuestion[] = [
  {
    id: "psy-1",
    dimension: "Emotional Resilience & Pressure Handling",
    scenario: "You are two hours away from a critical project deadline, and an unexpected bug breaks a core feature.",
    question: "What is your immediate response?",
    options: [
      { id: "A", text: "Stay calm, isolate the root cause systematically, and notify stakeholders of a realistic mitigation plan.", score: 5, trait: "High Emotional Resilience" },
      { id: "B", text: "Work quickly to deploy a temporary workaround while keeping teammates informed.", score: 4, trait: "Adaptive Action" },
      { id: "C", text: "Feel rushed and try several random fixes simultaneously hoping one resolves it.", score: 2, trait: "Reactive Stress" },
      { id: "D", text: "Feel overwhelmed and step away until someone else notices the issue.", score: 1, trait: "Low Stress Tolerance" },
    ],
  },
  {
    id: "psy-2",
    dimension: "Collaboration & Conflict Resolution",
    scenario: "During a sprint planning session, a peer strongly opposes your technical proposal in front of the entire team.",
    question: "How do you handle their objection?",
    options: [
      { id: "A", text: "Acknowledge their perspective objectively, ask probing questions to understand their concerns, and compare pros/cons data-first.", score: 5, trait: "Collaborative Diplomat" },
      { id: "B", text: "Propose a quick 1-on-1 offline discussion to align before bringing a unified recommendation back.", score: 4, trait: "Pragmatic Peacemaker" },
      { id: "C", text: "Defend your idea aggressively to ensure your authority is not undermined.", score: 2, trait: "Ego-Driven Defensive" },
      { id: "D", text: "Immediately withdraw your idea and remain silent for the rest of the meeting.", score: 1, trait: "Passive Avoidant" },
    ],
  },
  {
    id: "psy-3",
    dimension: "Initiative & Ownership",
    scenario: "You notice a recurring inefficiency in your team's workflow that nobody has been assigned to fix.",
    question: "What action do you take?",
    options: [
      { id: "A", text: "Draft a concise improvement prototype or proposal, validate it with a colleague, and present it to the lead.", score: 5, trait: "Proactive Trailblazer" },
      { id: "B", text: "Mention it briefly in the next retrospective meeting so the team can decide if it's worth fixing.", score: 3, trait: "Constructive Participant" },
      { id: "C", text: "Only fix it for your personal workflow without sharing the solution.", score: 2, trait: "Isolated Worker" },
      { id: "D", text: "Ignore it since it is not explicitly listed in your responsibilities.", score: 1, trait: "Minimalist Mindset" },
    ],
  },
  {
    id: "psy-4",
    dimension: "Growth Mindset & Continuous Learning",
    scenario: "You receive constructive, rigorous feedback pointing out multiple flaws in your recent deliverable.",
    question: "How do you internalize this critique?",
    options: [
      { id: "A", text: "Welcome the feedback eagerly as a clear roadmap for skill elevation and request actionable improvement checkpoints.", score: 5, trait: "Mastery Mindset" },
      { id: "B", text: "Accept the points that make sense, revise the deliverable, and move forward.", score: 4, trait: "Pragmatic Learner" },
      { id: "C", text: "Feel disappointed and assume the reviewer holds personal bias against your work.", score: 2, trait: "Fixed Mindset" },
      { id: "D", text: "Lose motivation and avoid taking on similar projects in the future.", score: 1, trait: "Vulnerable Avoidance" },
    ],
  },
  {
    id: "psy-5",
    dimension: "Decision Making Under Ambiguity",
    scenario: "You must choose an architectural or strategy approach, but you only have 60% of the desired background data.",
    question: "How do you proceed?",
    options: [
      { id: "A", text: "Synthesize available data, identify key assumptions, choose the most reversible pathway, and establish early validation metrics.", score: 5, trait: "Strategic Decisiveness" },
      { id: "B", text: "Consult an experienced mentor, gather rapid insights, and commit to the recommended path.", score: 4, trait: "Consultative Decisiveness" },
      { id: "C", text: "Delay decision-making indefinitely until 100% information is guaranteed.", score: 2, trait: "Analysis Paralysis" },
      { id: "D", text: "Flip a coin or pick randomly to avoid being responsible for the methodology.", score: 1, trait: "Reckless Disengagement" },
    ],
  },
  {
    id: "psy-6",
    dimension: "Ethical Integrity & Values",
    scenario: "You discover a shortcut that would allow the team to pass client QA checks, but it leaves subtle edge-case risks unresolved.",
    question: "What is your course of action?",
    options: [
      { id: "A", text: "Refuse the shortcut, document the risk clearly, and propose an expedited genuine solution with transparent timelines.", score: 5, trait: "Uncompromising Integrity" },
      { id: "B", text: "Bring the trade-off to the engineering lead for a formal risk-acceptance decision.", score: 4, trait: "Compliance Focused" },
      { id: "C", text: "Implement the shortcut and hope the edge cases are never encountered in production.", score: 2, trait: "Compromised Standards" },
      { id: "D", text: "Deliberately conceal the edge case to look good in this quarter's metrics.", score: 1, trait: "Ethical Risk" },
    ],
  },
];

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
  const wheelKeys = Object.keys(wheelScores);
  const wheelAvg =
    wheelKeys.length > 0
      ? (wheelKeys.reduce((acc, k) => acc + (wheelScores[k] || 0), 0) / wheelKeys.length) * 10
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
