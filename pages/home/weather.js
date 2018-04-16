/*weather.js*/
var utils = require('../../utils/util');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

Page({
    data: {
        location: {},
        current: {},
        twoDays:[],
        current_hour: 0,
        allDay: [],
        air: {}
    },
    onLoad() {

    },
    onReady() {
        this.getWeather();
    },
    getWeather() {
        let self = this;
        let getLocation = utils.wxPromisify(wx.getLocation);
        let data;
        getLocation({ type: 'wgs84' })
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
                this.setData({
                    location: detail
                })
                let url = "https://wis.qq.com/weather/common";
                data = {
                    source: 'xw',
                    weather_type: "observe|forecast_1h|forecast_24h|air",
                    province: detail.province,
                    city: detail.city,
                    county: detail.district
                }
                utils.get(url, data).then(res => {
                    let current = res.data.data.observe;
                    let twoDays = [res.data.data.forecast_24h[1],res.data.data.forecast_24h[2]]
                    let current_hour = new Date().getHours();
                    let allDay = res.data.data.forecast_1h;
                    let air = res.data.data.air;
                    let currentDate = parseInt(utils.formatDate(new Date(),'YYYYMMDD'));
                    for(let key in allDay) {
                        if(allDay[key].update_time.slice(0,10)!=currentDate+1+'00') {
                            allDay[key].hour = allDay[key].update_time.slice(8,10)+':00';
                        }else {
                            allDay[key].hour = '明天';
                        }
                    }
                    console.log(allDay);
                    this.setData({
                        current: current,
                        twoDays: twoDays,
                        current_hour,
                        allDay: allDay,
                        air: air
                    });
                })
            })
            .catch((x) => {
                console.log(x);
            })
    }
})