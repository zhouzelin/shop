/*goWhere.js*/
const utils = require('../../utils/util');
const near = require('../../utils/near-data-list');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
    key: 'QLIBZ-4SRKX-VZ54Z-ZYLR4-GJOSO-K7BYQ'
});

Page({
    data: {
        nav: [],
        category: [],
        selectedIndex: 0,
        selectIedCIndex: 0,
        location: {},
        latitude: 0,
        longitude: 0,
        keyword: '',
        pageIndex: 1,
        nearByList: [],
        tips: '',
        loading: true,
        hasMore: true
    },
    onReady() {
        let nav = near.data;
        this.setData({
            nav: nav,
            category: nav[0].children,
            keyword: nav[0].children[0].name
        })
        this.getLocation();
    },
    selectIndex(event) {
        let selectedIndex = event.currentTarget.dataset.index;
        let selectIedCIndex = 0;
        let nav = this.data.nav;
        this.setData({
            selectedIndex: selectedIndex,
            category: nav[selectedIndex].children,
            selectIedCIndex: selectIedCIndex,
            keyword: nav[selectedIndex].children[selectIedCIndex].name,
            pageIndex: 1,
            toView: 'view' + nav[selectedIndex].children[selectIedCIndex].id,
            toView2: 'first'
        })
        this.searchByKey()
    },
    selectCIndex(event) {
        let selectIedCIndex = event.currentTarget.dataset.index;
        let selectedIndex = this.data.selectedIndex;
        let nav = this.data.nav;
        this.setData({
            selectIedCIndex: selectIedCIndex,
            keyword: nav[selectedIndex].children[selectIedCIndex].name,
            pageIndex: 1,
            toView2: 'first'
        })
        this.searchByKey()
    },
    getLocation() {
        let self = this;
        let getLocation = utils.wxPromisify(wx.getLocation);
        getLocation({ type: 'gcj02' })
            .then(res => {
                return self.reverseGeocoder(res);
            })
            .then(res => {
                let location = res.result.address_component;
                self.setData({ location });
                self.searchByKey();
            })
            .catch((x) => {
                console.log(x);
            })
    },
    chooseLocation() {
        let self = this;
        let chooseLocation = utils.wxPromisify(wx.chooseLocation);
        chooseLocation()
            .then(res => {
                return self.reverseGeocoder(res);
            })
            .then(res => {
                let location = res.result.address_component;
                self.setData({ location });
                self.searchByKey()
            })
            .catch(res => {
                console.log(res);
            })
    },
    reverseGeocoder(res) {
        let self = this;
        let options = {
            location: {
                latitude: res.latitude,
                longitude: res.longitude
            }
        }
        this.setData({
            latitude: res.latitude,
            longitude: res.longitude
        });
        return new Promise((resolve, reject) => {
            options.success = x => resolve(x) // 成功
            options.fail = x => reject(x) // 失败
            qqmapsdk.reverseGeocoder(options)
        })
    },
    searchByKey() {

        if (!this.data.hasMore && this.data.pageIndex != 1) {
            return false;
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
            wx.showToast({
                title: res.message,
                icon: 'none'
            })
        })
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
    },
    gotoPage(event) {
        let page = event.currentTarget.dataset.page;
        let param = {
            latitude: this.data.latitude,
            longitude: this.data.longitude
        }
        utils.gotoPage(page, param);
    }
})