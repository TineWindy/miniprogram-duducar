// 获取d当前时间多少天后的日期和对应星期
function getDates(days) {
  var todate = getCurrentMonthFirst()
  var dateArry = [];
  var dateObj = dateLater(todate, days);
  dateArry.push(dateObj)
  return dateArry;
}

/**
 * 传入时间后几天
 * param：传入时间：dates: "2018-04-02", later:往后多少天
 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  var temp = parseInt(date.getDate()) + parseInt(later)
  var lastday = getLastDay(date.getFullYear(), date.getMonth())
  console.log({
    date: date,
    lastday: lastday,
    temp: temp,
  })
  if (temp > lastday) {
    date.setDate(temp - lastday)
    if (date.getMonth() + 1 >= 12) {
      date.setFullYear(parseInt(date.getFullYear()) + parseInt(1))
      date.setMonth(0)
    } else {
      date.setMonth(date.getMonth() + 1)
    }
  } else {
    date.setDate(temp)
  }
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = date.getMonth() + 1;
  dateObj.day = date.getDate();
  dateObj.week = show_day[date.getDay()];
  return dateObj;
}

// 获取当前时间
function getCurrentMonthFirst() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}

//获得某月的最后一天  
function getLastDay(year, month) {
  var new_year = year; //取当前的年份          
  var new_month = month + 1; //取下一个月的第一天，方便计算（最后一天不固定）          
  if (month > 12) {
    new_month -= 12; //月份减          
    new_year++; //年份增          
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期          
}

module.exports = {
  getDates: getDates,
  dateLater: dateLater,
  getLastDay: getLastDay
}