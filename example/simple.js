// @flow strict
const { text, route, router } = require('@lukekaalim/server');
const { createServer } = require('http');

const main = () => {
  const myRoute = route(
    'GET',
    '/greetings',
    () => text.plain(200, 'Hello World!')
  );
  const myRouter = router([myRoute]);
  const myServer = createServer(myRouter);

  myServer.listen(8080);
};

main();