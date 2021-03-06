// @flow strict
const { createServer } = require('http');
const {
  router, resource, responses, statusCodes, readBody
} = require('@lukekaalim/server');

const main = async () => {
  let greeting = 'Hello!';

  const greetingResource = {
    path: '/greeting',
    cache: { maxAge: 100, cacheability: 'public' },
    methods: {
      GET: () => responses.application.json(statusCodes.ok, greeting),
      PUT: async (request) => (greeting = await readBody(request.incoming, request.headers), responses.empty())
    },
  };

  const listener = router(resource(greetingResource));
  const server = createServer(listener);

  server.listen(4792, () => console.log(`Server is listening on http://localhost:${server.address().port}`))
};

main();