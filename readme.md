# @lukekaalim/server

Tiny HTTP tools for making JSON-Oriented REST servers.

## Installation
```bash
npm i @lukekaalim/server
```

## Usage

### Simple Routes

```js
const { createServer } = require('http');
const { createListener, ok, get, post } = require('@lukekaalim/server');

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
```

### Using REST Resource
```js
const { createListener, ok, resource } = require('@lukekaalim/server');

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

```