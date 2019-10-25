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
//文件系统单文件下载
window.filesystemSingleDownload = json => {
  let form = $("<form>");
  form.attr('style', 'display:none');
  form.attr('target', '');
  form.attr('method', 'get');
  form.attr('action', window.systemParameter.FILE_SYSTEM_URL + "/file/download/" + json[0].id);
  if (json[1] && json[1].filename) {
    let input = $('<input>');
    input.attr('type', 'hidden');
    input.attr('name', 'filename');
    if (json[1].filename.match(/[\u4e00-\u9fa5]+/g)) {
      input.attr('value', encodeURIComponent(json[1].filename));
    } else {
      input.attr('value', json[1].filename);
    }
    form.append(input);
  }
  $('body').append(form);
  form.submit();
}
