// @flow strict
/*:: import type { HTTPHeaders } from './http'; */

/*::
export type CacheOptions = {
  expires?: Date,
  cacheability?: 'public' | 'private' | 'no-store' | 'no-cache',
  maxAge?: number,
  mustRevalidate?: boolean,
};
*/

const createCacheHeaders = ({ expires, cacheability, maxAge, mustRevalidate }/*: CacheOptions*/ = {})/*: HTTPHeaders*/ => {
  const cacheControlHeader = [
    cacheability,
    maxAge && `max-age=${maxAge}`
  ].filter(Boolean).join(', ');
  return {
    'cache-control': cacheControlHeader,
  };
};

module.exports = {
  createCacheHeaders,
};