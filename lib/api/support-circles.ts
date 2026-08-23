import { INITIAL_CIRCLES, INITIAL_POSTS, SupportCircle, CirclePost } from '../data/support-circles';
import { pause } from './mock-latency';

let circlesStore = [...INITIAL_CIRCLES];
let postsStore: Record<string, CirclePost[]> = { ...INITIAL_POSTS };

export async function getSupportCircles(): Promise<SupportCircle[]> {
  await pause();
  return [...circlesStore];
}

export async function getSupportCircleById(id: string): Promise<SupportCircle | undefined> {
  await pause();
  return circlesStore.find((c) => c.id === id);
}

export async function toggleCircleJoin(id: string): Promise<SupportCircle> {
  await pause();
  const idx = circlesStore.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new Error(`Circle with id ${id} not found`);
  }
  const current = circlesStore[idx];
  const isJoined = !current.isJoined;
  const memberCount = isJoined ? current.memberCount + 1 : current.memberCount - 1;
  const updated: SupportCircle = {
    ...current,
    isJoined,
    memberCount,
  };
  circlesStore[idx] = updated;
  return { ...updated };
}

export async function getCirclePosts(circleId: string): Promise<CirclePost[]> {
  await pause();
  return [...(postsStore[circleId] || [])];
}

export async function addCirclePost(
  circleId: string,
  content: string
): Promise<CirclePost> {
  await pause();
  const contentLower = content.toLowerCase();
  let moderationStatus: 'published' | 'human_review' | 'safety_workflow' = 'published';

  if (contentLower.includes('hurt') || contentLower.includes('harm') || contentLower.includes('emergency')) {
    moderationStatus = 'safety_workflow';
  } else if (contentLower.includes('hopeless') || contentLower.includes('fail') || contentLower.includes('severe')) {
    moderationStatus = 'human_review';
  }

  const newPost: CirclePost = {
    id: Date.now().toString(),
    circleId,
    author: 'You (Anonymous)',
    content: content.trim(),
    timestamp: 'Just now',
    moderationStatus,
    isCurrentUser: true,
  };

  const existing = postsStore[circleId] || [];
  postsStore[circleId] = [newPost, ...existing];

  return { ...newPost };
}
