const { createServer } = require('http');
const { createListener, ok, resource } = require('../');

// 1. Create "resource" and assign accessors using CRUD syntax
let user = { name: 'david' };
const userRoutes = resource('/user', {
  async create({ content }) {
    user = content.value;
    return ok(user);
  },
  async read() {
    return ok(user);
  },
  async destroy() {
    user = null;
    return ok(user);
  }
})

const runServer = () => {
  // 2. Combine Routes to form a Listener
  const listener = createListener([...userRoutes]);
  // 3. Plug Listener into node server!
  const server = createServer(listener);

  server.listen(8080);
};

runServer();