import { NextApiRequest, NextApiResponse } from 'next';

// In-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

export async function getCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < duration) {
    return cached.data as T;
  }

  const data = await fetchFunction();
  cache.set(key, { data, timestamp: now });

  // Clean up old cache entries
  if (cache.size > 100) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    cache.delete(entries[0][0]);
  }

  return data;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set cache headers for API responses
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

  res.status(200).json({
    message: 'Cache API endpoint',
    cacheSize: cache.size,
    timestamp: new Date().toISOString()
  });
}