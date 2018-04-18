// searchMore.js
const utils = require('../../utils/util');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
    key: 'QLIBZ-4SRKX-VZ54Z-ZYLR4-GJOSO-K7BYQ'
});

Page({
    data: {
        latitude: 0,
        longitude: 0,
        nearByList: [],
        address: '',
        keyword: '',
        tips: "",
        hasMore: true,
        pageIndex: 1,
        toView: 'first'
    },
    onLoad(options) {
        this.setData({
            latitude: options.latitude,
            longitude: options.longitude
        })
    },
    geocoder() {
        let self = this;
        let address = self.data.address;
        let options = { address }

        new Promise((resolve, reject) => {
            options.success = x => resolve(x) // 成功
            options.fail = x => reject(x) // 失败
            qqmapsdk.geocoder(options)
        }).then(res => {
            let longitude = res.result.location.lng;
            let latitude = res.result.location.lat;
            self.setData({ longitude, latitude });

            self.searchByKey();

        }).catch(res => {
            wx.showToast({
                title: res.message,
                icon: 'none'
            })
        })
    },
    searchByKey() {

        if (!this.data.hasMore && this.data.pageIndex != 1) {
            return false
        }

        wx.showLoading({
            title: '稍等一下',
            mask: true
        });
        let self = this;
        let options = {
            location: {
                latitude: self.data.latitude,
                longitude: self.data.longitude
            },
            keyword: self.data.keyword,
            page_index: self.data.pageIndex
        }
        new Promise((resolve, reject) => {
            options.success = x => resolve(x) // 成功
            options.fail = x => reject(x) // 失败
            qqmapsdk.search(options)
        }).then(res => {
            let pageIndex = self.data.pageIndex;
            let nearByList;
            if (pageIndex == 1) {
                nearByList = res.data;
            } else {
                nearByList = self.data.nearByList.concat(res.data)
            }
            if (res.data.length >= 10) {
                self.setData({
                    nearByList,
                    tips: '下拉获取更多数据',
                    hasMore: true
                });
            } else {
                self.setData({
                    nearByList,
                    tips: '没有更多数据了',
                    hasMore: false
                });
            }
            wx.hideLoading();
        }).catch(res => {
            self.setData({
                nearByList: []
            });
            wx.showToast({
                title: res.message,
                icon: 'none'
            })
        })
    },
    handleInput(event) {
        let name = event.currentTarget.dataset.name;
        let value = event.detail.value;
        if (name == "address") {
            this.setData({
                address: value
            })
        } else if (name == "keyword") {
            this.setData({
                keyword: value
            })
        }
    },
    tapSearch() {
        let address = this.data.address;
        let keyword = this.data.keyword;
        if (address == "") {
            this.searchByKey();
        } else {
            this.geocoder();
        }
    },
    openLocation(event) {
        let self = this;
        let info = event.currentTarget.dataset.info;
        let options = {
            latitude: info.location.lat,
            longitude: info.location.lng,
            name: info.title,
            address: info.address
        }
        let openLocation = utils.wxPromisify(wx.openLocation);
        openLocation(options)
            .then(res => {
                wx.showToast({
                    title: res.errMsg,
                    icon: 'success'
                })
            })
            .catch(res => {
                wx.showToast({
                    title: res.errMsg,
                    icon: 'none'
                })
            })
    },
    loadMore() {
        this.setData({
            pageIndex: this.data.pageIndex + 1
        })
        this.searchByKey();
    }
})