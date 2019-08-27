// @flow strict
const {
  createRESTRoute,
  createRoute,
  createRESTResponse,
  createListener,
} = require('..');
const { createServer } = require('http');

const ok = (body, headers) => createRESTResponse(200, body, headers);
const badRequest = () => createRESTResponse(400);
const notFound = () => createRESTResponse(404);

const users = new Map/*:: <number, { name: string }>*/([
  [0, { name: 'luke' }],
  [1, { name: 'tala'}],
  [2, { name: 'alex' }],
  [3, { name: 'nicky' }],
]);

const main = () => {
  const userHandler = (query) => {
    const queryId = query.get('id');
    if (!queryId) {
      return badRequest();
    }
    const id = parseInt(queryId, 10);
    if (isNaN(id)) {
      return badRequest();
    }
    const user = users.get(id);
    if (!user) {
      return notFound();
    }
    return ok(JSON.stringify(user), [['Content-Type', 'application/json']]);
  };
  const userRoute = createRESTRoute('GET', '/users', userHandler);
  const routes = [
    userRoute,
  ];
  const listener = createListener(routes);
  const server = createServer(listener);
  server.listen(1234, () => console.log(server.address()));
  process.on('SIGINT', () => server.close());
};

if (module === require.main) {
  main();
}