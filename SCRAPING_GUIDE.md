# Government Jobs Pakistan - Web Scraping Gateway

## ✨ Architecture Overview

This system automatically fetches and caches jobs from official government websites. Jobs refresh every 30 minutes or can be manually triggered.

### 📁 File Structure

```
app/
├── lib/
│   ├── cache.ts                    # In-memory cache with TTL
│   └── scrapers/
│       ├── fia-scraper.ts          # FIA website scraper
│       └── fpsc-scraper.ts         # FPSC website scraper
├── api/
│   └── jobs/
│       └── route.ts                # Main API endpoint
└── page.tsx                        # Frontend (fetches from API)
```

## 🔧 How It Works

### 1. **Scraping Process**
- Each scraper analyzes the official website HTML structure
- Extracts job titles, descriptions, deadlines, and apply links
- Parses information into standardized Job interface
- Returns array of jobs with source metadata

### 2. **Caching System**
- **TTL**: 6 hours (configurable)
- Stores scraped jobs in memory
- Separate cache keys for each department
- Auto-clears expired entries

### 3. **Auto-Refresh**
- Frontend refreshes jobs every 30 minutes
- Can be manually triggered via "Refresh Jobs" button
- POST `/api/jobs` with `action: 'refresh'`

### 4. **Fallback Mechanism**
- If scraping fails, uses demo data
- User still sees jobs even if websites are down
- All demo jobs marked as `isAuthentic: false`

## 🚀 API Endpoints

### GET `/api/jobs`
Fetch jobs with optional filtering and caching

**Query Parameters:**
- `source` - Filter by source: 'fia', 'fpsc', 'all' (default: 'all')
- `refresh` - Force bypass cache: true/false (default: false)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "source": "cache|live",
  "count": 10,
  "timestamp": "2026-05-06T10:30:00Z",
  "cacheInfo": {
    "keys": ["jobs_all", "jobs_fia"],
    "size": 2
  }
}
```

### POST `/api/jobs`
Manually trigger actions

**Request Body:**
```json
{
  "action": "refresh" // or "cache-status"
}
```

## 📊 Job Interface

```typescript
interface Job {
  id: number
  title: string
  department: string
  location: string
  salary: string
  deadline: string
  type: string
  experience: string
  description: string
  source: 'FPSC' | 'PUNJAB' | 'PPSC' | 'FBR' | 'FIA'
  sourceWebsite: string
  applyUrl: string              // Direct link to apply
  sourceColor: string
  isAuthentic: boolean
}
```

## 🌐 Supported Sources

| Source | Website | Status |
|--------|---------|--------|
| FIA | https://fia.gov.pk/careers | ✅ Scraping |
| FPSC | https://www.fpsc.gov.pk | ✅ Scraping |
| PUNJAB | https://jobs.punjab.gov.pk/new_recruit/jobs | 📌 Demo |
| PPSC | https://www.ppsc.gop.pk | 📌 Demo |
| FBR | https://www.fbr.gov.pk | 📌 Demo |

## 🔌 Integration Points

### Frontend Usage
```typescript
// Automatic on page load
useEffect(() => {
  fetchJobs() // Fetches from /api/jobs
}, [])

// Manual refresh
handleManualRefresh() // POST to /api/jobs with refresh action
```

### Manual API Calls
```bash
# Fetch all jobs
curl http://localhost:3000/api/jobs

# Fetch only FIA jobs
curl http://localhost:3000/api/jobs?source=fia

# Force refresh and bypass cache
curl http://localhost:3000/api/jobs?refresh=true

# Trigger refresh
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"action":"refresh"}'
```

## 📝 Adding New Sources

1. **Create scraper file** - `app/lib/scrapers/[source]-scraper.ts`
   ```typescript
   export async function scrape[SOURCE]Jobs(): Promise<ParsedJob[]> {
     // Fetch HTML
     // Parse with cheerio
     // Return Job array
   }
   ```

2. **Import in API route** - `app/api/jobs/route.ts`
   ```typescript
   import { scrape[SOURCE]Jobs } from '@/app/lib/scrapers/[source]-scraper'
   ```

3. **Add to scraping logic**
   ```typescript
   if (!source || source === 'all' || source === '[source]') {
     const sourceJobs = await scrape[SOURCE]Jobs()
     allJobs = [...allJobs, ...sourceJobs]
   }
   ```

## ⚙️ Configuration

### Cache TTL (Time To Live)
Edit `app/lib/cache.ts`:
```typescript
private ttl: number = 6 * 60 * 60 * 1000 // Change this value
```

### Auto-Refresh Interval
Edit `app/page.tsx`:
```typescript
// Set up auto-refresh every X minutes
const interval = setInterval(fetchJobs, 30 * 60 * 1000) // Change 30
```

### Scraper Timeout
Edit individual scrapers:
```typescript
const { data } = await axios.get(url, {
  timeout: 15000 // milliseconds
})
```

## 🐛 Debugging

### Check Cache Status
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"action":"cache-status"}'
```

### Monitor Scraping
Check browser console and server logs for scraping progress

### Console Logs
- `FIA: Found X jobs`
- `FPSC Scraper: Found X items`
- `API Error: ...`

## 🔒 Security Considerations

1. **Rate Limiting** - Add to prevent overwhelming government servers
2. **User-Agent** - Already set to mimic browser
3. **Error Handling** - Gracefully falls back to demo data
4. **Timeout** - Set to 15 seconds per request
5. **Cache** - Prevents hammering servers frequently

## 📈 Scalability

Current system can handle:
- Multiple sources simultaneously
- 10+ jobs per source
- Auto-refresh every 30 minutes
- Fallback to demo data

### To scale further:
1. Move to database (PostgreSQL/MongoDB)
2. Add message queue (Bull, RabbitMQ)
3. Deploy scrapers to separate service
4. Add rate limiting
5. Implement proper error logging

## 🚀 Future Enhancements

- [ ] Database persistence
- [ ] Better HTML parsing (Puppeteer for JavaScript sites)
- [ ] Email notifications for new jobs
- [ ] Job filtering and favorites
- [ ] User applications tracking
- [ ] Admin dashboard with stats
- [ ] Multiple scraper workers
- [ ] SMS alerts

---

**Last Updated:** May 6, 2026  
**System Status:** ✅ Active and Scraping
