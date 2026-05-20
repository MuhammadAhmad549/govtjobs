import fs from 'node:fs'
import path from 'node:path'
import { Redis } from '@upstash/redis'

interface CacheEntry {
  data: unknown
  timestamp: number
}

class JobCache {
  private cache: Map<string, CacheEntry> = new Map()
  private ttl: number = 6 * 60 * 60 * 1000 // 6 hours in milliseconds
  private cacheFile = path.join(process.cwd(), '.next', 'job-cache.json')
  private redisClient: Redis | null = null
  private readonly useRedis: boolean

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    this.useRedis = Boolean(url && token)

    if (this.useRedis) {
      try {
        this.redisClient = new Redis({ url: url!, token: token! })
      } catch (e) {
        // Fallback to in-memory when Redis client can't be created
        this.redisClient = null
      }
    }

    // Load disk cache only when not running on Vercel (local dev or server)
    if (!this.useRedis) {
      this.loadFromDisk()
    }
  }

  private loadFromDisk(): void {
    try {
      if (!fs.existsSync(this.cacheFile)) return
      const raw = fs.readFileSync(this.cacheFile, 'utf-8')
      const parsed = JSON.parse(raw) as Record<string, CacheEntry>
      const now = Date.now()
      Object.entries(parsed).forEach(([key, entry]) => {
        if (now - entry.timestamp <= this.ttl) this.cache.set(key, entry)
      })
    } catch {
      this.cache.clear()
    }
  }

  private persistToDisk(): void {
    try {
      const dir = path.dirname(this.cacheFile)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const serializable = Object.fromEntries(this.cache.entries())
      fs.writeFileSync(this.cacheFile, JSON.stringify(serializable), 'utf-8')
    } catch {
      // ignore
    }
  }

  // Async Redis-aware getter
  async getAsync<T>(key: string): Promise<T | null> {
    if (this.redisClient) {
      try {
        const raw = await this.redisClient.get(key) as string | null
        if (!raw) return null
        return JSON.parse(raw) as T
      } catch (e) {
        return null
      }
    }
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    return entry.data as T
  }

  // Synchronous getter (reads from local in-memory cache only)
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    return entry.data as T
  }

  // Async setter
  async setAsync<T>(key: string, data: T, ttlMs?: number): Promise<void> {
    const timestamp = Date.now()
    this.cache.set(key, { data, timestamp })
    if (this.redisClient) {
      try {
        const ex = Math.max(60, Math.round((ttlMs ?? this.ttl) / 1000))
        await this.redisClient.set(key, JSON.stringify(data), { ex })
      } catch (e) {
        // ignore redis write errors but keep in-memory cache
      }
      return
    }
    this.persistToDisk()
  }

  // Synchronous setter (local only)
  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
    this.persistToDisk()
  }

  async clearAsync(key?: string): Promise<void> {
    if (this.redisClient) {
      try {
        if (key) {
          await this.redisClient.del(key)
        } else {
          // No safe way to list and delete all keys in production; clear local map
        }
      } catch (e) {
        // ignore
      }
    }
    if (key) this.cache.delete(key)
    else this.cache.clear()
    this.persistToDisk()
  }

  clear(key?: string): void {
    if (key) this.cache.delete(key)
    else this.cache.clear()
    this.persistToDisk()
  }

  async getStatsAsync(): Promise<{ keys: string[]; size: number }> {
    if (this.redisClient) {
      // Listing keys in Redis is unsafe in large datasets; return limited info
      return { keys: [], size: -1 }
    }
    return { keys: Array.from(this.cache.keys()), size: this.cache.size }
  }

  getStats(): { keys: string[]; size: number } {
    return { keys: Array.from(this.cache.keys()), size: this.cache.size }
  }
}

export const jobCache = new JobCache()
