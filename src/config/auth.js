require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '7d'; // Token expires in 7 days

module.exports = {
  JWT_SECRET,
  JWT_EXPIRY,
};
