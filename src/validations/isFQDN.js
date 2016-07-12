const defaultOptions = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false,
};

export default function isFDQN(string, options) {
  const opts = Object.assign(options, defaultOptions);
  let str = string;

    /* Remove the optional trailing dot before checking validity */
  if (opts.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  const parts = str.split('.');
  if (opts.require_tld) {
    const tld = parts.pop();
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
  }
  for (let part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (opts.allow_underscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    if (/[\uff01-\uff5e]/.test(part)) {
          // disallow full-width chars
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
