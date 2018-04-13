//index.js
//获取应用实例
const utils = require('../../utils/util');
const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    newData: {},
    loading: true
  },
  onLoad() {

  },
  onReady() {
    this.getNews();
  },
  gotoEatWhat() {
    let url = 'eatWhat';
    utils.gotoPage(url);
  },
  onPullDownRefresh: function () {
    this.setData({
      loading: true
    })
    this.getNews(function(){
      wx.stopPullDownRefresh();
    })
  },
  getNews(callback) {
    let url = 'https://m.toutiao.com/list/';
    let data = {
      tag: "__all__",
      ac: "wap",
      count: 20,
      format: "json_raw",
      as: "A1851A0D60A247F",
      cp: "5AD01254474F2E1",
      min_behot_time: "1523589968",
      i: "1523589968"
    }
    let self = this;
    utils.get(url, data).
      then(res => {
        console.log(res.data);
        self.setData({
          newData: res.data.data
        })
        if(callback) {
          callback()
        }
        this.setData({
          loading: false
        })
      }).
      catch(res => {
        console.log(res);
      })
  },
  gotoNesDtail(event) {
    let dataset = event.currentTarget.dataset;
    utils.gotoPage('newDetail', { url: dataset.url });
  }
})
