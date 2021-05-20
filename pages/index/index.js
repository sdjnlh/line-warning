//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        order: {
            total: 0
        },
        active: 0,
        show: true,
        login: false,
        items: [],
        searchVal: '',
        timeFilter: [
            {text: '请选择', value: 0},
            {text: '过去五年今日', value: 1},
            {text: '过去五年本周', value: 2},
            {text: '过去五年本月', value: 3},
        ],
        defaultTime: 0,
        timeSign: 0,
        startRange: [],
        endRange: [],
        skip: 0,
        limit: 10,
        total: 0,
        five: '',
        four: '',
        three: '',
        two: '',
        one: ''
    },
    onReachBottom: function () {
        if (this.data.skip > this.data.total) {
            console.log('上拉数据加载完了')
        } else {
            this.setData({skip: this.data.skip + 1})
            this.onLoad()
        }
    },
    onLoad() {
        // 云数据
        const _ = db.command
        if (this.searchVal !== '' && this.searchVal !== undefined) {
            if (this.data.timeSign > 0) {
                this.getTimeFilterStart(this.data.timeSign)
                if (this.data.timeSign === 1) {
                    //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                        {
                            timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                        },
                    ])).count().then(res => {
                        console.log('数据库中的记录总数为：' + res.total)
                        let total = Math.ceil(res.total / this.data.limit)
                        this.data.total = total
                    })
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                        {
                            timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                        },
                    ])).skip(this.data.skip).limit(this.data.limit).orderBy('crt', 'desc').get().then(res => {
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
                        // this.setData({items: data})
                    })
                }else if (this.data.timeSign === 2 || this.data.timeSign === 3) {
                    //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                        {
                            timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                        },
                    ])).count().then(res => {
                        console.log('数据库中的记录总数为：' + res.total)
                        let total = Math.ceil(res.total / this.data.limit)
                        this.data.total = total
                    })
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                        {
                            timeNum: _.or([
                                _.and(_.gte(this.data.startRange[0]), _.lte(this.data.endRange[0])),
                                _.and(_.gte(this.data.startRange[1]), _.lte(this.data.endRange[1])),
                                _.and(_.gte(this.data.startRange[2]), _.lte(this.data.endRange[2])),
                                _.and(_.gte(this.data.startRange[3]), _.lte(this.data.endRange[3])),
                                _.and(_.gte(this.data.startRange[4]), _.lte(this.data.endRange[4]))
                            ])
                        }
                    ])).skip(this.data.skip).limit(this.data.limit).orderBy('crt', 'desc').get().then(res => {
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
                        // this.setData({items: data})
                    })
                }
            }else {
                //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
                db.collection('warning').where({
                    dtd: false,
                    name: {$regex: '.*' + this.searchVal, $options: 'i'}
                }).count().then(res => {
                    console.log('数据库中的记录总数为：' + res.total)
                    let total = Math.ceil(res.total / this.data.limit)
                    this.data.total = total
                })
                db.collection('warning').where({
                    dtd: false,
                    name: {$regex: '.*' + this.searchVal, $options: 'i'}
                }).skip(this.data.skip).limit(this.data.limit).orderBy('crt', 'desc').get().then(res => {
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
                    // this.setData({items: data})
                })
            }
        } else {
            if (this.data.timeSign > 0) {
                this.getTimeFilterStart(this.data.timeSign)
                if (this.data.timeSign === 1) {
                    //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {
                            timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                        },
                    ])).count().then(res => {
                        console.log('数据库中的记录总数为：' + res.total)
                        let total = Math.ceil(res.total / this.data.limit)
                        this.data.total = total
                    })
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {
                            timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                        },
                    ])).skip(this.data.skip).limit(this.data.limit).orderBy('crt', 'desc').get().then(res => {
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
                        // this.setData({items: data})
                    })
                }else if (this.data.timeSign === 2 || this.data.timeSign === 3) {
                    //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                        {
                            timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                        },
                    ])).count().then(res => {
                        console.log('数据库中的记录总数为：' + res.total)
                        let total = Math.ceil(res.total / this.data.limit)
                        this.data.total = total
                    })
                    db.collection('warning').where(_.and([
                        {dtd: false},
                        {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                        {
                            timeNum: _.or([
                                _.and(_.gte(this.data.startRange[0]), _.lte(this.data.endRange[0])),
                                _.and(_.gte(this.data.startRange[1]), _.lte(this.data.endRange[1])),
                                _.and(_.gte(this.data.startRange[2]), _.lte(this.data.endRange[2])),
                                _.and(_.gte(this.data.startRange[3]), _.lte(this.data.endRange[3])),
                                _.and(_.gte(this.data.startRange[4]), _.lte(this.data.endRange[4]))
                            ])
                        }
                    ])).skip(this.data.skip).limit(this.data.limit).orderBy('crt', 'desc').get().then(res => {
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
                        // this.setData({items: data})
                    })
                }
            }else {
                //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
                db.collection('warning').where({
                    dtd: false,
                }).count().then(res => {
                    console.log('数据库中的记录总数为：' + res.total)
                    let total = Math.ceil(res.total / this.data.limit)
                    this.data.total = total
                })
                db.collection('warning').where({dtd: false}).orderBy('crt', 'desc').skip(this.data.skip).limit(this.data.limit).get().then(res => {
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
            }
            }
    },
    onSearch(event) {
        if (this.searchVal === undefined) {
            this.searchVal = ''
        }
        this.searchVal = event.detail
        if (this.data.timeSign > 0) {
            const _ = db.command
            this.getTimeFilterStart(this.data.timeSign)
            if (this.data.timeSign === 1) {
                db.collection('warning').where(_.and([
                    {dtd: false},
                    {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                    {
                        timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                    },
                ])).get().then(res => {
                    let data = res.data
                    this.setData({items: data})
                })
            } else if (this.data.timeSign === 2 || this.data.timeSign === 3) {
                db.collection('warning').where(_.and([
                    {dtd: false},
                    {name: {$regex: '.*' + this.searchVal, $options: 'i'}},
                    {
                        timeNum: _.or([
                            _.and(_.gte(this.data.startRange[0]), _.lte(this.data.endRange[0])),
                            _.and(_.gte(this.data.startRange[1]), _.lte(this.data.endRange[1])),
                            _.and(_.gte(this.data.startRange[2]), _.lte(this.data.endRange[2])),
                            _.and(_.gte(this.data.startRange[3]), _.lte(this.data.endRange[3])),
                            _.and(_.gte(this.data.startRange[4]), _.lte(this.data.endRange[4]))
                        ])
                    }
                ])).get().then(res => {
                    let data = res.data
                    this.setData({items: data})
                })
            }
        } else {
            db.collection('warning').where({
                dtd: false,
                name: {$regex: '.*' + this.searchVal, $options: 'i'}
            }).get().then(res => {
                let data = res.data
                this.setData({items: data})
            })
        }
    },
    toDetailPage(event) {
        wx.navigateTo({
            url: '/pages/warningDetail/detail?warningId=' + event.currentTarget.id,
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
        this.setData({
            active: event.detail
        });
        let pages = [
            '/pages/index/index',
            '/pages/screen/screen',
            '/pages/writeing/writeing',
            '/pages/mine/mine'
        ]
        wx.redirectTo({
            url: pages[event.detail],
        })
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
        this.setData({timeSign: event.detail})
        //如果 filter == 1 选中过去5年今日，计算需要筛选的日期
        this.getTimeFilterStart(filter)
        if (filter == 0) {
            this.onLoad()
        } else if (filter === 1) {
            if (this.data.searchVal !== '' && this.data.searchVal !== undefined) {
                db.collection('warning').where(_.and([
                    {
                        timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                    },
                    {
                        dtd: false
                    },
                    {
                        name: {$regex: '.*' + this.searchVal, $options: 'i'}
                    }
                ])).get().then(res => {
                    let data = res.data
                    this.setData({items: data})
                })
            } else {
                db.collection('warning').where(_.and([
                    {
                        timeNum: _.or([_.eq(this.data.startRange[0]), _.eq(this.data.startRange[1]), _.eq(this.data.startRange[2]), _.eq(this.data.startRange[3]), _.eq(this.data.startRange[4])])
                    },
                    {
                        dtd: false
                    }
                ])).get().then(res => {
                    let data = res.data
                    this.setData({items: data})
                })
            }
        } else if (filter === 2 || filter === 3) {
            if (this.searchVal !== '' && this.searchVal !== undefined) {
                db.collection('warning').where(_.and([
                    {
                        timeNum: _.or([
                            _.and(_.gte(this.data.startRange[0]), _.lte(this.data.endRange[0])),
                            _.and(_.gte(this.data.startRange[1]), _.lte(this.data.endRange[1])),
                            _.and(_.gte(this.data.startRange[2]), _.lte(this.data.endRange[2])),
                            _.and(_.gte(this.data.startRange[3]), _.lte(this.data.endRange[3])),
                            _.and(_.gte(this.data.startRange[4]), _.lte(this.data.endRange[4]))
                        ])
                    },
                    {
                        dtd: false
                    },
                    {
                        name: {$regex: '.*' + this.searchVal, $options: 'i'}
                    }])
                ).get().then(res => {
                    let data = res.data
                    this.setData({items: data})
                })
            } else {
                db.collection('warning').where(_.and([
                    {
                        timeNum: _.or([
                            _.and(_.gte(this.data.startRange[0]), _.lte(this.data.endRange[0])),
                            _.and(_.gte(this.data.startRange[1]), _.lte(this.data.endRange[1])),
                            _.and(_.gte(this.data.startRange[2]), _.lte(this.data.endRange[2])),
                            _.and(_.gte(this.data.startRange[3]), _.lte(this.data.endRange[3])),
                            _.and(_.gte(this.data.startRange[4]), _.lte(this.data.endRange[4]))
                        ])
                    },
                    {
                        dtd: false
                    }])
                ).get().then(res => {
                    let data = res.data
                    this.setData({items: data})
                })
            }
        }
    },
    getTimeFilterStart(signal) {
        let today = new Date()
        let year = today.getFullYear()
        let fiveYear = year - 4
        let fourYear = year - 3
        let threeYear = year - 2
        let twoYear = year - 1
        let oneYear = year - 0

        let month = today.getMonth() + 1
        let day = today.getDate()

        let five = fiveYear + '/' + month + '/' + day
        let four = fourYear + '/' + month + '/' + day
        let three = threeYear + '/' + month + '/' + day
        let two = twoYear + '/' + month + '/' + day
        let one = oneYear + '/' + month + '/' + day
        let fiveStartDate = new Date(five).getTime()
        let fourStartDate = new Date(four).getTime()
        let threeStartDate = new Date(three).getTime()
        let twoStartDate = new Date(two).getTime()
        let oneStartDate = new Date(one).getTime()
        this.setData({five: fiveStartDate})
        this.setData({four: fourStartDate})
        this.setData({three: threeStartDate})
        this.setData({two: twoStartDate})
        this.setData({one: oneStartDate})
        if (signal === 1) {
            this.setData({startRange: [fiveStartDate, fourStartDate, threeStartDate, twoStartDate, oneStartDate]})
        } else if (signal === 2) {
            let week = this.getWeek(-6)
            //获取过去5年一周之前的日期
            let fiveStart = fiveYear + week
            let fourStart = fourYear + week
            let threeStart = threeYear + week
            let twoStart = twoYear + week
            let oneStart = oneYear + week
            let fiveStartDate = new Date(fiveStart).getTime()
            let fourStartDate = new Date(fourStart).getTime()
            let threeStartDate = new Date(threeStart).getTime()
            let twoStartDate = new Date(twoStart).getTime()
            let oneStartDate = new Date(oneStart).getTime()
            this.setData({startRange: [fiveStartDate, fourStartDate, threeStartDate, twoStartDate, oneStartDate]})
            this.setData({endRange: [this.data.five, this.data.four, this.data.three, this.data.two, this.data.one]})
        } else if (signal === 3) {
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
                let fiveDayNum = new Date(fiveYear, 2, 0).getDate()
                let fourDayNum = new Date(fourYear, 2, 0).getDate()
                let threeDayNum = new Date(threeYear, 2, 0).getDate()
                let twoDayNum = new Date(twoYear, 2, 0).getDate()
                let oneDayNum = new Date(oneYear, 2, 0).getDate()
                fiveEnd = fiveEnd + fiveDayNum
                fourEnd = fourEnd + fourDayNum
                threeEnd = threeEnd + threeDayNum
                twoEnd = twoEnd + twoDayNum
                oneEnd = oneEnd + oneDayNum
            } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
                fiveEnd = fiveEnd + '31'
                fourEnd = fourEnd + '31'
                threeEnd = threeEnd + '31'
                twoEnd = twoEnd + '31'
                oneEnd = oneEnd + '31'
            } else if (month === 4 || month === 6 || month === 9 || month === 11) {
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
            this.setData({startRange: [fiveStartDate, fourStartDate, threeStartDate, twoStartDate, oneStartDate]})
            this.setData({endRange: [fiveEndDate, fourEndDate, threeEndDate, twoEndDate, oneEndDate]})
        }
    }
});