export default function isRequired(name) {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return { type: 'required', reason: 'empty', value, name };
    }

    return false;
  };
}
