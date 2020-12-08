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

const main = () => {
  const userRoutes = resource('/users', {
    async get({ query: { userID }, auth }) {
      if (!userID)
        return badRequest('Please provide a valid UserID');
      if (!users[userID])
        return notFound(`User ID ${userID} not found`);
  
      return ok(users[userID]);
    },
    async put({ query: { userID }, content }) {
      if (!userID)
        return badRequest('Please provide a valid UserID');
      if (!users[userID])
        return notFound(`User ID ${userID} not found`);
      if (content.type !== 'json')
        return badRequest('Please input JSON body');
      users[userID] = content.value;

      return ok(users[userID]);
    },
    async post({ content }) {
      if (content.type !== 'json')
        return badRequest('Please input JSON body');
      userIdCounter++;
      users[userIdCounter] = content.value;

      return created(userIdCounter);
    }
  }, { allowedOrigins: { type: 'wildcard' }, authorized: true });
  const server = createServer(createListener([...userRoutes]));
  server.listen(1234, () => console.log(`http://localhost:${server.address().port}`));
  process.on('SIGINT', () => server.close());
};

if (module === require.main) {
  main();
}