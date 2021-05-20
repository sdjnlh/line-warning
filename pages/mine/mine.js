// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  //获取应用实例

  data: {
    active: 3,
    avatarUrl: './user-unlogin.png',
    show: false,
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },
  tocart(){
    wx.navigateTo({
      url: '/pages/myWarning/myWarning',
    })
  },
  toorder() {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

  },
  bindGetUserInfo(e) {
    console.log('云开发登录')
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  toChangePassword() {
    wx.navigateTo({
      url: '/pages/changePassword/changePassword',
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
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    let pages = [
      '/pages/index/index',
      '/pages/screen/screen',
      '/pages/writeing/writeing',
      '/pages/mine/mine'
    ]
    if (event.detail === 1) {
      wx.redirectTo({
        url: pages[event.detail],
      })
    } else {
      this.setData({
        active: event.detail
      });
      wx.reLaunch({
        url: pages[event.detail],
      })
    }
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