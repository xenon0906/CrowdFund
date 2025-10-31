// Performance optimization utilities for global scalability

/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImages() {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  const criticalResources = [
    '/_next/static/css/app.css',
    '/_next/static/chunks/main.js',
    '/_next/static/chunks/pages/_app.js',
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  });
}

/**
 * Connection pool for RPC requests
 */
class RPCConnectionPool {
  private connections: string[] = [];
  private currentIndex = 0;

  constructor(urls: string[]) {
    this.connections = urls;
  }

  getConnection(): string {
    const connection = this.connections[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.connections.length;
    return connection;
  }

  addConnection(url: string): void {
    if (!this.connections.includes(url)) {
      this.connections.push(url);
    }
  }

  removeConnection(url: string): void {
    this.connections = this.connections.filter((c) => c !== url);
    if (this.currentIndex >= this.connections.length) {
      this.currentIndex = 0;
    }
  }
}

// Initialize connection pool with multiple RPC endpoints for redundancy
export const rpcPool = new RPCConnectionPool([
  process.env.NEXT_PUBLIC_RPC_URL || '',
  'https://ethereum-sepolia.publicnode.com',
  'https://rpc.sepolia.org',
]);

/**
 * Request deduplication to prevent duplicate API calls
 */
const pendingRequests = new Map<string, Promise<any>>();

export async function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = requestFn()
    .then((result) => {
      pendingRequests.delete(key);
      return result;
    })
    .catch((error) => {
      pendingRequests.delete(key);
      throw error;
    });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Batch API requests for better performance
 */
export class RequestBatcher<T, R> {
  private batch: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private delay: number;
  private processFn: (items: T[]) => Promise<R[]>;

  constructor(
    batchSize: number,
    delay: number,
    processFn: (items: T[]) => Promise<R[]>
  ) {
    this.batchSize = batchSize;
    this.delay = delay;
    this.processFn = processFn;
  }

  add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push(item);

      if (this.batch.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.delay);
      }
    });
  }

  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const items = [...this.batch];
    this.batch = [];

    if (items.length > 0) {
      await this.processFn(items);
    }
  }
}

/**
 * Memory cache with TTL
 */
export class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();

  set(key: string, value: T, ttl: number = 60000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const globalCache = new MemoryCache();

// Cleanup cache periodically
if (typeof window !== 'undefined') {
  setInterval(() => globalCache.cleanup(), 60000); // Cleanup every minute
}