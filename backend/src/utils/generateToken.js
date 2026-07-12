const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const userId = typeof user === 'object' ? user._id : user;
  const payload = {
    id: userId,
    email: typeof user === 'object' ? user.email : undefined,
    role: typeof user === 'object' ? user.role : undefined,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;
