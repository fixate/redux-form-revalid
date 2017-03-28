import {
  combineValidators as combine,
  composeValidators,
} from 'revalid';

export function combineValidators(validators) {
  const validator = combine(validators);
  return (values) => validator(values || {}).validationErrors;
};

export {
  composeValidators,
};
