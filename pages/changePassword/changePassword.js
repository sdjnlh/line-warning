// pages/changePassword/changePassword.js
import Notify from "../../path/to/@vant/weapp/dist/notify/notify";

const app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  //获取应用实例

  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onChangePassword(e) {
    if (e.currentTarget.id === 'oldPassword') {
      this.setData({oldPassword: e.detail})
    }else if (e.currentTarget.id === 'newPassword') {
      this.setData({newPassword: e.detail})
    }else if (e.currentTarget.id === 'confirmPassword') {
      this.setData({confirmPassword: e.detail})
    }
  },
  handleChangePas() {
    //如果新密码和确实密码输入的不一致，提示
    if (this.data.newPassword !== this.data.confirmPassword) {
      Notify({ type: 'danger', message: '两次输入密码不一致!', selector: '#van-notify', })
      return
    }
    console.log('修改密码的用户为：'+ app.globalData.userId)
    db.collection('user').where({
      dtd: false,
      _id: app.globalData.userId
    }).orderBy('crt', 'desc').get().then(res => {
      let data = res.data
      if (data.length >= 1) {
        let user = data[0]
        if (user.password !== this.data.oldPassword) {
          Notify({ type: 'danger', message: '旧密码错误，请确认后再次尝试!', selector: '#van-notify', })
          return
        }
        db.collection('user').where({ dtd: false,_id: app.globalData.userId}).
        update({
          data: {
            password: this.data.newPassword,
            lut: new Date()
          }
        }).then(res => {
          Notify({ type: 'success', message: '密码修改成功！', selector: '#van-notify', })
          wx.redirectTo({
            url: '/pages/mine/mine',
          })
        })
      }else {
        Notify({ type: 'warning', message: '出现了一点小错误，请联系管理员:(', selector: '#van-notify', })
        return;
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let cache = wx.getStorageSync('user')
    this.setData({
      user: cache
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})