// @flow strict
/*:: import type { Assertion } from '@lukekaalim/test'; */
const { assert } = require('@lukekaalim/test');
const { createServer, request } = require('http');
const { createNodeClient } = require('@lukekaalim/http-client');
const { resource, router, application } = require('@lukekaalim/server');

const assertAccess = async ()/*: Promise<Assertion>*/ => {
  const listener = router(resource({
    path: '/',
    access: { origins: { type: 'whitelist', origins: ['www.example.com'] } },
    methods: { GET: () => application.json(200, 'Hello') }
  }));
  const server = createServer(listener);
  try {
    await new Promise(r => server.listen(0, r));
    const client = createNodeClient(request);
    const { address, port } = server.address();
  
    const { status, headers, body } = await client.sendRequest({
      url: `http://127.0.01:${port}`,
      headers: [['origin', 'www.example.com']],
      method: 'GET'
    });
  
    const headerObject = Object.fromEntries(headers);
  
    return assert('CORS', [
      assert('Whitelisted origin is allowed', headerObject['access-control-allow-origin'] === 'www.example.com')
    ]);
  } finally {
    server.close();
  }
};

module.exports = {
  assertAccess,
};