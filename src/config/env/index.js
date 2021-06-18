const env = require('./env');
const fat = require('./fat');
const fat2 = require('./fat2');
const prod = require('./prod');

const config = { fat, fat2, prod }[env];
const {
  apiHost,
  serviceHost,
  ossHost,
  ossPrivateHost,
  contractHost,
  analysisConfig,
  umengConfig,
  errLogConfig,
  activityH5,
} = config;

module.exports = {
  apiHost,
  serviceHost,
  ossHost,
  ossPrivateHost,
  contractHost,
  analysisConfig,
  umengConfig,
  errLogConfig,
  activityH5,
};
