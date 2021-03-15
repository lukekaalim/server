// @flow strict
const { createServer } = require('http');
const {
  createRouteListener,
  createHTTPResourceRoutes,
  
  createRouteResponse,
  statusCodes: { ok },
  readBody
} = require('@lukekaalim/server');

const createReflectionServer = () => {
  const server = createServer(createRouteListener(createHTTPResourceRoutes({
    path: '/',
    methods: {
      POST: (req) => createRouteResponse(ok, req.headers, req.incoming),
    },
  })));
  server.listen(5678, () => console.log(`http://localhost:${server.address().port}`));
  server.on('error', () => server.close());
  process.on('SIGINT', () => server.close());
};

createReflectionServer();