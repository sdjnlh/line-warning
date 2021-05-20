//writeing.js
//获取应用实例
import Notify from "../../path/to/@vant/weapp/dist/notify/notify";

const app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        warning: { name: '', type: '', address: '', shijian: '', content: '' },
        name: '',
        address: '',
        content: '',
        show: false,
        login: false,
        active: 2,
        items: [],
        searchVal: '',
        errMsg: '',
        minDate: new Date(2010, 1, 1),
        maxDate: new Date(2030, 12, 31),
        pickerShow: false,
        columns: ['线路火情', '护网进人', '危行案件']
    },
    onLoad() {
        // 云数据
        // if (!app.globalData.openid) {
        //     Notify({ type: 'danger', message: '请先进行微信授权!', selector: '#van-notify', })
        //     return
        // }
        // wx.getUserInfo({
        //     success: res => {
        //         console.log(res.userInfo)
        //     }
        // })
    },
    onSearch(event) {
        if (this.searchVal === undefined) {
            this.searchVal = ''
        }
        this.searchVaal = event.detail
        db.collection('warning').where({ dtd: false, name: { $regex: '.*' + this.searchVal, $options: 'i' } }).get().then(res => {
            console.log('所有的数据是：', res.data)
            let data = res.data
            this.setData({ items: data })
        })
    },
    getUserInfo(event) {
        console.log(event.detail);
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
    onChangeName(event) {
        if (event.detail === '') {
            this.setData({ errMsg: '不能为空' });
        } else {
            this.setData({ errMsg: '' });
            this.setData({ name: event.detail })
        }
    },
    onChangeAddress(event) {
        this.setData({ address: event.detail })
    },
    onChangeContent(event) {
        this.setData({ content: event.detail })
    },
    showCalendar() {
        this.setData({ show: true });
    },
    onClose() {
        this.setData({ show: false });
    },
    formatDate(date) {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(event) {
        this.setData({ show: false })
        let chooseDate = new Date(event.detail)
        let shijian = this.formatDate(chooseDate)
        let type = this.data.warning.type
        this.setData({ warning: { shijian: shijian, type: type } })
    },
    showPicker() {
        this.setData({ pickerShow: true })
    },
    closePicker() {
        this.setData({ pickerShow: false })
    },
    onCheckPicker(event) {
        this.setData({ pickerShow: false })
        let type = event.detail.value
        this.setData({ warning: { type: type } })
    },
    onClearWarning(event) {
        console.log('this.warning is:' + this.data.warning)
        this.setData({ warning: { type: '', shijian: '' } })
        this.setData({name: ''})
        this.setData({address: ''})
        this.setData({content: ''})
    },
    onSubmitWarning() {
        this.setData({ warning: { name: this.data.name, address: this.data.address, content: this.data.content, type: this.data.warning.type, shijian: this.data.warning.shijian } })
        if (!app.globalData.openid) {
            Notify({ type: 'danger', message: '请先进行微信授权!', selector: '#van-notify', })
            return
        }
        db.collection('warning').add({
            data: {
                name: this.data.name,
                type: this.data.warning.type,
                address: this.data.warning.address,
                content: this.data.warning.content,
                shijian: new Date(this.data.warning.shijian),
                timeNum: new Date(this.data.warning.shijian).getTime(),
                dtd: false,
                crt: new Date(),
                lut: new Date()
            },
            success(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                wx.redirectTo({
                    url: '/pages/index/index',
                })
            }
        })
    }
});