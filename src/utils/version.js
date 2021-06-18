const variable = require('./variable');
// const Sentry = require('../vendors/sentry_wechat');

/**
 * 比较版本
 * @param {*} v1 版本一
 * @param {*} v2 版本二
 */
function compareVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

function getForceUpdateVersion() {
  return variable.query('force_update_version');
}

/**
 * 检测更新
 */
function checkForUpdate() {
  const updateManager = wx.getUpdateManager();

  // 注册检测到并下载好更新后的回调函数
  updateManager.onUpdateReady(function () {
    getForceUpdateVersion().then((configVersion) => {
      const accountInfoSync = (wx.getAccountInfoSync && wx.getAccountInfoSync()) || {};
      const { miniProgram: { version } = {} } = accountInfoSync;

      // 配置了强制更新版本且大于当前小程序版本，提示用户重启小程序应用更新
      if (configVersion && version && compareVersion(configVersion, version) === 1) {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，小程序将重新启动以应用更新',
          confirmText: '知道了',
          showCancel: false,
          success: function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          },
        });
      }
    });
  });
  // 注册下载更新失败的回调函数
  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
    // Sentry.captureException(new Error('下载新版本小程序更新失败'));
  });
}

module.exports = {
  checkForUpdate,
};
