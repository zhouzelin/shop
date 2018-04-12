const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const gotoPage = (url,param) => {
  wx.navigateTo({
    url: parseUrl(url,param)
  })
}

const parseUrl = (url,param) => {
  if(typeof(param)!== "object") return url;
  var str = '';
  for(let i in param) {
    str += ('&' + i + '=' + param[i]);
  }
  if(url.indexof('?')>-1) {
    return url + str;
  }else {
    return url + '?' + str.substr(1);
  }
}

module.exports = {
  formatTime: formatTime,
  parseUrl: parseUrl,
  gotoPage: gotoPage
}
