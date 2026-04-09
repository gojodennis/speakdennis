export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'monologue' | 'conversational';
  prompts: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'interview',
    name: 'Job Interview',
    description: 'Practice answering common interview questions with clarity and confidence.',
    icon: '💼',
    difficulty: 'intermediate',
    type: 'conversational',
    prompts: [
      'Tell me about yourself and what makes you a strong candidate for this role.',
      'Describe a time when you faced a significant challenge at work and how you overcame it.',
      'Where do you see yourself in five years, and how does this role fit into that plan?',
      'What is your greatest strength, and how has it helped you succeed professionally?',
      'Tell me about a time you had to work with a difficult team member.',
    ],
  },
  {
    id: 'presentation',
    name: 'Business Presentation',
    description: 'Rehearse delivering a structured, persuasive business presentation.',
    icon: '📊',
    difficulty: 'advanced',
    type: 'monologue',
    prompts: [
      'Present the key highlights and metrics from last quarter\'s performance.',
      'Pitch a new product idea to a team of investors in under 5 minutes.',
      'Explain a complex technical concept to a non-technical executive audience.',
      'Present your team\'s quarterly roadmap and priorities for the next 90 days.',
    ],
  },
  {
    id: 'social',
    name: 'Social Conversation',
    description: 'Build confidence in everyday social situations and small talk.',
    icon: '🤝',
    difficulty: 'beginner',
    type: 'monologue',
    prompts: [
      'Introduce yourself to a new colleague at a networking event.',
      'Describe your weekend plans or a recent trip you took.',
      'Talk about a hobby or passion of yours and why you enjoy it.',
      'Explain a recent book, movie, or podcast that you found interesting.',
    ],
  },
  {
    id: 'impromptu',
    name: 'Impromptu Challenge',
    description: 'Speak off-the-cuff on a random topic to build quick thinking skills.',
    icon: '⚡',
    difficulty: 'advanced',
    type: 'monologue',
    prompts: [
      'What is the most important skill a leader can have?',
      'Argue for or against: "Remote work is better than office work."',
      'Describe what the world might look like in 50 years.',
      'If you could have dinner with any historical figure, who would it be and why?',
      'What is the most valuable lesson you\'ve learned in life so far?',
    ],
  },
  {
    id: 'academic',
    name: 'Academic Presentation',
    description: 'Practice delivering research or academic content clearly and credibly.',
    icon: '🎓',
    difficulty: 'advanced',
    type: 'monologue',
    prompts: [
      'Summarize a research paper or project you have worked on recently.',
      'Explain the methodology and key findings of a study in your field.',
      'Present both sides of a current debate in your area of expertise.',
      'Defend your thesis or main argument on a topic you are knowledgeable about.',
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getRandomPrompt(scenario: Scenario): string {
  return scenario.prompts[Math.floor(Math.random() * scenario.prompts.length)];
}
