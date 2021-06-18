// const mta = require('./src/vendors/mta_analysis');
// const umTrack = require('umtrack-wx');
// const Sentry = require('./src/vendors/sentry_wechat');
const errMsg = require('./src/utils/errMsg');
// const dateFormat = require('./src/utils/format/date');
// const envConfig = require('./src/config/env/index');
// const query = require('./src/utils/query');
// const version = require('./src/utils/version');

// const { analysisConfig, umengConfig, errLogConfig } = envConfig;

App({
  globalData: {},

  /**
   * 友盟统计配置
   */
  // umengConfig,

  /**
   * 初始化完成
   */
  onLaunch: function (options) {
    // this.analysis(options);
    // 加载错误文案
    // this.getErrMsg();
    // 初始化错误日志处理（Sentry）
    // this.initErrLog();
    // 检测是否需要强制更新弹框提示
    // version.checkForUpdate();
  },

  /**
   * 脚本错误或 API 调用报错
   */
  // onError: function (e) {
  //   console.log(e);
  //   const err = new Error(e);
  //   err.name = 'ScriptError';
  //   Sentry.captureException(err);
  // },

  /**
   * 未处理的 rejected Promise
   */
  // onUnhandledRejection: function (e) {
  //   const { reason } = e;

  //   // 排除掉request异常
  //   if (!(reason && typeof reason === 'object' && reason.name === 'HttpError')) {
  //     console.log(e);
  //     reason.name = 'PromiseError';
  //     Sentry.captureException(reason);
  //   }
  // },

  /**
   * 埋点分析
   */
  // analysis: function (options) {
  //   mta.App.init({
  //     appID: analysisConfig.appID,
  //     eventID: analysisConfig.eventID,
  //     autoReport: true,
  //     statParam: true,
  //     statShareApp: true,
  //     ignoreParams: [],
  //     lauchOpts: options,
  //   });
  // },

  /**
   * 获取接口错误消息
   */
  getErrMsg: function () {
    setTimeout(errMsg.load, 1000);
  },

  /**
   * 初始化错误日志统计
   */
  // initErrLog: function () {
  //   Sentry.init({
  //     dsn: errLogConfig.dsn,
  //     release: 'mini-member@' + dateFormat.formatDate()
  //   });
  // }
});
