const address = require('address');

const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
const host = process.env.HOST || address.ip();
const port = parseInt(process.env.PORT, 10) || 9999;

module.exports = {
  host,
  protocol,
  port
};
