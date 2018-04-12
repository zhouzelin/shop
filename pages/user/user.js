//user.js
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {}
    },
    onLoad() {
        this.setData({
            userInfo: app.globalData.userInfo
        })
        console.log(app.globalData.userInfo);
    },
    openScan() {
        wx.scanCode({
            success: (res) => {
                console.log(res)
            }
        })
    },
    openMap() {
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                wx.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    scale: 28
                })
            }
        })
    },
    makeCall() {
        wx.makePhoneCall({
            phoneNumber: '13751876592' //仅为示例，并非真实的电话号码
        })
    }
})
