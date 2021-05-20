//detail.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    warning: {}
  },
  onLoad: function () {
    // 云数据
    db.collection('warning').where({ dtd: false, _id: this.options.warningId }).get().then(res => {
      let data = res.data
      if (data.length >= 0) {
        let shijian = this.formatDate(data[0].shijian)
        data[0].shijian = shijian
        this.setData({ warning: data[0] })
      }
    })
  },
  getUserInfo(event) {
    console.log(event.detail);
  },
  formatDate(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
});