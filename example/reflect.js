// @flow strict
const {
  stream: { ok }, json: { badRequest },
  createListener,
  resource,
} = require('..');
const { createServer } = require('http');

const createReflectionServer = () => {
  const server = createServer(createListener(resource('/', {
    post: async ({ content }) => {
      if (!content)
        return badRequest({ message: 'no content' });
      return ok(content?.stream, {
        'content-type': content.contentType,
        'content-length': content.contentLength?.toString()
      })
    }
  })));
  server.listen(5678, () => console.log(`http://localhost:${server.address().port}`));
  server.on('error', () => server.close());
  process.on('SIGINT', () => server.close());
};

createReflectionServer();