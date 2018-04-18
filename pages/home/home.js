//index.js
//获取应用实例
const utils = require('../../utils/util');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
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
    weather: {}
  },
  onReady() {
    let self = this;
    this.getNews();
    this.getWeather()
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '稍等一下',
      mask: true
    });
    this.getNews(function () {
      wx.stopPullDownRefresh();
    })
  },
  getWeather() {
    let self = this;
    let getLocation = utils.wxPromisify(wx.getLocation);
    let data;
    getLocation({ type: 'gcj02' })
      .then(res => {
        let options = {
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        }
        return new Promise((resolve, reject) => resolve(options))
      })
      .then(res => {
        return new Promise((resolve, reject) => {
          res.success = x => resolve(x) // 成功
          res.fail = x => reject(x) // 失败
          let qqmapsdk = new QQMapWX({
            key: 'QLIBZ-4SRKX-VZ54Z-ZYLR4-GJOSO-K7BYQ'
          });
          qqmapsdk.reverseGeocoder(res)
        })
      })
      .then(res => {
        let detail = res.result.address_component;
        let url = "https://wis.qq.com/weather/common";
        data = {
          source: 'xw',
          weather_type: "forecast_24h",
          province: detail.province,
          city: detail.city,
          county: detail.district
        }
        return utils.get(url, data)
      })
      .then(res => {
        console.log(res.data.data.forecast_24h[1])
        let weather = res.data.data.forecast_24h[1];
        weather.city = data.city;
        weather.county = data.county;
        let current_hour = new Date().getHours();
        if (current_hour < 18) {
          weather.image = `https://mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${weather.day_weather_code}.png`
        } else {
          weather.image = `https://mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/${weather.night_weather_code}.png`
        }

        self.setData({
          weather: weather,
          current_hour: current_hour
        })
      })
      .catch((x) => {
        console.log(x);
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
        if (callback) {
          callback()
        }
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
  gotoPage(event) {
    let page = event.currentTarget.dataset.page;
    utils.gotoPage(page);
  }
})
