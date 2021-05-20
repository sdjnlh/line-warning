//app.js
App({
  onLaunch: function () {
      if(!wx.cloud){
        console.error('请使用2.2.3或以上的基础库使用云能力')
      }else{
        wx.cloud.init({
          env:'mt-zy7xz',
          traceUser:true
        })
      }
  },
  globalData: {
    userInfo: null,
    baseUrl:'http://localhost:8888/api/v1',
    userId: ''
  }
})