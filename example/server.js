// @flow strict
const {
  json: { ok, badRequest, notFound, noContent, created },
  createListener,
  resource,
} = require('..');
const { createServer } = require('http');

let userIdCounter = 4;
const users = {
  '1': { name: 'luke', age: 25 },
  '2': { name: 'tala', age: 23 },
  '3': { name: 'alex', age: 21 },
  '4': { name: 'nicky', age: 18 },
};

const toUser = (value/*: mixed*/) => {
  if (typeof value !== 'object' || value === null)
    throw new TypeError();
  const { name, age } = value;
  if (typeof name !== 'string')
    throw new TypeError();
  if (typeof age !== 'number')
    throw new TypeError();
  return {
    name,
    age
  };
}

const main = () => {
  const userRoutes = resource('/users', {
    async get({ query: { userID }, auth }) {
      if (!userID)
        return badRequest('Please provide a valid UserID');
      if (!users[userID])
        return notFound(`User ID ${userID} not found`);
  
      return ok(users[userID]);
    },
    async put({ query: { userID }, validateJSON }) {
      if (!userID)
        return badRequest('Please provide a valid UserID');
      if (!users[userID])
        return notFound(`User ID ${userID} not found`);
      const user = await validateJSON(toUser);
      users[userID] = user;

      return ok(users[userID]);
    },
    async post({ validateJSON }) {
      const user = await validateJSON(toUser);
      userIdCounter++;
      users[userIdCounter] = user;

      return created(userIdCounter);
    }
  }, { allowedOrigins: { type: 'wildcard' }, authorized: true });
  const server = createServer(createListener([...userRoutes]));
  server.listen(1234, () => console.log(`http://localhost:${server.address().port}`));
  server.on('error', () => server.close());
  process.on('SIGINT', () => server.close());
};

if (module === require.main) {
  main();
}