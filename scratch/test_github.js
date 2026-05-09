const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const token = env.split('=')[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/user/repos',
  method: 'GET',
  headers: {
    'Authorization': `token ${token}`,
    'User-Agent': 'Node-Test'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log('Error Body:', data);
    } else {
      console.log('Success! Repos found:', JSON.parse(data).length);
    }
  });
});

req.on('error', (e) => console.error('Error:', e));
req.end();
