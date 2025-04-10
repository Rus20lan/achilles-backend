export function getRequestQueryObject(req, keys) {
  if (!Array.isArray(keys)) return null;
  const result = {};
  for (const key of keys) {
    if (req.query.hasOwnProperty(key)) {
      result[key] = req.query[key];
    }
  }
  return result;
}
