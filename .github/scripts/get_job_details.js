const https = require('https');
const jobId = process.argv[2];
if (!jobId) { console.error('usage: node get_job_details.js <jobId>'); process.exit(1); }
const url = `https://api.github.com/repos/eneekoruiz/portfolio/actions/jobs/${jobId}`;
https.get(url, { headers: { 'User-Agent': 'node' } }, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      // print useful fields
      const out = {
        id: j.id,
        status: j.status,
        conclusion: j.conclusion,
        html_url: j.html_url,
        logs_url: j.logs_url,
        steps: j.steps && j.steps.map(s => ({name: s.name, status: s.status, conclusion: s.conclusion, number: s.number, started_at: s.started_at, completed_at: s.completed_at}))
      };
      console.log(JSON.stringify(out, null, 2));
    } catch (e) { console.error('parse-error', e.message); }
  });
}).on('error', e => console.error('request-error', e.message));
