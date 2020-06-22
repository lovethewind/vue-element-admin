// use layer global
// eslint-disable-next-line no-undef
layer = layui.use(['layer']).layer
// get_clear_html_tag
// eslint-disable-next-line no-unused-vars
function Get_Clear_html_tag(str) {
  if (str == null || str === undefined) {
    return ''
  } else {
    var tem = str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/<\/?.+?\/?>/g, '')
      .replace(/<[^>]+>/g, '')
    return tem
  }
}

// get_time_how_long_ago
function get_Time_how_long_ago(time) {
  // origin_time = time.split("-");
  // new_time = origin_time[0]+"-"+(parseInt(origin_time[1])+1).toString()+"-"+origin_time[2]
  var format_time = new Date(time).getTime() / 1000

  var now_time = new Date().getTime() / 1000
  var how_long = now_time - format_time
  var day = parseInt(how_long / (360 * 24))
  var second = how_long % (360 * 24)
  var hour = parseInt(second / 360)
  second = second % 360
  var minute = parseInt(second / 60)
  second = second % 60
  var str = ''
  if (day) {
    if (day > 365) {
      str = time.split(':')[0] + ':' + time.split(':')[1]
    } else if (day > 7) {
      str = time.split('-')[1] + '-' + time.split('-')[2].split(':')[0] + ':' + time.split('-')[2].split(':')[1]
    } else {
      str = day + '天前'
    }
  } else if (hour) {
    str = hour + '小时前'
  } else if (minute) {
    str = minute + '分钟前'
  } else {
    str = '刚刚'
  }
  return str
}

// 获取设备信息
// eslint-disable-next-line no-unused-vars
function getDeviceInfo() {
  var userAgent = navigator.userAgent.toLowerCase()
  var name = 'Unknown'
  var version = 'Unknown'
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows'
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000'
    } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
      version = 'Windows XP'
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista'
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8'
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
      version = 'Windows 10'
    } else {
      version = 'Unknown'
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'iPhone'
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac'
    if (userAgent.indexOf('mac os x') > -1) {
      version = userAgent.slice(userAgent.indexOf('mac os x') + 9, userAgent.indexOf(')'))
    }
  } else if (userAgent.indexOf('ipad') > -1) {
    name = 'iPad'
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix'
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android'
    } else {
      name = 'Linux'
    }
  } else {
    name = 'Unknown'
  }
  //
  var dict = {
    'name': name,
    'version': version
  }
  dict = JSON.stringify(dict)
  return dict
}

// eslint-disable-next-line no-unused-vars
function control_vaildation_button(e) {
  /* 发送成功则避免重复点击*/
  e.srcElement.style.background = 'gray'
  e.srcElement.style.border = 'gray'
  e.srcElement.disabled = true
  var i = 1
  var interval = setInterval(function() {
    if (i < 60) {
      var re = 60 - i
      var strr = '请' + re + 's后再试'
      e.srcElement.textContent = strr
      i = i + 1
    } else {
      clearInterval(interval)
      e.srcElement.textContent = '获取验证码'
      e.srcElement.style.background = '#67C23A'
      e.srcElement.style.border = '#67C23A'
      e.srcElement.disabled = false
      return false
    }
  }, 1000)
}
