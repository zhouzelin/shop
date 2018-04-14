//user.js
//获取应用实例
const utils = require('../../utils/util');
const WxParse = require('../../wxParse/wxParse');
const app = getApp();

Page({
    data: {
        url: '',
        content: "",
        detail: {},
        loading: true
    },
    onLoad(options) {
        let url = options.url;
        this.setData({
            url: url
        })
    },
    onReady() {
        this.getData() 
    },
    getData() {
        let url = `https://m.toutiao.com/i${this.data.url}/info/`
        console.log(url)
        var data = {
            i:this.data.url
        }
        utils.get(url,data).
        then(res => {
            let detail = res.data.data;
            detail.publish_time = utils.formatDate(detail.publish_time*1000,"YYYY年MM月DD日 hh:mm");
            wx.setNavigationBarTitle({
                title: detail.title
            })
            this.setData({
                content: WxParse.wxParse('content', 'html', detail.content.replace("视频加载中...",""), this),
                detail: detail,
                loading: false
            })
        })
    }
})
