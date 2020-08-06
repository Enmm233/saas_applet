const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//时间戳转换成日期时间
function js_date_time(unixtime) {
  var date = new Date(unixtime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
  return y + '-' + m;
}

/**
* 坐标转换，腾讯地图转换成百度地图坐标
* lng 腾讯经度（pointy）
* lat 腾讯纬度（pointx）
* 经度>纬度
*/

function qqMapToBMap(lat, lng) {

    let pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng;
     let y = lat;
    var z =Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi);
    lng = z * Math.cos(theta) + 0.0065;
    lat = z * Math.sin(theta) + 0.006;
    return {'lng':lng,'lat':lat};

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function thedefaulttime() { //购买记录默认时间
	var date = new Date();
	var year = date .getFullYear().toString();
	var time = (date.getMonth()+1).toString();
	var month = '';
	if(time < 10){
		month = "0"+time;
	}else{
		month = time;
	}
	var day = date.getDate().toString();
	var start = year +'-'+ month +'-01';
	var end = year +'-'+ month +'-'+ day;
	var dateArr = [start,end];
	return dateArr;
}



module.exports = {
  formatTime: formatTime,
  js_date_time: js_date_time,
  qqMapToBMap:qqMapToBMap,
  thedefaulttime:thedefaulttime
}
