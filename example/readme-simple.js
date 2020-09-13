const { createServer } = require('http');
const { createListener, ok, get, post } = require('../');

// 1. Make some Routes!
const getHome = get('/home', async () => ok({ message: 'Hello!' }));
const postUser = post('/user', async ({ body }) => ok({ message: `Received user ${JSON.parse(body).name}. TODO: add to database` }));


const runServer = () => {
  // 2. Combine Routes to form a Listener
  const listener = createListener([getHome, postUser]);
  // 3. Plug Listener into node server!
  const server = createServer(listener);

  server.listen(8080);
};

runServer();