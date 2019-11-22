const getCommonConfig = require('./webpack.config.common');

module.exports = async function (config) {
  return await getCommonConfig(config);
};
