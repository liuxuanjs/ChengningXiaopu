module.exports = {
  appId: 'wx834c7350371f6fdf',

  // 接口服务地址
  apiHost: 'https://g-fat.1012china.com',
  // 中间层服务地址
  serviceHost: 'https://h5-fat.1012china.com',
  // 阿里云OSS地址（公共读写）
  ossHost: 'https://wellness-test.oss-cn-shanghai.aliyuncs.com',
  // 阿里云OSS地址（私有读写）
  ossPrivateHost: 'https://wellness-private-test.oss-cn-shanghai.aliyuncs.com',
  // 上上签合同签署域名
  contractHost: 'https://wx501.bestsign',

  // 活动页h5
  activityH5: 'https://activity-fat.1012china.com',

  // 腾讯埋点分析配置数据
  analysisConfig: {
    appID: '500733145',
    eventID: '500733148',
  },

  // 友盟埋点分析配置数据
  umengConfig: {
    appKey: '5ff953b0f1eb4f3f9b57712f',
    useOpenid: false,
    uploadUserInfo: true,
  },

  // 错误日志统计配置
  errLogConfig: {
    dsn: 'https://468eb1dc6dbd48f282afa4a0c3dcba58@sentry.1012china.com/10',
    tracesSampleRate: 1.0,
  },
};
