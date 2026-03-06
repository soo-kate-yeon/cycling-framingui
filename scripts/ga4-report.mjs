#!/usr/bin/env node
/**
 * GA4 Report Script
 * 
 * Usage: node scripts/ga4-report.mjs
 * 
 * Requires:
 * - GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON
 * - Or place the JSON at ./tekton-mkt-487515-*.json
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// GA4 Property ID
const PROPERTY_ID = '526862691';

// Find credentials file
function findCredentials() {
  // Check env var first
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  
  // Look for tekton-mkt-*.json in project root
  const files = readdirSync(projectRoot);
  const credFile = files.find(f => f.startsWith('tekton-mkt-') && f.endsWith('.json'));
  if (credFile) {
    return join(projectRoot, credFile);
  }
  
  throw new Error('No credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or place tekton-mkt-*.json in project root');
}

async function getGA4Report() {
  const credPath = findCredentials();
  console.log(`Using credentials: ${credPath}\n`);
  
  // Set env var for the client
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
  
  const client = new BetaAnalyticsDataClient();
  
  // Today's date range
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  
  console.log('📊 GA4 Report for FramingUI');
  console.log('=' .repeat(50));
  
  // 1. Basic Metrics (Last 24h)
  console.log('\n🔥 Last 24 Hours:');
  const [dailyResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: yesterday, endDate: today }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
  });
  
  if (dailyResponse.rows?.[0]) {
    const row = dailyResponse.rows[0];
    console.log(`  • Active Users: ${row.metricValues[0].value}`);
    console.log(`  • Sessions: ${row.metricValues[1].value}`);
    console.log(`  • Page Views: ${row.metricValues[2].value}`);
    console.log(`  • Avg Session Duration: ${Math.round(parseFloat(row.metricValues[3].value))}s`);
    console.log(`  • Bounce Rate: ${(parseFloat(row.metricValues[4].value) * 100).toFixed(1)}%`);
  } else {
    console.log('  (No data yet)');
  }
  
  // 2. Weekly Metrics
  console.log('\n📈 Last 7 Days:');
  const [weeklyResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: weekAgo, endDate: today }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
    ],
  });
  
  if (weeklyResponse.rows?.[0]) {
    const row = weeklyResponse.rows[0];
    console.log(`  • Active Users: ${row.metricValues[0].value}`);
    console.log(`  • Sessions: ${row.metricValues[1].value}`);
    console.log(`  • Page Views: ${row.metricValues[2].value}`);
  }
  
  // 3. Traffic Sources (Last 7 days)
  console.log('\n🌐 Traffic Sources (7 days):');
  const [sourceResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: weekAgo, endDate: today }],
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });
  
  if (sourceResponse.rows?.length) {
    sourceResponse.rows.forEach(row => {
      const source = row.dimensionValues[0].value;
      const sessions = row.metricValues[0].value;
      console.log(`  • ${source}: ${sessions} sessions`);
    });
  } else {
    console.log('  (No data yet)');
  }
  
  // 4. Top Pages (Last 7 days)
  console.log('\n📄 Top Pages (7 days):');
  const [pageResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: weekAgo, endDate: today }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });
  
  if (pageResponse.rows?.length) {
    pageResponse.rows.forEach(row => {
      const path = row.dimensionValues[0].value;
      const views = row.metricValues[0].value;
      console.log(`  • ${path}: ${views} views`);
    });
  } else {
    console.log('  (No data yet)');
  }
  
  // 5. Country breakdown
  console.log('\n🌍 Top Countries (7 days):');
  const [countryResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: weekAgo, endDate: today }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 5,
  });
  
  if (countryResponse.rows?.length) {
    countryResponse.rows.forEach(row => {
      const country = row.dimensionValues[0].value;
      const users = row.metricValues[0].value;
      console.log(`  • ${country}: ${users} users`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Report generated at:', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
  
  return {
    daily: dailyResponse.rows?.[0],
    weekly: weeklyResponse.rows?.[0],
    sources: sourceResponse.rows,
    pages: pageResponse.rows,
    countries: countryResponse.rows,
  };
}

// Run
getGA4Report().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
