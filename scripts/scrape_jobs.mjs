import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCES_PATH = path.join(__dirname, '../app/sources.json');
const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf8'));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set. Aborting.');
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

async function normalizeText($, sel) {
  const el = $(sel).first();
  if (!el || !el.length) return null;
  return el.text().trim().replace(/\s+/g, ' ');
}

function extractKeywords(text, keywords) {
  if (!text) return false;
  const normalized = text.toLowerCase();
  return keywords.some((k) => normalized.includes(k));
}

async function parseJobFromHtml(url, html) {
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    (await normalizeText($, 'h1')) ||
    null;

  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    (await normalizeText($, 'main')) ||
    null;

  let posted = null;
  const timeEl = $('time').first();
  if (timeEl && timeEl.attr('datetime')) posted = timeEl.attr('datetime');
  else if (timeEl && timeEl.text()) posted = timeEl.text().trim();

  const bodyText = $('body').text();
  const job_type = extractKeywords(bodyText, ['full-time', 'full time', 'part-time', 'part time', 'contract', 'intern'])
    ? 'listed'
    : null;
  const remote = extractKeywords(bodyText, ['remote', 'work from home']);

  return {
    title,
    description,
    posted_date: posted,
    apply_link: url,
    job_type,
    remote,
    raw: html.slice(0, 100000),
  };
}

async function upsertJob(job) {
  const insertQuery = `
    INSERT INTO jobs (apply_link, title, company, location, posted_date, description, job_type, remote, raw_html)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (apply_link) DO UPDATE SET
      title = EXCLUDED.title,
      company = EXCLUDED.company,
      location = EXCLUDED.location,
      posted_date = EXCLUDED.posted_date,
      description = EXCLUDED.description,
      job_type = EXCLUDED.job_type,
      remote = EXCLUDED.remote,
      raw_html = EXCLUDED.raw_html,
      updated_at = now()
    RETURNING id;
  `;
  const values = [
    job.apply_link,
    job.title,
    job.company,
    job.location,
    job.posted_date,
    job.description,
    job.job_type,
    job.remote,
    job.raw,
  ];
  const res = await client.query(insertQuery, values);
  return res.rows[0];
}

async function run() {
  try {
    await client.connect();
    const targets = getTargetsFromArgs(sources);
    for (const src of targets) {
      console.log(new Date().toISOString(), 'Fetching', src.url);
      try {
        const res = await fetchWithRetries(src.url, 3);
        const job = await parseJobFromHtml(src.url, res.data);
        job.company = src.company || new URL(src.url).hostname;
        job.location = src.location || null;

        const inserted = await upsertJob(job);
        console.log(new Date().toISOString(), 'Upserted job id', inserted?.id);
      } catch (err) {
        console.error(new Date().toISOString(), 'Error fetching', src.url, err?.message || err);
      }
    }
  } catch (err) {
    console.error('Fatal', err?.stack || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().then(() => {
    // exit with the set exit code (0 by default)
    process.exit(process.exitCode || 0);
  }).catch((err) => {
    console.error('Unhandled error', err?.stack || err);
    process.exit(1);
  });
}

// --- Helper utilities ---
function getTargetsFromArgs(allSources) {
  // support: --url=<url> or --index=<n>
  const urlArg = process.argv.find(a => a.startsWith('--url='));
  const idxArg = process.argv.find(a => a.startsWith('--index='));
  if (urlArg) {
    const targetUrl = urlArg.split('=')[1];
    const found = allSources.find(s => s.url === targetUrl);
    return found ? [found] : [{ url: targetUrl }];
  }
  if (idxArg) {
    const ix = Number(idxArg.split('=')[1]);
    if (!Number.isNaN(ix) && ix >= 0 && ix < allSources.length) return [allSources[ix]];
  }
  return allSources;
}

async function fetchWithRetries(url, attempts = 3) {
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await axios.get(url, {
        timeout: 20000,
        headers: { 'User-Agent': `govtjobs-scraper/1.0 (+retry:${i})` },
      });
    } catch (err) {
      lastErr = err;
      const wait = Math.min(2000 * (i + 1), 10000);
      console.warn(new Date().toISOString(), `Fetch attempt ${i + 1} failed for ${url}: ${err?.message}. Retrying in ${wait}ms`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
