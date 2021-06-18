const envConfig = require('../config/env/index');

const { apiHost } = envConfig;
const messages = {};
let retryCount = 5;

function load() {
  wx.request({
    url: `${apiHost}/enum/getErrCode`,
    method: 'POST',
    data: {
      serviceType: 2,
    },
    success: function (res) {
      const { statusCode, data: { code, data = [] } = {} } = res;

      if (statusCode === 200 && code === 1) {
        data.forEach((item) => {
          messages[item.code] = item;
        });
      } else {
        if (--retryCount > 0) {
          setTimeout(() => {
            load();
          }, 1000);
        }
      }
    },
    fail: function () {
      if (--retryCount > 0) {
        setTimeout(() => {
          load();
        }, 1000);
      }
    },
  });
}

module.exports = {
  messages,
  load,
};
