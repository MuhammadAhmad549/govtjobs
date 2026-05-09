// Simple scraper for company career pages (stored inside app/ for repo constraints)
// Usage: set DATABASE_URL in environment or .env, list target URLs in app/sources.json

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { Client } = require('pg');
require('dotenv').config();

const SOURCES_PATH = path.join(__dirname, 'sources.json');
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
  text = text.toLowerCase();
  return keywords.some(k => text.includes(k));
}

async function parseJobFromHtml(url, html) {
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || $('h1').first().text().trim();
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('main').text().trim().slice(0, 2000);

  // posted date heuristics
  let posted = null;
  const timeEl = $('time').first();
  if (timeEl && timeEl.attr('datetime')) posted = timeEl.attr('datetime');
  else if (timeEl && timeEl.text()) posted = timeEl.text().trim();

  const bodyText = $('body').text();
  const job_type = extractKeywords(bodyText, ['full-time', 'full time', 'part-time', 'part time', 'contract', 'intern']) ? 'listed' : null;
  const remote = extractKeywords(bodyText, ['remote', 'work from home']);

  return {
    title: title || null,
    description: description || null,
    posted_date: posted,
    apply_link: url,
    job_type: job_type,
    remote: remote,
    raw: html.slice(0, 100000) // store truncated raw for debugging
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
  const values = [job.apply_link, job.title, job.company, job.location, job.posted_date, job.description, job.job_type, job.remote, job.raw];
  const res = await client.query(insertQuery, values);
  return res.rows[0];
}

async function run() {
  try {
    await client.connect();
    for (const src of sources) {
      console.log('Fetching', src.url);
      try {
        const res = await axios.get(src.url, { timeout: 20000, headers: { 'User-Agent': 'govtjobs-scraper/1.0' } });
        const job = await parseJobFromHtml(src.url, res.data);
        job.company = src.company || (new URL(src.url)).hostname;
        job.location = src.location || null;

        const inserted = await upsertJob(job);
        console.log('Upserted job id', inserted.id);
      } catch (err) {
        console.error('Error fetching', src.url, err.message);
      }
    }
  } catch (err) {
    console.error('Fatal', err);
  } finally {
    await client.end();
  }
}

if (require.main === module) run();
