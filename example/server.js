// @flow strict
const {
  createGETRoute,
  createRoute,
  ok,
  notFound,
  badRequest,
  createListener,
} = require('..');
const { createServer } = require('http');

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
  const userRoute = createGETRoute('/users', userHandler);
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