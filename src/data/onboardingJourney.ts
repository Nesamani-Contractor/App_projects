import { LookId } from './looks';

export type JourneyOption = {
  id: string;
  label: string;
  emoji?: string;
  feedback?: string;
};

type BaseStep = {
  id: string;
  section: string;
  question: string;
};

export type SingleSelectStep = BaseStep & {
  type: 'single';
  options: JourneyOption[];
};

export type MultiSelectStep = BaseStep & {
  type: 'multi';
  options: JourneyOption[];
  exclusiveOptionId?: string;
};

export type SliderStep = BaseStep & {
  type: 'slider';
  labels: string[];
  defaultIndex: number;
};

export type EmojiScaleStep = BaseStep & {
  type: 'emoji-scale';
  options: JourneyOption[];
};

export type JourneyStep = SingleSelectStep | MultiSelectStep | SliderStep | EmojiScaleStep;

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'goal-upgrade',
    section: 'Goals',
    type: 'single',
    question: "If your face could get one upgrade, what would it be?",
    options: [
      { id: 'glow-tone', label: 'Glowing, even skin tone', emoji: '✨', feedback: 'Glowing skin, coming right up ✨' },
      { id: 'jawline', label: 'A more defined jawline and cheekbones', emoji: '💎', feedback: 'Contour and structure — noted!' },
      { id: 'fine-lines', label: 'Fewer fine lines, a firmer look', emoji: '🌙', feedback: "We'll focus on firmness and smoothness." },
      { id: 'clear-skin', label: 'Clearer skin, fewer breakouts', emoji: '🌸', feedback: 'Clarity is the goal — got it.' },
      { id: 'puffiness', label: 'Less puffiness, a fresher look', emoji: '💧', feedback: "A fresher, de-puffed look it is." },
      { id: 'all-above', label: 'Honestly? All of the above 😄', emoji: '😄', feedback: 'Ambitious — we love that! 😄' },
    ],
  },
  {
    id: 'goal-motivation',
    section: 'Goals',
    type: 'single',
    question: "What's inspiring you to start now?",
    options: [
      { id: 'event', label: 'A special event is coming up', emoji: '🎉', feedback: "Exciting! We'll help you shine for it." },
      { id: 'camera-confidence', label: 'I want to feel more confident on camera', emoji: '🤳', feedback: 'Camera-ready confidence, on the way.' },
      { id: 'noticed-changes', label: "I've noticed changes I'd like to work on", emoji: '👀', feedback: 'Good call — early attention pays off.' },
      { id: 'self-care', label: 'Self-care is my new priority', emoji: '🧖', feedback: "Self-care first. We're here for it." },
      { id: 'curious', label: 'Just curious what AI sees in my face', emoji: '🔍', feedback: 'Let’s see what Mago finds! 👀' },
    ],
  },
  {
    id: 'skin-midday',
    section: 'Skin Profile',
    type: 'single',
    question: 'How does your skin feel by midday?',
    options: [
      { id: 'oily', label: 'Shiny all over (oily)', emoji: '✨', feedback: 'Great, oily skin loves lightweight hydration!' },
      { id: 'combination', label: 'Shiny T-zone, normal cheeks (combination)', emoji: '🌗', feedback: "Got it — we'll balance your T-zone without over-drying your cheeks." },
      { id: 'dry', label: 'Tight or flaky (dry)', emoji: '🍂', feedback: 'Noted — rich, nourishing hydration will be key for you.' },
      { id: 'normal', label: 'Comfortable and balanced (normal)', emoji: '🌿', feedback: 'Lucky you — we’ll help keep that balance glowing.' },
      { id: 'sensitive', label: 'Easily red or irritated (sensitive)', emoji: '🌹', feedback: "Thanks for sharing — we'll keep recommendations gentle." },
    ],
  },
  {
    id: 'skin-triggers',
    section: 'Skin Profile',
    type: 'multi',
    question: 'What does your skin tend to react to?',
    exclusiveOptionId: 'not-sure',
    options: [
      { id: 'sun', label: 'Sun', emoji: '☀️' },
      { id: 'stress', label: 'Stress', emoji: '😣' },
      { id: 'sleep', label: 'Poor sleep', emoji: '😴' },
      { id: 'foods', label: 'Certain foods', emoji: '🍫' },
      { id: 'products', label: 'New products', emoji: '🧴' },
      { id: 'weather', label: 'Weather changes', emoji: '🌦' },
      { id: 'not-sure', label: 'Not sure yet', emoji: '🤔' },
    ],
  },
  {
    id: 'routine-level',
    section: 'Current Routine',
    type: 'single',
    question: 'Which best describes your routine right now?',
    options: [
      { id: 'water-and-go', label: 'Water and go 💧', emoji: '💧', feedback: "Simple is great — we'll build from here." },
      { id: 'basics', label: 'Cleanser and moisturizer, the basics', emoji: '🧼', feedback: "Solid foundation. Let's build on it." },
      { id: 'into-it', label: "3–5 steps, I'm into it", emoji: '🧴', feedback: 'Love the dedication already!' },
      { id: 'ritual', label: "Full 10-step ritual, I'm a pro", emoji: '💅', feedback: "A true pro — we'll keep you inspired." },
    ],
  },
  {
    id: 'face-yoga',
    section: 'Current Routine',
    type: 'single',
    question: 'Have you tried facial exercises or face yoga before?',
    options: [
      { id: 'never', label: 'Never, totally new', emoji: '🌱', feedback: "No worries, we'll ease you in." },
      { id: 'tried-few', label: 'Tried a few times', emoji: '🙂', feedback: 'Good start — consistency is next.' },
      { id: 'sometimes', label: 'I do them sometimes', emoji: '😊', feedback: "Nice — let's make it a habit." },
      { id: 'daily', label: 'Part of my daily routine', emoji: '💪', feedback: 'Impressive dedication! 💪' },
    ],
  },
  {
    id: 'sleep-hours',
    section: 'Lifestyle',
    type: 'slider',
    question: 'How many hours do you usually sleep?',
    labels: ['under 5', '5', '6', '7', '8', '9+'],
    defaultIndex: 3,
  },
  {
    id: 'water-intake',
    section: 'Lifestyle',
    type: 'single',
    question: 'How much water do you drink on a typical day?',
    options: [
      { id: '1-2', label: '1–2 glasses', emoji: '🥛', feedback: "Every glass helps — let's build the habit." },
      { id: '3-5', label: '3–5 glasses', emoji: '💧', feedback: 'Good hydration base!' },
      { id: '6-8', label: '6–8 glasses', emoji: '🚰', feedback: "That's the sweet spot 💧" },
      { id: '8-plus', label: '8+ glasses', emoji: '🌊', feedback: 'Hydration champion!' },
    ],
  },
  {
    id: 'sun-exposure',
    section: 'Lifestyle',
    type: 'single',
    question: 'How often are you in direct sun?',
    options: [
      { id: 'rarely', label: 'Rarely', emoji: '🌥', feedback: 'Good to know for your SPF plan.' },
      { id: 'few-times-week', label: 'A few times a week', emoji: '⛅', feedback: "We'll factor that into your routine." },
      { id: 'daily', label: 'Daily', emoji: '☀️', feedback: 'Sun protection will be a priority.' },
    ],
  },
  {
    id: 'stress-level',
    section: 'Lifestyle',
    type: 'emoji-scale',
    question: 'How would you rate your stress lately?',
    options: [
      { id: 'calm', label: 'Calm', emoji: '😌', feedback: 'Nice and steady — great for your skin.' },
      { id: 'good', label: 'Good', emoji: '🙂', feedback: 'Good balance overall.' },
      { id: 'neutral', label: 'Neutral', emoji: '😐', feedback: "We'll keep an eye on this." },
      { id: 'stressed', label: 'Stressed', emoji: '😣', feedback: "We'll suggest some calming rituals." },
      { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😫', feedback: "Let's build in some gentle self-care." },
    ],
  },
  {
    id: 'time-commitment',
    section: 'Commitment',
    type: 'single',
    question: 'How much time can you give your face each day?',
    options: [
      { id: '2min', label: '2 minutes, quick wins only', emoji: '⏱', feedback: 'Quick wins — perfect for busy days.' },
      { id: '5min', label: '5 minutes', emoji: '🕐', feedback: 'A solid daily ritual.' },
      { id: '10min', label: '10 minutes', emoji: '🕙', feedback: 'Real results take real focus. Love it.' },
      { id: '15plus', label: "15+ minutes, I'm committed", emoji: '🔥', feedback: "Committed! Your glow-up starts strong." },
    ],
  },
  {
    id: 'reminder-time',
    section: 'Commitment',
    type: 'multi',
    question: 'When should Mago remind you?',
    exclusiveOptionId: 'no-reminders',
    options: [
      { id: 'morning', label: 'Morning', emoji: '☀️' },
      { id: 'midday', label: 'Midday', emoji: '🌤' },
      { id: 'evening', label: 'Evening', emoji: '🌙' },
      { id: 'no-reminders', label: 'No reminders', emoji: '🔕' },
    ],
  },
  {
    id: 'motivation-style',
    section: 'Commitment',
    type: 'single',
    question: 'How do you like to stay motivated?',
    options: [
      { id: 'progress-photos', label: 'Seeing progress photos side by side', emoji: '📸', feedback: 'Visual proof — we love that.' },
      { id: 'streaks', label: 'Streaks and daily challenges', emoji: '🔥', feedback: "Let's keep that streak alive!" },
      { id: 'tips-explanations', label: 'Tips and explanations of why it works', emoji: '💡', feedback: 'Knowledge is glow power.' },
      { id: 'share-friends', label: 'Sharing results with friends', emoji: '💬', feedback: 'Sharing the glow — so fun!' },
    ],
  },
];

export const UPGRADE_TO_LOOK: Record<string, LookId> = {
  'glow-tone': 'natural-glam',
  jawline: 'full-glam',
  'fine-lines': 'soft-girl',
  'clear-skin': 'latina-bestie',
  puffiness: 'sweet-spicy',
  'all-above': 'choose-for-me',
};

export type JourneyAnswers = Record<string, string | string[] | number>;

export const getTopGoalLabel = (answers: JourneyAnswers): string => {
  const goalStep = JOURNEY_STEPS.find((s) => s.id === 'goal-upgrade') as SingleSelectStep;
  const answerId = answers['goal-upgrade'];
  const option = goalStep.options.find((o) => o.id === answerId);
  return option?.label ?? 'your glow up';
};

export const getRecommendedLookId = (answers: JourneyAnswers): LookId => {
  const answerId = answers['goal-upgrade'];
  return (typeof answerId === 'string' && UPGRADE_TO_LOOK[answerId]) || 'choose-for-me';
};
