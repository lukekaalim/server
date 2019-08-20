// @flow strict
/*::
import type { Readable, Writable } from 'stream';
*/

/*::
export type HTTPIncomingRequest = Readable & {
  rawHeaders: Array<string>,
  url: string,
  method: string
};

export type HTTPOutgoingResponse = Writable & $ReadOnly<{
  writeHead: (status: number, headers?: { [key: string] : string, ... }) => void,
}>;
*/