export default function isRequired(value) {
  if (!value) {
    return { type: 'required', reason: 'empty', value };
  }

  return false;
}
