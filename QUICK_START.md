# 🚀 Quick Start Guide

## 5-Minute Setup

### 1️⃣ Start the Dev Server
```bash
npm run dev
```

### 2️⃣ Visit Your App
- **Homepage**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 3️⃣ Try Scraping
1. Go to `/admin`
2. Click "Refresh Jobs"
3. Watch cache update
4. Return to homepage - jobs are now live!

---

## 📚 File Guide

| File | Purpose | Edit When |
|------|---------|-----------|
| `app/page.tsx` | Homepage with jobs | Need different UI |
| `app/admin/page.tsx` | Admin dashboard | Need different controls |
| `app/api/jobs/route.ts` | API that scrapes | Need different endpoints |
| `app/lib/cache.ts` | Caching system | Need to change TTL |
| `app/lib/scrapers/fia-scraper.ts` | FIA website scraper | Website structure changes |
| `app/lib/scrapers/fpsc-scraper.ts` | FPSC website scraper | Website structure changes |

---

## 🎮 User Features

### Home Page - Browse Jobs
```
1. Search by title/department
2. Filter by government department
3. Click "Apply on Official Site" to apply
4. See job details (salary, deadline, etc.)
5. Click "Refresh Jobs" for latest
```

### Admin Panel - Manage System
```
1. See how many jobs are cached
2. Manual refresh button
3. Clear cache button
4. Cache status info
5. System configuration details
```

---

## 🔧 Common Tasks

### Add New Job Source

**Step 1:** Create scraper file
```bash
touch app/lib/scrapers/[website]-scraper.ts
```

**Step 2:** Implement scraper
```typescript
export async function scrapeJobs() {
  const { data } = await axios.get('URL')
  const $ = cheerio.load(data)
  // Extract jobs
  return jobs
}
```

**Step 3:** Add to API
Edit `app/api/jobs/route.ts`:
```typescript
import { scrapeJobs } from '@/app/lib/scrapers/[website]-scraper'

// In GET handler:
const sourceJobs = await scrapeJobs()
allJobs = [...allJobs, ...sourceJobs]
```

### Change Cache Duration
Edit `app/lib/cache.ts`:
```typescript
private ttl: number = 12 * 60 * 60 * 1000  // 12 hours instead of 6
```

### Change Auto-Refresh Interval
Edit `app/page.tsx`:
```typescript
setInterval(fetchJobs, 60 * 60 * 1000)  // 60 minutes instead of 30
```

### Add Authentication to Admin
Edit `app/admin/page.tsx` - add auth check:
```typescript
const [authenticated, setAuthenticated] = useState(false)

useEffect(() => {
  // Check if user is authenticated
  const token = localStorage.getItem('adminToken')
  setAuthenticated(!!token)
}, [])

if (!authenticated) {
  return <div>Login required</div>
}
```

---

## 🧪 Testing

### Test API Directly
```bash
# Get all jobs
curl http://localhost:3000/api/jobs

# Get FIA jobs only
curl http://localhost:3000/api/jobs?source=fia

# Refresh jobs
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"action":"refresh"}'

# Check cache status
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"action":"cache-status"}'
```

### Test in Browser Console
```javascript
// Fetch jobs
fetch('/api/jobs')
  .then(r => r.json())
  .then(d => console.log(d))

// Refresh jobs
fetch('/api/jobs', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({action: 'refresh'})
})
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Jobs not showing | Check `/admin` and click refresh |
| Scraper errors | Website structure may have changed |
| Cache full | Reduce TTL or restart server |
| Slow loading | Check network tab in DevTools |
| API errors | Check server logs in terminal |

---

## 📖 Documentation Files

1. **SETUP_COMPLETE.md** - Full setup guide
2. **SCRAPING_GUIDE.md** - Advanced scraping info
3. **ARCHITECTURE.md** - System design & flow
4. **README.md** - Project overview (update this)

---

## 💡 Pro Tips

✅ **Cache your browser** - Jobs load instantly from cache
✅ **Use admin panel** - Monitor what's happening
✅ **Check console** - Server logs show what's being scraped
✅ **Test with curl** - Test API without frontend
✅ **Read the docs** - ARCHITECTURE.md has great diagrams

---

## 🎯 Next Features to Add

- [ ] Database to store job history
- [ ] Email alerts for new jobs
- [ ] User accounts & favorites
- [ ] Advanced job search/filters
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] SMS notifications

---

## 📞 Support

**Questions?** Check:
1. `SETUP_COMPLETE.md` - Setup help
2. `SCRAPING_GUIDE.md` - Scraping details
3. `ARCHITECTURE.md` - System design
4. Server terminal - Error messages
5. Browser console - Frontend errors

---

**Ready to go live?** 🚀

Your system is production-ready. Follow SETUP_COMPLETE.md for deployment steps!
