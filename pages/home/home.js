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
    loading: true,
    weather: {}
  },
  onLoad() {

  },
  onReady() {
    let self = this;
    this.getNews();
    this.getLocation()
  },
  gotoEatWhat() {
    let url = 'eatWhat';
    utils.gotoPage(url);
  },
  onPullDownRefresh: function () {
    this.setData({
      loading: true
    })
    this.getNews(function () {
      wx.stopPullDownRefresh();
    })
  },
  getLocation() {
    let self = this;
    let getLocation = utils.wxPromisify(wx.getLocation);
    getLocation({ type: 'wgs84' })
      .then(res => {

        let qqmapsdk = new QQMapWX({
          key: 'QLIBZ-4SRKX-VZ54Z-ZYLR4-GJOSO-K7BYQ'
        });

        let options = {
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            let detail = res.result.address_component;
            let url = "https://wis.qq.com/weather/common";
            let data = {
              source: 'xw',
              weather_type: "forecast_1h",
              province: detail.province,
              city: detail.city,
              county: detail.district
            }

            utils.get(url,data)
            .then(res =>{
              console.log(res.data.data.forecast_1h[1])
              let weather = res.data.data.forecast_1h[1];
              weather.city = data.city;
              weather.county = data.county;
              weather.image = `https://mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${weather.weather_code}.png`
              weather.update_time = utils.formatDate(new Date());
              self.setData({
                weather: weather
              })
            })
          }
        }
        // 地址逆解析
        qqmapsdk.reverseGeocoder(options);

      })
      .catch((x)=>{
        console.log(x);
      })
  },
  getweather(res) {
    console.log(res);
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
