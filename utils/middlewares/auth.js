/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const middleware = (config) => (req, res, next) => {
  const { authorization } = req.headers;
  const { ignorePaths } = config || {};
  const { originalUrl } = req;

  // Check if the current path should bypass authentication
  const isIgnoredPath = ignorePaths && ignorePaths.some((path) => originalUrl.startsWith(path));

  if (isIgnoredPath) {
    return next();
  }

  // Check if the Authorization header is present
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization token is missing or invalid',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify the token using HS256 and the same secret key
    const decodedToken = jwt.verify(token, config.JWT_SECRET || 'agileSecretKey', {
      audience: config.AUDIENCE || 'CUSTOMER',
      issuer: config.ISSUER || 'AGILE WORLD TECHNOLOGIES',
    });

    req.auth = {
      userId: decodedToken.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

module.exports = middleware;
