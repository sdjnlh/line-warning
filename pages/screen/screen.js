//screen.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    order: {
      total: 0
    },
    options: [
      { value: '线路火情', label: '线路火情' },
      { value: '护网进人', label: '护网进人' },
      { value: '危行案件', label: '危行案件' }
    ],
    activeType: '线路火情',
    show: true,
    login: false,
    items: [],
    screenValue: '',
    active: 1,
    timeFilter: [
      { text: '请选择', value: 0 },
      { text: '过去五年今日', value: 1 },
      { text: '过去五年本周', value: 2 },
      { text: '过去五年本月', value: 3 },
    ],
    defaultTime: 0,
    skip: 0,
    limit: 10,
    total: 0
  },
  toDetailPage(event) {
    wx.navigateTo({
      url: '/pages/warningDetail/detail?warningId='+ event.currentTarget.id,
    })
  },
  onReachBottom: function () {
    if (this.data.skip > this.data.total) {
      console.log('上拉数据加载完了')
    } else {
      this.setData({skip: this.data.skip + 1})
      if(this.screenValue && this.screenValue !=='') {
        let param = {detail: this.screenValue}
        this.onSearch(param)
      }else {
        this.onLoad()
      }
    }
  },
  onLoad() {
    // 云数据
    if (this.activeType === undefined) {
      this.activeType = '线路火情'
    }
    //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
    db.collection('warning').where({
      dtd: false,
      type: this.activeType
    }).count().then(res => {
      console.log('数据库中的记录总数为：' + res.total)
      let total = Math.ceil(res.total / this.data.limit)
      this.data.total = total
    })
    db.collection('warning').where({ dtd: false, type: this.activeType }).skip(this.data.skip).limit(this.data.limit).orderBy('crt', 'desc').get().then(res => {
      let data = res.data
      if (this.data.skip > 0) {
        //如果分页大于0
        if (this.data.skip > this.data.total) {
          console.log('上拉数据加载完了')
        } else {
          let items = this.data.items
          items.push.apply(items, data)
          this.setData({items: items})
          console.log('所有数据条数为：' + this.data.items.length)
        }
      } else {
        this.setData({items: data})
      }
    })
  },
  onSearch(event) {
    //查询之前先把页数置0
    this.setData({skip: 0})
    if (this.screenValue === undefined) {
      this.screenValue = ''
    }
    this.screenValue = event.detail
    //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
    db.collection('warning').where({
      dtd: false,
      name: { $regex: '.*' + this.screenValue, $options: 'i'},
      type: this.activeType
      }).count().then(res => {
      let total = Math.ceil(res.total / this.data.limit)
      this.data.total = total
    })
    db.collection('warning').where({ dtd: false, name: { $regex: '.*' + this.screenValue, $options: 'i' }, type: this.activeType }).get().then(res => {
      let data = res.data
      // this.setData({ items: data })
      if (this.data.skip > 0) {
        //如果分页大于0
        if (this.data.skip > this.data.total) {
          console.log('上拉数据加载完了')
        } else {
          let items = this.data.items
          items.push.apply(items, data)
          this.setData({items: items})
          console.log('所有数据条数为：' + this.data.items.length)
        }
      } else {
        this.setData({items: data})
      }
    })
  },
  onChangeTabs(event) {
    this.activeType = event.detail.name
    this.onLoad()
  },
  toShop() {
    wx.navigateTo({
      url: '/pages/shop/shop',
    })
  },
  toAll() {
    wx.navigateTo({
      url: '/pages/all/all',
    })
  },
  getUserInfo(event) {
    console.log(event.detail);
  },

  onClose() {
    this.setData({
      close: false
    });
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
  doHandleMonth(month) {
    let m = month
    if (month.toString().length == 1) {
      m = '0' + month
    }
    return m
  },
  getWeek(day) {
    let today = new Date()
    let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
    today.setTime(targetday_milliseconds)
    let tYear = today.getFullYear()
    let tMonth = today.getMonth()
    let tDate = today.getDate()
    tMonth = this.doHandleMonth(tMonth + 1)
    tDate = this.doHandleMonth(tDate)
    return '/' + tMonth + '/' + tDate
  },
  onChangeTimeFilter(event) {
    const _ = db.command
    let filter = event.detail
    let today = new Date()
    let year = today.getFullYear()
    let fiveYear = year - 4
    let fourYear = year -3
    let threeYear = year -2
    let twoYear = year - 1
    let oneYear = year - 0

    let month = today.getMonth() + 1
    let day = today.getDate()
    let five = fiveYear + '/' + month + '/' + day
    let four = fourYear + '/' + month + '/' + day
    let three = threeYear + '/' + month + '/' + day
    let two = twoYear + '/' + month + '/' + day
    let one = oneYear + '/' + month + '/' + day
    //如果 filter == 1 选中过去5年今日，计算需要筛选的日期
    if (filter == 0) {
      this.onLoad()
    } else if (filter === 1) {
      let fiveDate = new Date(five).getTime()
      let fourDate = new Date(four).getTime()
      let threeDate = new Date(three).getTime()
      let twoDate = new Date(two).getTime()
      let oneDate = new Date(one).getTime()
      db.collection('warning').where({
        timeNum: _.or([_.eq(fiveDate),_.eq(fourDate),_.eq(threeDate),_.eq(twoDate),_.eq(oneDate)])
      }).get().then(res => {
        let data = res.data
        this.setData({ items: data })
      })
    }else if (filter === 2) {
      let week = this.getWeek(-6)
      //获取过去5年一周之前的日期
      let fiveStart = fiveYear + week
      let fourStart = fourYear +  week
      let threeStart = threeYear + week
      let twoStart = twoYear + week
      let oneStart = oneYear + week
      let fiveStartDate = new Date(fiveStart).getTime()
      let fourStartDate = new Date(fourStart).getTime()
      let threeStartDate = new Date(threeStart).getTime()
      let twoStartDate = new Date(twoStart).getTime()
      let oneStartDate = new Date(oneStart).getTime()
      //获取过去五年今日的日期
      let fiveEndDate = new Date(five).getTime()
      let fourEndDate = new Date(four).getTime()
      let threeEndDate = new Date(three).getTime()
      let twoEndDate = new Date(two).getTime()
      let oneEndDate = new Date(one).getTime()
      db.collection('warning').where({
            timeNum: _.or([
              _.and(_.gte(fiveStartDate), _.lte(fiveEndDate)),
              _.and(_.gte(fourStartDate), _.lte(fourEndDate)),
              _.and(_.gte(threeStartDate), _.lte(threeEndDate)),
              _.and(_.gte(twoStartDate), _.lte(twoEndDate)),
              _.and(_.gte(oneStartDate), _.lte(oneEndDate))
            ])
          }
      ).get().then(res => {
        let data = res.data
        console.log('筛选数据是：'+ JSON.stringify(data))
        this.setData({ items: data })
      })
    }else if (filter == 3) {
      //计算过去五年本月的开始日期
      let fiveStart = fiveYear + '/' + month + '/01'
      let fourStart = fourYear + '/' + month + '/01'
      let threeStart = threeYear + '/' + month + '/01'
      let twoStart = twoYear + '/' + month + '/01'
      let oneStart = oneYear + '/' + month + '/01'
      let fiveStartDate = new Date(fiveStart).getTime()
      let fourStartDate = new Date(fourStart).getTime()
      let threeStartDate = new Date(threeStart).getTime()
      let twoStartDate = new Date(twoStart).getTime()
      let oneStartDate = new Date(oneStart).getTime()
      let fiveEnd = fiveYear + '/' + month + '/'
      let fourEnd = fourYear + '/' + month + '/'
      let threeEnd = threeYear + '/' + month + '/'
      let twoEnd = twoYear + '/' + month + '/'
      let oneEnd = oneYear + '/' + month + '/'
      //计算过去五年本月的结束日期（分四种情况：30天, 31天，28天， 29天）
      //如果本月是二月，要计算是否闰年，来判断是28天还是29天
      if (month === 2) {
        let fiveDayNum = new Date(fiveYear,2,0).getDate()
        let fourDayNum = new Date(fourYear,2,0).getDate()
        let threeDayNum = new Date(threeYear,2,0).getDate()
        let twoDayNum = new Date(twoYear,2,0).getDate()
        let oneDayNum = new Date(oneYear,2,0).getDate()
        fiveEnd = fiveEnd + fiveDayNum
        fourEnd = fourEnd + fourDayNum
        threeEnd = threeEnd + threeDayNum
        twoEnd = twoEnd + twoDayNum
        oneEnd = oneEnd + oneDayNum
      }else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12 ) {
        fiveEnd = fiveEnd + '31'
        fourEnd = fourEnd + '31'
        threeEnd = threeEnd + '31'
        twoEnd = twoEnd + '31'
        oneEnd = oneEnd + '31'
      }else if (month === 4 || month === 6 || month === 9 || month === 11){
        fiveEnd = fiveEnd + '30'
        fourEnd = fourEnd + '30'
        threeEnd = threeEnd + '30'
        twoEnd = twoEnd + '30'
        oneEnd = oneEnd + '30'
      }
      let fiveEndDate = new Date(fiveEnd).getTime()
      let fourEndDate = new Date(fourEnd).getTime()
      let threeEndDate = new Date(threeEnd).getTime()
      let twoEndDate = new Date(twoEnd).getTime()
      let oneEndDate = new Date(oneEnd).getTime()
      db.collection('warning').where({
            timeNum: _.or([
              _.and(_.gte(fiveStartDate), _.lte(fiveEndDate)),
              _.and(_.gte(fourStartDate), _.lte(fourEndDate)),
              _.and(_.gte(threeStartDate), _.lte(threeEndDate)),
              _.and(_.gte(twoStartDate), _.lte(twoEndDate)),
              _.and(_.gte(oneStartDate), _.lte(oneEndDate))
            ])
          }
      ).get().then(res => {
        let data = res.data
        console.log('筛选数据是：'+ JSON.stringify(data))
        this.setData({ items: data })
      })
    }
  }
});