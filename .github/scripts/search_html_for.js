const https = require('https');
const url = process.argv[2];
const term = process.argv[3] || 'error';
if (!url) { console.error('usage: node search_html_for.js <url> [term]'); process.exit(1); }
https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const lower = data.toLowerCase();
    const t = term.toLowerCase();
    const idx = lower.indexOf(t);
    if (idx === -1) { console.log('no-match'); return; }
    const start = Math.max(0, idx-200);
    const end = Math.min(data.length, idx+200);
    console.log(data.slice(start, end).replace(/\n/g,' '));
  });
}).on('error', e => console.error('request-error', e.message));
