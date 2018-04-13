const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = secs => {
  var t = new Date(secs);
  var year = t.getFullYear();
  var month = t.getMonth() + 1;
  if (month < 10) { month = '0' + month; }
  var date = t.getDate();
  if (date < 10) { date = '0' + date; }
  var hour = t.getHours();
  if (hour < 10) { hour = '0' + hour; }
  var minute = t.getMinutes();
  if (minute < 10) { minute = '0' + minute; }
  var second = t.getSeconds();
  if (second < 10) { second = '0' + second; }
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const gotoPage = (url, param) => {
  wx.navigateTo({
    url: parseUrl(url, param)
  })
}

const parseUrl = (url, param) => {
  if (typeof (param) !== "object") return url;
  var str = '';
  for (let i in param) {
    str += ('&' + i + '=' + param[i]);
  }
  if (url.indexOf('?') > -1) {
    return url + str;
  } else {
    return url + '?' + str.substr(1);
  }
}

const get = (url, data) => { 
  let get = wxPromisify(wx.request);
  return get({
    url: url,
    data: data,
    methods: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    }
  })
}

const post = (url, data) => {
  let post = wxPromisify(wx.request);
  return post({
    url: url,
    data: data,
    methods: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    }
  })
}

const wxPromisify = (fn) => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  parseUrl: parseUrl,
  gotoPage: gotoPage,
  get: get,
  post: post
}
