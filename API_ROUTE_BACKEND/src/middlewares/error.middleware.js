export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ message: 'Internal Server Error' });
}
