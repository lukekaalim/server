// @flow strict
/*::
import type { Server } from 'http';
*/
const { expect, assert } = require('@lukekaalim/test');
const { createListener, createRoute } = require('../src');
const { createServer, get } = require('http');
const { createDisposable } = require('./utils.test');

const readStream = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.setEncoding('utf8');
  stream.on('data', data => chunks.push(data));
  stream.on('error', error => reject(error));
  stream.on('end', () => resolve(chunks.join('')));
});

const pGet = (url) => new Promise((resolve, reject) => {
  get(url, async inc => readStream(inc).then(resolve));
});

const withServer = /*:: <T>*/(
  listener,
)/*: ((Server => T) => Promise<T>)*/ => createDisposable/*:: <Server, T> */(
  async () => new Promise(res => {
    const server = createServer(listener);
    server.listen(0, () => res(server));
  }),
  async (server) => void server.close(),
);

const expectIntegration = expect(async () => {
  const route = createRoute(
    () => true,
    (_, res) => void res.end('The End')
  );
  const listener = createListener([route]);
  const withListenerServer = withServer(listener);
  const result = await withListenerServer(async server => {
    const port = server.address().port;
    const response = await pGet(`http://localhost:${port}`);
    return response;
  });
  return assert('The Server responds with the appropriate plain text', result === 'The End');
});

module.exports = {
  expectIntegration,
};
