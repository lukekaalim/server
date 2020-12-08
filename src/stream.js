// @flow strict
/*:: import type { Readable } from 'stream'; */

const readStream = (stream/*: Readable*/, length/*: ?number*/)/*: Promise<string>*/ => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.setEncoding('utf8');
    stream.on('data', data => chunks.push(data));
    stream.on('error', error => reject(error));
    stream.on('end', () => resolve(chunks.join('')));
  });
}

module.exports = {
  readStream,
};
