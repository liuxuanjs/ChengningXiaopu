const envConfig = require('../../config/env/index');
const request = require('../../utils/request');

const { serviceHost } = envConfig;

function isOSSImg(src) {
  if (/(oss\-cn\-shanghai\.aliyuncs\.com)|(^https:\/\/img\.1012china\.com)/.test(src)) {
    return true;
  }

  return false;
}

Component({
  options: {
    addGlobalClass: true
  },
  externalClasses: ['img-class', 'img-wrapper-class'],

  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: '',
      observer: function (value) {
        const { width, height, isPrivate } = this.data;

        if (value && isOSSImg(value) && (width > 0 || height > 0)) {
          value += '?x-oss-process=image/resize';

          if (width > 0) {
            value += ',w_' + width;
          }

          if (height > 0) {
            value += ',h_' + height;
          }
        }

        this.setData({
          imgSrc: value
        });

        // 私有读图片需要换取签名图片地址访问
        if (isPrivate) {
          this.setData({
            status: -1
          });
          request({
            url: `${serviceHost}/service/getPrivateUrl`,
            method: 'POST',
            data: {
              url: value
            }
          })
            .then((data) => {
              let { url } = data || {};

              this.setData({
                imgSrc: url,
                status: 0
              });
            })
            .catch(() => {
              this.setData({
                status: 2
              });
            });
        }
      }
    },
    mode: {
      type: String,
      value: 'scaleToFill'
    },
    lazyLoad: {
      type: Boolean,
      value: false
    },
    showMenuByLongpress: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: true
    },
    placeholder: {
      type: String,
      value: '/src/images/common/img_load_fail.png'
    },
    customClass: {
      type: String,
      value: ''
    },
    preview: {
      type: Boolean,
      value: false
    },
    width: { // 缩放阿里云OSS图片
      type: Number,
      value: 0
    },
    height: { // 缩放阿里云OSS图片
      type: Number,
      value: 0
    },
    isPrivate: { // 是否是私有访问图片
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgSrc: '',
    status: 0 // 图片加载状态：-1-请求图片地址中（私有图片），0-加载中，1-加载成功，2-加载失败
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function () {
      this.setData({
        status: 1
      });
      this.triggerEvent('load');
    },

    onError: function () {
      this.setData({
        status: 2
      });
      this.triggerEvent('error');
    },

    onPreview: function () {
      const { preview, src, placeholder } = this.data;
      const url = src || placeholder;

      if (preview) {
        wx.previewImage({
          urls: [url]
        });
      }
    }
  }
});
