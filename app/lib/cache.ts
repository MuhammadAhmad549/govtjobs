import fs from 'node:fs'
import path from 'node:path'

interface CacheEntry {
  data: unknown
  timestamp: number
}

class JobCache {
  private cache: Map<string, CacheEntry> = new Map()
  private ttl: number = 6 * 60 * 60 * 1000 // 6 hours in milliseconds
  private cacheFile = path.join(process.cwd(), '.next', 'job-cache.json')

  constructor() {
    this.loadFromDisk()
  }

  private loadFromDisk(): void {
    try {
      if (!fs.existsSync(this.cacheFile)) {
        return
      }

      const raw = fs.readFileSync(this.cacheFile, 'utf-8')
      const parsed = JSON.parse(raw) as Record<string, CacheEntry>
      const now = Date.now()

      Object.entries(parsed).forEach(([key, entry]) => {
        if (now - entry.timestamp <= this.ttl) {
          this.cache.set(key, entry)
        }
      })
    } catch {
      this.cache.clear()
    }
  }

  private persistToDisk(): void {
    try {
      const dir = path.dirname(this.cacheFile)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      const serializable = Object.fromEntries(this.cache.entries())
      fs.writeFileSync(this.cacheFile, JSON.stringify(serializable), 'utf-8')
    } catch {
      // Ignore disk persistence errors and continue with in-memory cache.
    }
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    this.persistToDisk()
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if cache expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  isExpired(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return true
    return Date.now() - entry.timestamp > this.ttl
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
    this.persistToDisk()
  }

  getStats(): { keys: string[]; size: number } {
    return {
      keys: Array.from(this.cache.keys()),
      size: this.cache.size
    }
  }
}

// Export singleton instance
export const jobCache = new JobCache()
