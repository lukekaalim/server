// @flow strict
/*::
import type { Readable, Writable } from 'stream';
*/

/*::
export type HTTPMethod =
 | 'GET'
 | 'POST'
 | 'DELETE'
 | 'PUT'
 | 'HEAD'
 | 'OPTIONS'
 | 'PATCH';

export type HTTPIncomingRequest = Readable & {
  headers: { [header: string]: string },
  url: string,
  method: string
};

export type HTTPOutgoingResponse = Writable & $ReadOnly<{
  writeHead: (status: number, headers?: { [key: string] : string, ... }) => void,
}>;
*/