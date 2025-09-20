const jwt = require('jsonwebtoken');

// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  issuer: 'newborn-gift',
  audience: 'newborn-gift-users'
};

// Generate JWT token
const generateToken = (payload, options = {}) => {
  const tokenOptions = {
    expiresIn: options.expiresIn || jwtConfig.expiresIn,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    ...options
  };

  return jwt.sign(payload, jwtConfig.secret, tokenOptions);
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    });
  } catch (error) {
    throw error;
  }
};

// Generate refresh token (longer expiration)
const generateRefreshToken = (payload) => {
  return generateToken(payload, { expiresIn: '30d' });
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  jwtConfig
};