// @flow strict
/*:: import type { Assertion } from '@lukekaalim/test'; */
const { assert } = require('@lukekaalim/test');
const { Writable, Readable } = require('stream');
const { mocks, resource, router, application } = require('@lukekaalim/server');

const assertAccess = async ()/*: Promise<Assertion>*/ => {
  const listener = router(resource({
    path: '/',
    access: { origins: { type: 'whitelist', origins: ['www.example.com'] } },
    methods: { GET: () => application.json(200, 'Hello') }
  }));

  const req = new mocks.request({ origin: 'www.example.com' }, '/', 'GET', Buffer.alloc(0));
  const res = new mocks.response();

  listener(req, res);
  
  const { status, headers, body } = await res.readResponse();

  return assert('CORS', [
    assert('Whitelisted origin is allowed', headers['access-control-allow-origin'] === 'www.example.com')
  ]);
};

module.exports = {
  assertAccess,
};