const https = require('https');
const jobId = process.argv[2];
if (!jobId) { console.error('usage: node get_job_logs_url.js <jobId>'); process.exit(1); }
const url = `https://api.github.com/repos/eneekoruiz/portfolio/actions/jobs/${jobId}/logs`;

const options = { headers: { 'User-Agent': 'node' }, method: 'HEAD' };

const req = https.request(url, options, (res) => {
  console.log('statusCode', res.statusCode);
  console.log('headers', res.headers);
  if (res.headers.location) {
    console.log('logs_location', res.headers.location);
  }
  res.resume();
});
req.on('error', (e) => console.error('request-error', e.message));
req.end();
