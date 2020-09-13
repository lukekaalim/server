// @flow strict

/*::
type Success<S: {}> = S & {
  type: 'success',
};
type Failure<F: {}> = F & {
  type: 'failure',
};
type Result<S: {}, F: {}> =
  | Success<S>
  | Failure<F>;

export type {
  Result,
  Success,
  Failure,
};
*/

const succeed = /*:: <S: {}>*/(success/*: S*/)/*: Success<S>*/ => ({
  ...success,
  type: 'success',
});

const fail = /*:: <F: {}>*/(failure/*: F*/)/*: Failure<F>*/ => ({
  ...failure,
  type: 'failure',
});

module.exports = {
  succeed,
  fail,
};
