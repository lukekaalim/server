// @flow strict
/*::
import type { HTTPIncomingRequest, HTTPOutgoingResponse } from './http';
import type { Readable, Writable } from 'stream';
import type { Route, RouteRequest, RouteResponse, RouteHandler } from './route';
*/

/*::
export type Listener = (
  request: HTTPIncomingRequest,
  response: HTTPOutgoingResponse, 
) => void;
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

const createListener = (
  routes/*: Array<Route>*/,
  onRouteMiss/*: RouteHandler*/
)/*: Listener*/ => {
  // Iterate through every route to create a two-dimensional Map,
  // where the first index is the path, and the second is the method,
  // and the value is the route handler
  const pathMap = routes.reduce((acc, route) => {
    const methodMap = acc.get(route.path) || new Map();
    methodMap.set(route.method, route);
    acc.set(route.path, methodMap);
    return acc;
  }, new Map());

  const listener = async (inc, res) => {
    const url = new URL(inc.url, 'example.com');
    const methodMap = pathMap.get(url.pathname);
    const request = await readRequest(url, inc);
    if (!methodMap) {
      return await writeResponse(await onRouteMiss(request), res);
    }
    const route = methodMap.get(inc.method);
    if (!route) {
      return await writeResponse(await onRouteMiss(request), res);
    }
    const response = await route.handler(request);
    await writeResponse(response, res);
  };
  // always return void
  return (inc, res) => void listener(inc, res);
};

const readRequest = async (url/*: URL*/, httpReq/*: HTTPIncomingRequest*/)/*: Promise<RouteRequest>*/ => {
  const headers = new Map(toPairedTuples(httpReq.rawHeaders));
  const query = new Map(url.searchParams.entries());
  const body = await readStream(httpReq);
  return { query, headers, body };
};

const writeResponse = async (routeRes/*: RouteResponse*/, httpRes/*: HTTPOutgoingResponse*/)/*: Promise<void>*/ => {
  httpRes.writeHead(routeRes.status, routeRes.headers);
  await new Promise(res => httpRes.write(routeRes.body, 'utf-8', res));
  await new Promise(res => httpRes.end(res));
}

module.exports = {
  readRequest,
  writeResponse,
  createListener,
}