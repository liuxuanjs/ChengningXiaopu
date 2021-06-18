const request = require('./request');
const envConfig = require('../config/env/index');

const { serviceHost } = envConfig;

/**
 * 查询环境变量配置
 * @param {String} name 环境变量名称
 * @param {String?} defaultValue 环境变量默认值
 */
function query(name, defaultValue) {
  const param = {
    namespace: 'mini-member',
  };

  if (name) {
    param.name = name;
  }

  return request({
    method: 'GET',
    url: `${serviceHost}/service/variable/query`,
    handleError: 'all',
    data: param,
  })
    .then((value) => {
      // 没有查询到环境变量配置，但有设置默认值，则使用默认值
      if (value === undefined && defaultValue !== undefined) {
        return defaultValue;
      }

      return value;
    })
    .catch((err) => {
      // 查询环境变量报错，但有设置默认值，则使用默认值
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      // 没有默认值，继续抛出异常（使用variable.query时如果想始终进入成功回调，不想主动捕获catch，可以始终传递defaultValue）
      throw err;
    });
}

module.exports = {
  query,
};
