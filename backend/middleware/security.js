const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for API endpoints
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        message: message || 'Too many requests, please try again later'
      });
    }
  });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const authLimiter = createRateLimit(15 * 60 * 1000, 5); // 5 login attempts per 15 minutes
const uploadLimiter = createRateLimit(60 * 60 * 1000, 10); // 10 uploads per hour

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders
};