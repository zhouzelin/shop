const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (secs,formate="YYYY-MM-DD hh:mm:ss") => {
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

  let json = {
    'YYYY': year,
    'MM': month,
    'DD': date,
    'hh': hour,
    'mm': minute,
    'ss': second
  }

  let result = formate;
  for(var key in json) {
    result = result.replace(key,json[key]);
  }

  return result;
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

const wxPromisify = fn => (obj = {}) => new Promise((resolve, reject) => {
  obj.success = res => resolve(res) // 成功
  obj.fail = res => reject(res) // 失败
  fn(obj)
})

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate, // 日期格式化
  parseUrl: parseUrl,  
  gotoPage: gotoPage, // 页面跳转
  get: get, // get请求
  post: post, // post请求
  wxPromisify: wxPromisify // 请求 promise 化
}
