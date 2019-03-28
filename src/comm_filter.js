import Vue from 'vue'
Vue.filter('dateFormatYmdHms', function (date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }
})
Vue.filter('dateFormatYmdHm', function (date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
  }
})
Vue.filter('dateFormatYmd', function (date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD')
    }
    return '';
})
Vue.filter('dateFormatYmdW', function (date) {
  if (date) {
    return moment(date).format('YYYY年MM月DD')
  }
  return '';
})
Vue.filter('dateFormatM', function (date) {
    if (date) {
      return moment(date).format('MM')
    }
    return '';
})
Vue.filter('dateFormatD', function (date) {
    if (date) {
      return moment(date).format('DD')
    }
    return '';
})