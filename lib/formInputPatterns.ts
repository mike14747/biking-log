/* eslint-disable no-useless-escape */

// eslint-disable-next-line quotes
export const usernamePattern = "^(?=.{4,15}$)[a-zA-Z0-9]+(?:[ _-][a-zA-Z0-9]+)*$";
export const usernameErrorMsg = 'Username must be from 4 to 15 characters in length and not include any special characters other than dashes, spaces and underscores (but only 1 can be used consecutively). Must start and end with a letter or number.';

// eslint-disable-next-line quotes
export const passwordPattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{8,20}$";
export const passwordErrorMsg = 'Password must be from 8 to 20 characters in length.';
export const repeatPassordErrorMsg = 'Passwords do not match.';

// eslint-disable-next-line quotes
export const emailPattern = "^(?:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]){1,64}@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$";
export const emailErrorMsg = 'Please enter a valid email address.';

// match date in this format: yyyy-mm-dd (this works, but doesn't take into account February not being allowed to have 30 or 31 days)
// eslint-disable-next-line quotes
export const datePattern = "^[0-9]{4}-(([0]{1}[0-9]{1})|([1]{1}[0-2]{1}))-(([0-2]{1}[0-9]{1})|([3]{1}[0-1]{1}))$";
export const dateErrorMsg = 'Please enter a valid date in this format: YYYY-MM-DD.';
