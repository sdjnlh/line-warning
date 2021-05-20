//warningEdit.js
//获取应用实例
import Notify from "../../path/to/@vant/weapp/dist/notify/notify";
const app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        warning: {},
        warningId: '',
        warningTime: '',
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
        // console.log(JSON.stringify(this.options.warning))
        // this.setData({warning: this.options.warning})
        db.collection('warning').where({ dtd: false, _id: this.options.warningId }).get().then(res => {
            let data = []
            data = res.data
            if (data.length >= 0) {
                this.setData({warningTime: data[0].shijian})
                let shijian = this.formatDate(data[0].shijian)
                data[0].shijian = shijian
                this.setData({ warning: data[0] })
                this.setData({ warningId: data[0]._id })
                this.data.columns.forEach(item=>{
                    if (item === this.data.warning.type) {
                        const picker = this.selectComponent('.labelPicker') // 获取组件实例
                        picker.setColumnIndex(0, this.data.columns.indexOf(item))
                    }
                })
            }
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
            wx.navigateTo({
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
            this.data.warning.name = event.detail
        }
    },
    onChangeAddress(event) {
        // this.setData({ address: event.detail })
        this.data.warning.address = event.detail
    },
    onChangeContent(event) {
        // this.setData({ content: event.detail })
        this.data.warning.content = event.detail
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
        let name = this.data.warning.name
        let address = this.data.warning.address
        let content = this.data.warning.content
        this.setData({ warning: { shijian: shijian, type: type,name: name, address: address, content: content } })
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
        let shijian = this.data.warning.shijian
        let name = this.data.warning.name
        let address = this.data.warning.address
        let content = this.data.warning.content
        this.setData({ warning: { type: type,shijian: shijian, name: name, address: address, content: content} })
    },
    onClearWarning(event) {
        console.log('this.warning is:' + this.data.warning)
        this.setData({ warning: { name: '', type: '', address: '', shijian: '', content: '' } })
    },
    onSubmitWarning() {
        let id = this.data.warningId
        if (!app.globalData.openid) {
            Notify({ type: 'danger', message: '请先进行微信授权!', selector: '#van-notify', })
            return
        }
        db.collection('warning').where({ dtd: false,_id: id}).
        update({
            data: {
                name: this.data.warning.name,
                type: this.data.warning.type,
                address: this.data.warning.address,
                content: this.data.warning.content,
                shijian: new Date(this.data.warning.shijian),
                timeNum: new Date(this.data.warning.shijian).getTime(),
                lut: new Date()
            }
        }).then(res => {
            wx.redirectTo({
                url: '/pages/myWarning/myWarning',
            })
        })
    }
});