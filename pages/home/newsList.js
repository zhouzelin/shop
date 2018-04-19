/*newsList.js*/
const utils = require("../../utils/util");
const nav = require("../../utils/news-data-list");

Page({
    data: {
        nav: [],
        selectedIndex: 0,
        tag: '__all__',
        newData: [],
        toView: '',
        time: 0
    },
    onReady() {
        let time = new Date().getTime();
        this.setData({
            nav: nav.news,
            time
        })
        this.getNews();
    },
    selectIndex(event) {
        let selectedIndex = event.currentTarget.dataset.index;
        let tag = event.currentTarget.dataset.tag;
        this.setData({
            selectedIndex: selectedIndex,
            tag,
            pageIndex: 1,
        })
        this.getNews()
    },
    getNews() {
        wx.showLoading({
            title: '稍等一下',
            mask: true
        });
        let url = 'https://m.toutiao.com/list/';
        let data = {
            tag: this.data.tag,
            ac: "wap",
            count: 20,
            format: "json_raw",
            as: "A1851A0D60A247F",
            cp: "5AD01254474F2E1",
            min_behot_time: this.data.time,
            i: this.data.time
        }
        let self = this;
        utils.get(url, data).
            then(res => {
                console.log(res.data);
                self.setData({
                    newData: res.data.data
                })
                wx.hideLoading();
            }).
            catch(res => {
                console.log(res);
            })
    },
    gotoNesDtail(event) {
        let dataset = event.currentTarget.dataset;
        utils.gotoPage('newDetail', { url: dataset.url });
    },
    loadMore() {
        let time = new Date().getTime();
        this.setData({ time });
        this.getNews();
    }
})