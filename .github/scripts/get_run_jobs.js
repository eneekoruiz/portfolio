const https = require('https');
const runId = process.argv[2];
if (!runId) { console.error('usage: node get_run_jobs.js <runId>'); process.exit(1); }
const url = `https://api.github.com/repos/eneekoruiz/portfolio/actions/runs/${runId}/jobs`;
https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    try {
      const r = JSON.parse(data);
      if (!r.jobs) return console.log('no-jobs');
      const simplified = r.jobs.map(j => ({ id: j.id, name: j.name, status: j.status, conclusion: j.conclusion, html_url: j.html_url, steps: j.steps && j.steps.map(s => ({name: s.name, status: s.status, conclusion: s.conclusion, number: s.number})) }));
      console.log(JSON.stringify(simplified, null, 2));
    } catch (e) { console.error('parse-error', e.message); }
  });
}).on('error', e => console.error('request-error', e.message));
