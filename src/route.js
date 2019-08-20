// @flow strict
const url = require('url');
/*::
import type { HTTPIncomingRequest, HTTPOutgoingResponse } from './http';
import type { RESTEndpoint } from './rest';
*/

/*::
export type Route = {
  test: (inc: HTTPIncomingRequest) => boolean,
  handler: (inc: HTTPIncomingRequest, res: HTTPOutgoingResponse) => void | Promise<void>,
};
*/

const toPairedTuples = /*:: <T>*/(list/*: Array<T>*/)/*: Array<[T, T]>*/ => {
  const tuples = [];
  for (let i = 0; i < list.length / 2; i++) {
    tuples[i] = [list[i*2], list[(i*2) + 1]];
  }
  return tuples;
}

const readStream = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.setEncoding('utf8');
  stream.on('data', data => chunks.push(data));
  stream.on('error', error => reject(error));
  stream.on('end', () => resolve(chunks.join('')));
});

const createRouteFromRESTEndpoint = (endpoint/*: RESTEndpoint*/)/*: Route*/ => {
  const test = (inc) => {
    const pathMatches = endpoint.path === new URL(inc.url, 'https://www.example.com').pathname;
    const methodMatches = endpoint.method === inc.method;
    return pathMatches && methodMatches;
  };
  const handler = async (inc, res) => {
    try {
      const headers = new Map(toPairedTuples(inc.rawHeaders));
      const query = new Map(new URL(inc.url, 'https://www.example.com').searchParams.entries());
      const body = await readStream(inc);
      const response = await endpoint.handler(query, headers, body);
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      res.write(response.body);
    } finally {
      res.end();
    }
  };

  return { test, handler };
};

const createRoute = (
  test/*: (inc: HTTPIncomingRequest) => boolean*/,
  handler/*: (inc: HTTPIncomingRequest, res: HTTPOutgoingResponse) => void | Promise<void>*/,
)/*: Route*/ => ({
  test,
  handler,
});

module.exports = {
  createRouteFromRESTEndpoint,
  createRoute,
};