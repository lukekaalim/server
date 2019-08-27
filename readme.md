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
const { createListener, ok, createGETRoute } = require('@lukekaalim/server');

// 1. Make some Routes!
const homeRoute = createGETRoute('/home', () => ok('This is the home page'));
const usersRoute = createGETRoute('/users', () => ok(JSON.stringify([{ name: 'dave' }])));

// 1.1 Make sure they return the correct headers
const contentRoute = createGETRoute('/content', () => ok(
  JSON.stringify([{ name: 'dave' }]),
  [['Content-Type', 'application/json']],
));

const runServer = () => {
  // 2. Combine Routes to form a Listener
  const listener = createListener([homeRoute, usersRoute]);
  // 3. Plug Listener into node server!
  const server = createServer(listener);

  server.listen(8080);
};

```