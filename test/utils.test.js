// @flow strict

/*::
export type Disposable<T> = <TResult>(handler: (resource: T) => Promise<TResult> | TResult) => Promise<TResult>
*/

const createDisposable = /*:: <TResource, TResult>*/(
  startUp/*: () => TResource | Promise<TResource>*/,
  tearDown/*: TResource => void | Promise<void>*/,
)/*: Disposable<TResource>*/ => async /*::<T>*/(handler/*: TResource => T*/) => {
  const resource = await startUp();
  try {
    const result = await handler(resource);
    await tearDown(resource);
    return result;
  } catch (error) {
    await tearDown(resource);
    throw error;
  }
};

module.exports = {
  createDisposable,
};