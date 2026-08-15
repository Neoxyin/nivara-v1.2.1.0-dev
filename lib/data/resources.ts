import type { Resource } from '../types';

export const mockResources: Resource[] = [
  { 
    title: 'When everything feels urgent', 
    category: 'Study habits', 
    readTime: '4 min read', 
    description: 'A small framework for separating today\'s true priorities from the noise around them.', 
    featured: true 
  },
  { 
    title: 'A kinder way to plan a heavy week', 
    category: 'Well-being', 
    readTime: '6 min read', 
    description: 'Plan with energy in mind, not just available hours.', 
    featured: true 
  },
  { 
    title: 'Ask for an extension early', 
    category: 'Academic support', 
    readTime: '3 min read', 
    description: 'What to say, who to contact, and how to make a clear request.', 
    featured: false 
  },
  { 
    title: 'Reset your study environment', 
    category: 'Focus', 
    readTime: '5 min read', 
    description: 'A practical reset for when your desk starts to feel like a wall.', 
    featured: false 
  },
  { 
    title: 'Understanding your attendance pattern', 
    category: 'Academic support', 
    readTime: '7 min read', 
    description: 'Look for useful patterns without turning attendance into a judgement.', 
    featured: false 
  },
  { 
    title: 'Find your quietest campus spaces', 
    category: 'Campus life', 
    readTime: '2 min read', 
    description: 'A map of low-traffic corners for focused work and decompression.', 
    featured: false 
  },
];