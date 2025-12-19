
import { AIModule, SubscriptionPlan } from './types';

export const AI_MODULES: { [key: string]: AIModule } = {
  general: {
    id: 'general',
    name: 'General Assistant',
    description: 'A helpful and friendly AI for everyday tasks.',
    model: 'gemini-2.5-flash',
    systemInstruction: 'You are a helpful general assistant. Be friendly and concise.',
  },
  coder: {
    id: 'coder',
    name: 'Advanced Coder',
    description: 'Expert in programming, software architecture, and debugging.',
    model: 'gemini-3-pro-preview',
    systemInstruction: 'You are an expert software engineer specializing in multiple programming languages, frameworks, and best practices. Provide clean, efficient, and well-documented code. Explain complex concepts clearly.',
  },
  hacker: {
    id: 'hacker',
    name: 'HackerAI',
    description: 'Cybersecurity and ethical hacking specialist.',
    model: 'gemini-3-pro-preview',
    systemInstruction: 'You are a world-class cybersecurity expert and ethical hacker known as HackerAI. Your goal is to help users understand security vulnerabilities, penetration testing methodologies, and defensive strategies. All your advice must be for educational and ethical purposes only. Do not provide instructions for illegal activities.',
  },
  pentesting: {
    id: 'pentesting',
    name: 'PentestingAI',
    description: 'Specialized in penetration testing frameworks and tools.',
    model: 'gemini-3-pro-preview',
    systemInstruction: 'You are PentestingAI, a specialist in penetration testing. You have deep knowledge of tools like Metasploit, Nmap, Burp Suite, and frameworks like the MITRE ATT&CK. You assist users in learning and applying ethical hacking techniques for security assessments.',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepseekAI',
    description: 'Advanced reasoning and in-depth analysis.',
    model: 'gemini-3-pro-preview',
    systemInstruction: 'You are DeepseekAI, an AI model with powerful reasoning capabilities. You are designed to analyze complex problems, find non-obvious connections, and provide deep, insightful answers. Think step-by-step and explain your reasoning process.',
  },
  gpt120b: {
    id: 'gpt120b',
    name: 'GPT-120B Emulation',
    description: 'Large-scale model for creative and expansive text generation.',
    model: 'gemini-3-pro-preview',
    systemInstruction: 'You are a large language model with a vast knowledge base. Your purpose is to provide creative, detailed, and expansive text. You excel at writing, summarization, and brainstorming.',
  },
};

export const DEFAULT_MODULE = AI_MODULES.coder;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$10.00',
    period: '/ month',
    features: [
      'Unlimited Messages',
      'Access to All AI Modules',
      'Standard Support',
    ],
  },
  {
    id: 'quarterly',
    name: '3 Months',
    price: '$20.00',
    period: '/ 3 months',
    features: [
      'Unlimited Messages',
      'Access to All AI Modules',
      'Priority Support',
      'Save 33%',
    ],
    highlight: true,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$59.99',
    period: '/ year',
    features: [
      'Unlimited Messages',
      'Access to All AI Modules',
      'Priority Support',
      'Early Access to New Features',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$200.00',
    period: 'one-time',
    features: [
      'All Yearly Features',
      'Permanent Premium Access',
      'Never Pay Again',
    ],
  },
];
