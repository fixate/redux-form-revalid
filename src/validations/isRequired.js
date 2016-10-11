export default function isRequired(value) {
  if (value === undefined || value === null || value === '') {
    return { type: 'required', reason: 'empty', value };
  }

  return false;
}
