# @lukekaalim/server

A very simple set of tools that simplify the creation of a basic node.js server created
by the `http` or `https` modules.

## Installation
```bash
npm i @lukekaalim/server
```

## Usage

```javascript

const { createServer } = require('http');
const { createListener, ok, onGet } = require('@lukekaalim/server');

// 1. Make some Routes!
const homeRoute = onGet('/home', () => ok('This is the home page'));
const usersRoute = onGet('/users', () => ok(JSON.stringify([{ name: 'dave' }])));

const runServer = () => {
  // 2. Combine Routes to form a Listener
  const listener = createListener([homeRoute, usersRoute]);
  // 3. Plug Listener into node server!
  const server = createServer(listener);

  server.listen(8080);
};

```