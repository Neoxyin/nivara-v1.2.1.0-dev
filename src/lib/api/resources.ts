import { mockResources } from '../data/resources';
import { pause } from './mock-latency';
import type { Resource } from '../types';


export async function getResources(): Promise<Resource[]> {
  await pause();
  return [...mockResources];
}