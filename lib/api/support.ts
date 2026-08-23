import { mockRecommendations } from '../data/recommendations';
import { pause } from './mock-latency';
import type { Recommendation } from '../types';


export async function getRecommendations(): Promise<Recommendation[]> {
  await pause();
  return [...mockRecommendations];
}

export async function toggleRecommendation(index: number): Promise<Recommendation> {
  await pause();
  mockRecommendations[index].completed = !mockRecommendations[index].completed;
  return { ...mockRecommendations[index] };
}

export async function sendSupportMessage(message: string): Promise<{ response: string }> {
  await pause();
  // Simple mock response logic
  const lowerMessage = message.toLowerCase();
  let response = 'I\'m here. What would feel most useful right now — making a study plan, clearing some mental space, or finding a person to talk with?';
  
  if (lowerMessage.includes('friday') || lowerMessage.includes('low-priority') || (lowerMessage.includes('move') && lowerMessage.includes('task'))) {
    response = 'Let\'s identify one non-urgent item you can safely move to Friday. Shifting secondary reading or optional revisions gives your attention room to focus on immediate work today. Which task feels safest to park for a couple of days?';
  } else if (lowerMessage.includes('fieldwork') || lowerMessage.includes('notes') || lowerMessage.includes('starting point')) {
    response = 'Starting from what already exists is much lighter than facing a blank screen. Pull 2–3 key observations or quotes from your fieldwork notes into an outline, and use those as anchors for your next section.';
  } else if (lowerMessage.includes('plan')) {
    response = 'Let\'s make it smaller. What has a real deadline first, and what can be a rough draft for now?';
  } else if (lowerMessage.includes('stress') || lowerMessage.includes('stretched')) {
    response = 'That sounds like a lot to hold at once. We can take one practical next step, or I can help you find a person at your institution.';
  } else if (lowerMessage.includes('person') || lowerMessage.includes('talk')) {
    response = 'I can help you find the right person. Would you like to see available counsellors, or are you looking for a different type of support?';
  }
  
  return { response };
}

export type AiSupportMessageInput = {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
};

export type AiSupportMessageResponse = {
  reply: string;
  suggestions?: string[];
};

export type AiSupportMessageInput = {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
};

export type AiSupportMessageResponse = {
  reply: string;
  suggestions?: string[];
};

export async function sendAiSupportMessage(input: AiSupportMessageInput): Promise<AiSupportMessageResponse> {
  const latestMessage = input.messages[input.messages.length - 1]?.content || '';
  await pause(350);
  const fallback = await sendSupportMessage(latestMessage);
  return {
    reply: fallback.response,
    suggestions: [
      'How do I book a counsellor?',
      'Academic pacing tips',
      'Stress management guides',
      'Explore support resources',
    ],
  };
}
