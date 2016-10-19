export default function isRequired(extra) {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return Object.assign({ type: 'required', reason: 'empty', value }, extra);
    }

    return false;
  };
}
