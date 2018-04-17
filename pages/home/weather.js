/*weather.js*/
const utils = require('../../utils/util');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk = new QQMapWX({
    key: 'QLIBZ-4SRKX-VZ54Z-ZYLR4-GJOSO-K7BYQ'
});

Page({
    data: {
        location: {},
        current: {},
        twoDays: [],
        current_hour: 0,
        allDay: [],
        air: {},
        week: {},
        loading: true
    },
    onLoad() {

    },
    onPullDownRefresh() {
        let self = this;
        this.setData({ loading: true });
        this.getWeather();
    },
    onReady() {
        this.getWeather();
        this.getCityList();
    },
    getWeather() {
        let self = this;
        let getLocation = utils.wxPromisify(wx.getLocation);
        getLocation({ type: 'gcj02' })
            .then(res => {
                let options = {
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                }
                return new Promise((resolve, reject) => {
                    options.success = x => resolve(x) // 成功
                    options.fail = x => reject(x) // 失败
                    qqmapsdk.reverseGeocoder(options)
                })
            })
            .then(res => {
                let location = res.result.address_component;
                self.getWeatherCallback(location);
            })
            .catch((x) => {
                console.log(x);
            })
    },
    getDayaftertoday(n) {
        let word_arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        //后天之后星期几
        let day1 = new Date();
        day1 = day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000 * n)
        day1 = new Date(day1);
        let week1 = day1.getDay();
        return word_arr[week1];
    },
    getCityList() {
        let self = this;
        qqmapsdk.getCityList({
            success: function (res) {
                console.log(res)
                self.setData({
                    region: res.result
                })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    bindRegionChange(event) {
        let value = event.detail.value;
        let province = value[0];
        let city = value[1];
        let district = value[2];
        let location = { province, city, district };
        this.setData({ loading: true });
        this.getWeatherCallback(location)
    },
    getWeatherCallback(location) {
        this.setData({
            location: location
        })
        let url = "https://wis.qq.com/weather/common";
        let data = {
            source: 'xw',
            weather_type: "observe|forecast_1h|forecast_24h|air",
            province: location.province,
            city: location.city,
            county: location.district
        }

        utils.get(url, data)
            .then(res => {
                if(JSON.stringify(res.data.data.observe) == '{}') {
                    data.county = '';
                    return utils.get(url, data)
                } else {
                    return new Promise((resolve,reject)=>{
                        resolve(res);
                    })
                }
            })
            .then(res => {
                let current = res.data.data.observe;
                let twoDays = [res.data.data.forecast_24h[1], res.data.data.forecast_24h[2]]
                let date = new Date();
                let current_hour = date.getHours();
                let allDay = res.data.data.forecast_1h;
                let air = res.data.data.air;
                let currentDate = parseInt(utils.formatDate(date, 'YYYYMMDD'));
                let week = res.data.data.forecast_24h;
                for (let key in allDay) {
                    if (allDay[key].update_time.slice(0, 10) != currentDate + 1 + '00') {
                        allDay[key].hour = allDay[key].update_time.slice(8, 10) + ':00';
                    } else {
                        allDay[key].hour = '明天';
                    }
                    if(parseInt(allDay[key].update_time.slice(8, 10)) < 18 && parseInt(allDay[key].update_time.slice(8, 10)) >= 6) {
                        allDay[key].image = "https://mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/"+allDay[key].weather_code+".png";
                    } else {
                        allDay[key].image = "https://mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/"+allDay[key].weather_code+".png";
                    }
                }
                let week_arr = [
                    "昨天", "今天", "明天", "后天",
                    this.getDayaftertoday(3),
                    this.getDayaftertoday(4),
                    this.getDayaftertoday(5),
                    this.getDayaftertoday(6)
                ]
                for (let key in week) {
                    week[key].date = week[key].time.slice(5, 10);
                    week[key].week = week_arr[key];
                }
                this.setData({
                    current: JSON.stringify(current)=='{}'? null : current,
                    twoDays: twoDays,
                    current_hour,
                    allDay: JSON.stringify(allDay)=='{}'? null : allDay,
                    air: JSON.stringify(air)=='{}'? null : air,
                    week: JSON.stringify(week)=='{}'? null : week,
                    loading: false
                });
                wx.stopPullDownRefresh();
            })
            .catch(e => {
                console.log(e);
            })
    }
})