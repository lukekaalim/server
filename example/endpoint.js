// @flow strict
const { createPOSTHandler, router, resource } = require('@lukekaalim/server');
const { createNodeClient, createJSONEndpointClient } = require('@lukekaalim/http-client');
const { createServer, request } = require('http');
const { toString, toObject } = require('@lukekaalim/cast');``

const endpoint = {
  path: '/',
  method: 'POST',
  toResponseBody: a => toString(a),
  toQuery: a => a,
  toRequestBody: a => toString(a),
};

const main = async () => {
  const http = createNodeClient(request);
  const listener = router(resource({
    path: '/',
    methods: {
      POST: async r => {
        try {
          return await createPOSTHandler(endpoint, ({ query, body }) => {
            return { status: 200, body };
          })(r);
        } catch (e) {
          console.log(e);
          throw e;
        }
    },
    }
  }));
  const server = createServer(listener);
  try {
    await new Promise(r => server.listen(0, 'localhost', r));
    const service = {
      baseURL: new URL(`http://${server.address().address}:${server.address().port}`)
    }
    const response = await http.sendRequest({
      url: new URL(`http://${server.address().address}:${server.address().port}/`),
      method: 'POST',
      headers: [['content-type', 'application/json']],
      body: JSON.stringify('hello theres')
    })
    console.log(response.body);
  } catch (error) {
    console.error(error);
  } finally {
    server.close();
  }
};

main();