const http = require('http');

function run(path, opts = {}) {
  return new Promise((resolve) => {
    const options = Object.assign({ hostname: 'localhost', port: 3000, path }, opts);
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
    if (opts.body) req.write(opts.body);
    req.on('error', (e) => resolve({ error: e.message }));
    req.end();
  });
}

(async () => {
  console.log('GET /api/boards');
  console.log(await run('/api/boards'));

  console.log('\nGET /api/users/some-id');
  console.log(await run('/api/users/some-id'));

  console.log('\nPOST /api/register');
  console.log(
    await run('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password', id: 'test-id', fullName: 'Test User' })
    })
  );

  console.log('\nPOST /api/login');
  console.log(
    await run('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    })
  );
})();
