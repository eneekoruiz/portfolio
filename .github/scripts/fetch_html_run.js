const https = require('https');
const url = process.argv[2];
if (!url) { console.error('usage: node fetch_html_run.js <url>'); process.exit(1); }
https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    console.log(data.slice(0, 5000));
  });
}).on('error', e => console.error('request-error', e.message));
