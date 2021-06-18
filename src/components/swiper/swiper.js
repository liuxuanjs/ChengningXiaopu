Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    indicator: {
      type: String,
      value: '', // ''、'number'、'line'
    },
    autoplay: {
      type: Boolean,
      value: true,
    },
    videoAutolay: {
      type: Boolean,
      value: true,
    },
    current: {
      type: Number,
      value: 0,
    },
    interval: {
      type: Number,
      value: 3000,
    },
    duration: {
      type: Number,
      value: 500,
    },
    circular: {
      type: Boolean,
      value: false,
    },
    vertical: {
      type: Boolean,
      value: false,
    },
    preview: {
      type: Boolean,
      value: true,
    },
    items: {
      type: Array,
      value: []
    },
    video: {
      type: String,
      value: ''
    },
    customClass: {
      type: String,
      value: '',
    },
    placeholder: {
      type: String,
      value: '/src/images/common/img_load_fail.png',
    },
    width: {
      type: Number, // 阿里云OSS图片宽度
      value: 750,
    },
  },

  observers: {
    'items, video': function (items, video) {
      items = items.map((item) => {
        if (typeof item === 'string') {
          item = {
            img: item
          };
        }

        item.url = item.img;
        item.type = 'image';

        return item;
      });

      this.setData({
        imgList: items,
        type: video ? 2 : 1
      });
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: 1,
    imgList: [],
    index: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSwitchType: function (e) {
      const {
        target: {
          dataset: { type },
        },
      } = e;

      if (!this.videoContext) {
        this.videoContext = wx.createVideoContext('myVideo', this);
      }

      // 选择图片时，暂停视屏
      if (type === 1) {
        this.videoContext.pause();
        // 选择视屏时，播放视屏
      } else {
        this.videoContext.play();
      }

      this.setData({ type });
    },

    onChange: function (e) {
      const { detail } = e;
      const { current } = detail;

      this.setData({
        index: current,
      });

      this.triggerEvent('change', current);
    },

    onPreview: function () {
      const { preview, index, imgList } = this.data;

      if (preview) {
        if (wx.previewMedia) {
          wx.previewMedia({
            current: index,
            sources: imgList,
          });
        } else {
          wx.previewImage({
            current: index,
            urls: imgList,
          });
        }
      } else {
        const item = imgList[index];

        if (item.link) {
          if (/mini:\/\//.test(item.link)) {
            const url = item.link.slice(6);
            wx.navigateTo({
              url,
            });
          } else {
            wx.navigateTo({
              url: '/src/pages/webview/webview?url=' + encodeURIComponent(item.link),
            });
          }
        }
      }

      this.triggerEvent('click', { index });
    },
  },
});
