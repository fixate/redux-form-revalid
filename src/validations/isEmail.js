
import isByteLength from './isByteLength';
import isFQDN from './isFQDN';

const defaultOptions = {
  allow_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
const displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
const emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
const quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
const emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
const quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

export default function isEmail(options = defaultOptions) {
  return (value = '') => {
    const opts = Object.assign(defaultOptions, options);
    let str = value;

    if (opts.allow_display_name) {
      const displayEmail = str.match(displayName);
      if (displayEmail) {
        str = displayEmail[1];
      }
    }

    const parts = str.split('@');
    const domain = parts.pop();
    let user = parts.join('@');

    const lowerDomain = domain.toLowerCase();
    if (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com') {
      user = user.replace(/\./g, '').toLowerCase();
    }

    if (!isByteLength(user, { max: 64 }) ||
              !isByteLength(domain, { max: 256 })) {
      return { type: 'email', reason: 'invalidLength', value };
    }

    if (!isFQDN(domain, { require_tld: opts.require_tld })) {
      return { type: 'email', reason: 'invalidFQDN', value };
    }

    if (user[0] === '"') {
      user = user.slice(1, user.length - 1);
      if (opts.allow_utf8_local_part) {
        if (!quotedEmailUserUtf8.test(user)) {
          return { type: 'email', reason: 'invalidUser', value };
        } else if (!quotedEmailUser.test(user)) {
          return { type: 'email', reason: 'invalidUser', value };
        }
      }
    }

    const pattern = opts.allow_utf8_local_part ?
          emailUserUtf8Part : emailUserPart;

    const userParts = user.split('.');
    for (let i = 0; i < userParts.length; i++) {
      if (!pattern.test(userParts[i])) {
        return { type: 'email', reason: 'invalidPattern', value };
      }
    }

    return false;
  };
}
