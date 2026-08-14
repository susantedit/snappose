/**
 * Categories API service module.
 * [Req 37]
 */

import { apiGet } from './client';
import type { Category } from '@/features/poses/types';

export async function fetchCategories(): Promise<Category[]> {
  return apiGet<Category[]>('/categories');
}
