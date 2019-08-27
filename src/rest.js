// @flow strict
const { createRoute } = require('./route');
/*::
import type { Route } from './route';
import type { HTTPMethod } from './http';
*/

const createResponseConstructor = (
  status/*: number*/,
) => (
  body/*: string*/ = '',
  headers/*: Array<[string, string]>*/ = [],
) => ({
  status,
  headers,
  body,
});

const ok =              createResponseConstructor(200);
const notFound =        createResponseConstructor(404);
const badRequest =      createResponseConstructor(400);
const unauthenticated = createResponseConstructor(401);
const serverError =     createResponseConstructor(500);

const responseConstructor = {
  ok,
  notFound,
  badRequest,
  unauthenticated,
  serverError,
};

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

const createRESTRouteConstructor = (
  method/*: HTTPMethod*/,
) => (
  path/*: string*/,
  onRoute/*: (
    query: Map<string, string>,
    headers: Map<string, string>,
    body?: string,
  ) => Promise<{
    status: number,
    headers: Array<[string, string]>,
    body: string,
  }> | {
    status: number,
    headers: Array<[string, string]>,
    body: string,
  }*/,
) => {
  const test = (inc) => {
    const pathMatches = path === new URL(inc.url, 'https://www.example.com').pathname;
    const methodMatches = method === inc.method;
    return pathMatches && methodMatches;
  };
  const handler = async (inc, res) => {
    try {
      const headers = new Map(toPairedTuples(inc.rawHeaders));
      const query = new Map(new URL(inc.url, 'https://www.example.com').searchParams.entries());
      const body = await readStream(inc);
      const response = await onRoute(query, headers, body);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.write(response.body);
    } finally {
      res.end();
    }
  };

  return createRoute(test, handler);
}

const createGETRoute =     createRESTRouteConstructor('GET');
const createPOSTRoute =    createRESTRouteConstructor('POST');
const createDELETERoute =  createRESTRouteConstructor('DELETE');
const createPUTRoute =     createRESTRouteConstructor('PUT');
const createHEADRoute =    createRESTRouteConstructor('HEAD');
const createOPTIONSRoute = createRESTRouteConstructor('OPTIONS');
const createPATCHRoute =   createRESTRouteConstructor('PATCH');

const routeConstructors = {
  createGETRoute,
  createPOSTRoute,
  createDELETERoute,
  createPUTRoute,
  createHEADRoute,
  createOPTIONSRoute,
  createPATCHRoute,
};

module.exports = {
  ...routeConstructors,
  ...responseConstructor,
};