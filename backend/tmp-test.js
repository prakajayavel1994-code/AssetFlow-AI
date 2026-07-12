const http = require('http');
const req = (path, opts = {}) => new Promise((resolve, reject) => {
  const r = http.request({ host: '127.0.0.1', port: 5003, path, method: opts.method || 'GET', headers: opts.headers || {} }, (res) => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (c) => data += c);
    res.on('end', () => resolve({ status: res.statusCode, body: data }));
  });
  r.on('error', reject);
  if (opts.body) r.write(JSON.stringify(opts.body));
  r.end();
});

(async () => {
  const email = 'verify' + Date.now() + '@example.com';
  const password = 'Password123!';
  const reg = await req('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { fullName: 'Verify User', email, password, phone: '1234567890', role: 'admin' } });
  console.log('register', reg.status);
  console.log(reg.body);
  const login = await req('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: { email, password } });
  console.log('login', login.status);
  console.log(login.body);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
