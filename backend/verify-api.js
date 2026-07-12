const http = require('http');

const port = 5010;
const host = '127.0.0.1';
const email = 'audit' + Date.now() + '@example.com';
const password = 'Password123!';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host, port, path, method: options.method || 'GET', headers: options.headers || {} }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

(async () => {
  const reg = await request('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { fullName: 'Audit User', email, password, phone: '1234567890', role: 'admin' } });
  console.log('register', reg.status, reg.body);
  const login = await request('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { email, password } });
  console.log('login', login.status, login.body);
  const token = JSON.parse(login.body).data.token;
  const headers = { Authorization: 'Bearer ' + token };
  const assets = await request('/api/assets', { headers });
  console.log('assets', assets.status, assets.body);
  const createAsset = await request('/api/assets', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: { assetName: 'Laptop', category: 'Hardware', brand: 'Dell', model: 'Latitude', serialNumber: 'SN123', status: 'available' } });
  console.log('createAsset', createAsset.status, createAsset.body);
  const assetId = JSON.parse(createAsset.body).data.asset._id;
  const employees = await request('/api/employees', { headers });
  console.log('employees', employees.status, employees.body);
  const dashboard = await request('/api/dashboard', { headers });
  console.log('dashboard', dashboard.status, dashboard.body);
  const reports = await request('/api/reports', { headers });
  console.log('reports', reports.status, reports.body);
  const maintenance = await request('/api/maintenance', { headers });
  console.log('maintenance', maintenance.status, maintenance.body);
  const notifications = await request('/api/notifications', { headers });
  console.log('notifications', notifications.status, notifications.body);
  const aiChat = await request('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: { message: 'How is maintenance performing?' } });
  console.log('aiChat', aiChat.status, aiChat.body);
  const aiPredict = await request('/api/ai/predict', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: { assetId } });
  console.log('aiPredict', aiPredict.status, aiPredict.body);
  const qr = await request('/api/assets/' + assetId + '/qr', { headers });
  console.log('qr', qr.status, qr.headers['content-type']);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
