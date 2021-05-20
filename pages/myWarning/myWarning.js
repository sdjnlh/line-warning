//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
import Dialog from "../../path/to/@vant/weapp/dist/dialog/dialog";
import Notify from "../../path/to/@vant/weapp/dist/notify/notify";
Page({
    data: {
        show: true,
        items: [],
        activeName: '',
        warning: {},
        skip: 0,
        limit: 10,
        total: 0
    },
    onLoad() {
        // 云数据
        if (!app.globalData.openid) {
            Notify({type: 'danger', message: '请先进行微信授权!', selector: '#van-notify',})
            return
        }
        //查询数据库路预警总数，按照每页10条数据分页，耶尔算总页数
        db.collection('warning').where({
            dtd: false,
            _openid: app.globalData.openid
        }).count().then(res => {
            console.log('数据库中的记录总数为：' + res.total)
            let total = Math.ceil(res.total / this.data.limit)
            this.data.total = total
        })
        db.collection('warning').where({dtd: false,_openid: app.globalData.openid}).orderBy('crt', 'desc').skip(this.data.skip).limit(this.data.limit).get().then(res => {
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
    onReachBottom: function () {
        if (this.data.skip > this.data.total) {
            console.log('上拉数据加载完了')
        } else {
            this.setData({skip: this.data.skip + 1})
            console.log("下拉之后的分页：" + this.data.skip)
            this.onLoad()
        }
    },
    toDetailPage(event) {
        wx.navigateTo({
            url: '/pages/warningEdit/warningEdit?warningId=' + event.currentTarget.id,
        })
    },
    formatDate(date) {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    handleDeleteWarning(event) {
        let id = event.currentTarget.id
        Dialog.confirm({
            title: '删除提示',
            message: '确定要删除该条预警？'
        }).then(() => {
            // on confirm
            db.collection('warning').where({dtd: false, _openid: app.globalData.openid, _id: id}).update({
                data: {
                    dtd: true
                }
            }).then(res => {
                this.onLoad()
            })
        }).catch(() => {
            // on cancel
        });
    }
});