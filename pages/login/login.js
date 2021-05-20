// pages/mine/mine.js
const app = getApp();
const db = wx.cloud.database()
import Notify from "../../path/to/@vant/weapp/dist/notify/notify";
Page({

  /**
   * 页面的初始数据
   */
  //获取应用实例

  data: {
    username: '',
    password: '',
    active: 3,
    avatarUrl: 'https://6d74-mt-zy7xz-1301932262.tcb.qcloud.la/user-logo.jpg?sign=de21e85f1bca5b08b0d33e4ab9edc9ad&t=1610333080',
    show: false,
    userInfo: {},
    logged: false,
    loginUser:[]
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
                userInfo: res.userInfo,
                username: res.userInfo.nickName
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
  handleLoginToIndex() {
    if (!app.globalData.openid) {
      Notify({ type: 'danger', message: '请先进行微信授权!', selector: '#van-notify', })
      return
    }
    db.collection('user').where({
      dtd: false,
      username: this.data.username,
      password: this.data.password
    }).orderBy('crt', 'desc').get().then(res => {
      let data = res.data
      if (data.length >= 1) {
        wx.redirectTo({
          url: '/pages/index/index',
        })
        let userMessage = data[0]
        app.globalData.userId = userMessage._id
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            break
          }else {
            db.collection('user').where({ dtd: false,_id: data[i]._id}).
            update({
              data: {
               dtd: true,
               lut: new Date()
              }
            }).then(res => {
              console.log('delete old user success!')
            })
          }
        }
      }else {
        Notify({ type: 'danger', message: '用户名或密码错误!', selector: '#van-notify', })
        return
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
    //授权登录之后，首先根据用户名判断是否存在，如果存在就不用再添加，否则增加一条数据，username/nickname = 用户的微信昵称,密码默认 ’111111‘
    db.collection('user').where({dtd: false,username: e.detail.userInfo.nickName}).get().then(res=>{
      let data = res.data
      if (data.length <=0) {
        db.collection('user').add({
          data: {
            username: this.data.userInfo.nickName,
            nickname: this.data.userInfo.nickName,
            dtd: false,
            crt: new Date(),
            lut: new Date(),
            password: '111111'
          },
          success(res) {}
        })
      }
      //添加数据之后将用户名默认填到对应位置
      this.setData({username: e.detail.userInfo.nickName})
    })
  },
  onChangeUsername(event) {
    let username = event.detail
    this.setData({username: username})
  },
  onChangePassword(event) {
    let password = event.detail
    this.setData({password: password})
  },
})