module.exports = {
  appId: 'wx710b50bea399cd18',

  // 接口服务地址
  apiHost: 'https://g.1012china.com',
  // 中间层服务地址
  serviceHost: 'https://h5.1012china.com',
  // 阿里云OSS地址（公共读写）
  ossHost: 'https://wellness-public.oss-cn-shanghai.aliyuncs.com',
  // 阿里云OSS地址（私有读写）
  ossPrivateHost: 'https://wellness-private.oss-cn-shanghai.aliyuncs.com',
  // 上上签合同签署域名
  contractHost: 'https://wx500.bestsign',

  // 活动页h5
  activityH5: 'https://activity.1012china.com',

  // 腾讯埋点分析配置数据
  analysisConfig: {
    appID: '500733341',
    eventID: '500733342',
  },

  // 友盟埋点分析配置数据
  umengConfig: {
    appKey: '5faa293a1c520d3073a4d351',
    useOpenid: false,
    uploadUserInfo: true,
  },

  // 错误日志统计配置
  errLogConfig: {
    dsn: 'https://d1555ade6d2841ac93f972209763efb7@sentry.1012china.com/8',
    tracesSampleRate: 0.1,
  },
};
