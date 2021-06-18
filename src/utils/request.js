// const Sentry = require('../vendors/sentry_wechat');
// const HttpError = require('./HttpError');
const envConfig = require('../config/env/index');
const uuid = require('./uuid');
const errMsg = require('./errMsg');

const { apiHost } = envConfig;
const { messages } = errMsg;
let loginTipsModal = false;

function getDeviceId() {
  let deviceId = wx.getStorageSync('device_id');

  if (deviceId) {
    return deviceId;
  } else {
    deviceId = uuid();
    wx.setStorageSync('device_id', deviceId);
    return deviceId;
  }
}

function getCurrentPageUrl() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] || {};
  const { route = '', options = {} } = currentPage;
  const queryArr = Object.keys(options).map((key) => `${key}=${options[key]}`);

  return route + (queryArr.length ? '?' + queryArr.join('&') : '');
}

function handleError(code, message, data, res, options) {
  let { handleError, url, requestId } = options;
  const msg = messages[code];
  const error = {
    name: 'HttpError',
    code,
    message: (msg && msg.msg) || message || '',
    type: msg && msg.type,
    data,
    res,
    text: '请求未成功，稍后再试吧～',
  };

  // // 收集接口请求错误日志到Sentry
  // Sentry.captureException(
  //   new HttpError(
  //     JSON.stringify({
  //       code,
  //       data,
  //       message,
  //       url,
  //       requestId,
  //     }),
  //     url,
  //   ),
  // );

  // 登录态失效，跳转到个人中心页重新登录
  if (code === 401 || code === 40000003) {
    // 如果设置handleError为all（或ALL），则需要自己处理所有的错误，包括登录态失效
    if (!/^ALL$/i.test(handleError)) {
      // 多个需要登录的接口同时调用时，确保只会弹出一次登录提示
      if (!loginTipsModal) {
        loginTipsModal = true;
        wx.showModal({
          title: '提示',
          content: '您需要登录才能完成此操作',
          confirmText: '去登录',
          confirmColor: '#1B1B1B',
          showCancel: false,
          success: (res) => {
            loginTipsModal = false;
            if (res.confirm) {
              const currentPageUrl = getCurrentPageUrl();

              // 登录成功后跳转到当前操作页面，理想情况下通过在跳到登录页时传递回跳页面地址，但wx.switchTab不支持传递参数，
              // 所以此处将参数临时存储在storage中，读取后立即删除
              if (currentPageUrl) {
                wx.setStorageSync('backUrl', currentPageUrl);
              }
              wx.switchTab({
                url: '/src/pages/user/mine/mine',
              });
            }
          },
        });
      }

      return error;
    }
  }

  // 调用处有申明自己处理错误，handleError 支持如下三类值：
  //    true，表示调用方会处理除登录态失效外的所有错误
  //   'ALL'（或 'all'，不区分大小写），表示调用方会处理全部的错误
  //   '99001' 等（单个错误编码，字符串），表示调用方会处理特定的单个错误
  //   ['99001', '99002'] 等，（多个错误编码，数组），表示调用方会处理特定等多个错误
  if (handleError) {
    // 申明处理所有的错误时，直接将错误返回
    if (handleError === true || /^ALL$/i.test(handleError)) {
      return error;
    }

    // 为便于统一操作，先将 handleError 参数转换成数组
    if (!Array.isArray(handleError)) {
      handleError = [handleError];
    }

    // 产生了申明要处理等错误时，返回此错误
    if (handleError.indexOf(code) > -1 || handleError.indexOf(code + '') > -1) {
      return error;
    }
  }

  if (error.type === 1) {
    wx.showModal({
      content: error.message || error.text,
      showCancel: false,
      confirmColor: '#1B1B1B',
    });
  } else {
    wx.showToast({
      title: error.message || error.text,
      icon: 'none',
    });
  }

  return error;
}

function request(options) {
  const {
    original,
    url,
    method = 'POST',
    showLoading,
    header = {},
    success: originSuccess,
    fail: originFail,
    complete: originComplete,
  } = options;
  const path = /^https?:\/\//i.test(url)
    ? url
    : apiHost + '/' + (url[0] === '/' ? url.slice(1) : url);
  const token = wx.getStorageSync('token');
  const requestId = uuid();
  const headers = Object.assign({}, header, {
    'Auth-Token': token,
    'W-AppId': '1012wellness-mini-member',
    deviceType: 2,
    deviceId: getDeviceId(),
    RequestId: requestId,
  });

  options.requestId = requestId;

  return new Promise((resolve, reject) => {
    function success(res) {
      if (showLoading) {
        wx.hideLoading();
      }

      const { statusCode, data: { code, message, data } = {} } = res;

      if (statusCode === 200) {
        if (code === 1) {
          resolve(original ? res : data);
        } else {
          console.log('业务异常：\n', res);
          const error = handleError(code, message, data, res, options);
          reject(error);
        }
      } else {
        console.log('HTTP异常：\n', res);
        const error = handleError(statusCode, message, data, res, options);
        reject(error);
      }

      if (typeof originSuccess === 'function') {
        originSuccess(res);
      }
    }

    function fail(res) {
      if (showLoading) {
        wx.hideLoading();
      }

      // 标识网络失败
      const code = 900;
      const message = '请求未成功，请检查您的网络情况～';

      console.log('网络异常：\n', res);

      const error = handleError(code, message, null, res, options);
      reject(error);

      if (typeof originFail === 'function') {
        originFail(res);
      }
    }

    function complete() {
      if (typeof originComplete === 'function') {
        originComplete();
      }
    }

    if (showLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
    }

    wx.request({
      ...options,
      header: headers,
      url: path,
      method,
      success,
      fail,
      complete,
    });
  });
}

module.exports = request;
