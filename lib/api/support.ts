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
  
  if (lowerMessage.includes('plan')) {
    response = 'Let\'s make it smaller. What has a real deadline first, and what can be a rough draft for now?';
  } else if (lowerMessage.includes('stress') || lowerMessage.includes('stretched')) {
    response = 'That sounds like a lot to hold at once. We can take one practical next step, or I can help you find a person at your institution.';
  } else if (lowerMessage.includes('person') || lowerMessage.includes('talk')) {
    response = 'I can help you find the right person. Would you like to see available counsellors, or are you looking for a different type of support?';
  }
  
  return { response };
}