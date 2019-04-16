// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import _ from 'lodash'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import moment from 'moment'

moment().format();

import Router from 'vue-router'

Vue.use(Router)
import VueResource from 'vue-resource'

Vue.use(VueResource)
import router_list from './router'

import './comm_filter'
import './components/fileUpload/index.js'

import default_avatar from '@/imgs/avatar.png'
import default_img from '@/imgs/default_image_small.png'

Vue.prototype.errorImg = function (e, type) {
  // e.target.src=default_avatar_url;
  if (type) {
    switch (type) {
      case 'avatar':
        e.target.src = default_avatar;
        break;
      case 'video':
        e.target.src = default_img;
        break;
      case 'image':
        e.target.src = default_img;
        break;
      default:
        e.target.src = default_img;
        break;
    }
  }
}
/* vue-resource 统一请求处理
 *-------------------------------------------------------------------------------*/
window.http = Vue.http;
Vue.config.productionTip = false;
Vue.http.options.credentials = false;
// Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function (request, next) {
  if (window.showRouteKey) {
    window.loadingSum++
  }
  // 统一处理返回消息
  // if (!request.headers.map.Authorization) {
  //   let cookieToken = getCookie('accesstoken') ? JSON.parse(getCookie('accesstoken')) : null;
  //   if (cookieToken && cookieToken.access_token) {
  //     request.headers.set('Authorization', 'Bearer ' + cookieToken.access_token);
  //   }
  // }

  next(function (response) {
    let data = response.data;
    // data.showHits 统一做提示处理
    if (window.showRouteKey) {
      window.loadingSum--
      if (window.loadingSum === 0) {
        window.showRouteKey = false
        //window.loadingInstance.close()
      }
    }

    if (data) {
      if (data.showHits) {
        let type = 'success'
        let msg = data.message
        let time = 3000

        if (data.code === 30000) {
          msg = _.map(data.data, function (vv) {
            return `<p>${vv}</p>`;
          }).join('')
        } else if (data.code === 20001) {
          // data.level = 'failmask';
          data.level = 'fail';
        }
        switch (data.level) {
          case 'info':
            type = 'success'
            break;
          case 'warn':
            type = 'warning'
            break;
          case 'fail':
            type = 'error'
            time = 10000
            break;
          default:
            msg = '未处理的其它 level: ' + data.level
        }
        Vue.prototype.$message({
          message: msg,
          type: type,
          duration: time,
          showClose: true,
        })
      }
    }

    // 出现异常 401
    if (!response.ok) {
      if (data.error == 'invalid_token') {
        // 跳到登录页
        // logout();
      }
    }

  });
  //加headers
  if (!request.headers.map.Authorization) {
    let localtoken = localStorage.getItem('accesstoken') ? JSON.parse(localStorage.getItem('accesstoken')) : '';
    if (localtoken) {
      request.headers.set('Authorization', 'Bearer ' + localtoken.access_token);
    }
  }
});
/* vue-resource 统一请求处理
 *-------------------------------------------------------------------------------end*/


/* 初始化路由 并挂载到vue
 *-------------------------------------------------------------------------------*/
// 初始化路由
const router = new Router({
  mode: 'hash',
  routes: router_list,
});
// window 自定义
// 文件系统地址 本地使用
window.systemParameter = {};
window.systemParameter.FILE_SYSTEM_URL = '/gateway/zuul/filesystem';
window.userInfo = {
  id: ''
};

/**
 *
 * 自定义公共方法
 *
 */

// 只生成一层 a=b;c=d
window.eduFilterParam = function (obj) {
  let rs = [];
  for (let ii in obj) {
    rs.push(ii + '=' + obj[ii])
  }
  return rs.join(';');
};


window.logout = function () {
  //清除本地缓存重新登陆
  localStorage.clear();
  let localtoken = localStorage.getItem('accesstoken') ? JSON.parse(localStorage.getItem('accesstoken')) : null
  if (localtoken && localtoken.access_token) {
    http.get('/gateway/auth/logout', {
      headers: {Authorization: 'Bearer ' + localtoken.access_token},
    }).then((xhr) => {
      router.push('/')
    })
  } else {
    router.push('/')
  }
}
// 判断是否为手机浏览器
const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
// 修改meta viewport
function getBrowser() {
  $("meta[name='viewport']").attr('content',"width=device-width, initial-scale=1");
}
if(isPhone){
  getBrowser();
}


let localtoken = localStorage.getItem('accesstoken') ? JSON.parse(localStorage.getItem('accesstoken')) : '';
// 初始化 store
const store = new Vuex.Store({
  state: {
    isLogin: localtoken ? true : false,
    userInfo: {},
    isPhone: isPhone
  },
  mutations: {
    changeLogin(state, value) {
      state.isLogin = value
    },
    getUserInfo(state, obj) {
      state.userInfo = obj
    },
    setPhoneStyle(state, value) {
      state.isPhone = value
    }
  }
});
// 初始化整个app
let app = new Vue({
  router,
  store,
  render(h) {
    return h('div', {
      attrs: {
        id: 'app'
      }
    }, [h('router-view')]);
  }
});
app.$mount('#app');

/* 初始化路由 并挂载到vue
 *-------------------------------------------------------------------------------end*/


/* 全局方法
 *-------------------------------------------------------------------------------*/
//插入 override-element-ui.css 换肤时将换肤样式插入到该样式之前
let themeLink = document.createElement('link');
themeLink.rel = 'stylesheet';
themeLink.id = 'resetElement';
themeLink.href = 'static/css/override-element-ui.css';
document.getElementsByTagName('HEAD').item(0).appendChild(themeLink);

//全局样式 线性图标用的css, 彩色图标用svg 需引入js
//阿里图标库 http://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.11&manage_type=myprojects&projectId=764310&keyword=
//http://at.alicdn.com/t/font_764310_k5r2cmq2ri.css,http://at.alicdn.com/t/font_814323_3e9xb7ug1vn.js
http.get('/gateway/platform/api/systemTool/config/PORTLET_ICONS_URL').then(response => {
  if (response && response.bodyText) {
    let str = response.bodyText;
    let str2 = str.split(',');

    let reg = /\b(.js|.css)$\b/g;

    _.each(str2, i => {
      if (i.match(reg)) {
        if (i.match(reg) == '.css') {
          let cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet';
          cssLink.href = i;
          document.getElementsByTagName('HEAD').item(0).insertBefore(cssLink, document.querySelector('#fontawesome'));
        }
        // 彩色图标 暂不引入
        if (i.match(reg) == '.js') {
          let jsLink = document.createElement('script')
          jsLink.src = i;
          document.getElementsByTagName('HEAD').item(0).insertBefore(jsLink, document.querySelector('#fontawesome'));
        }
      }
    })
  }
});


window.eduFilterParam = function (obj) {
  let rs = [];
  for (let ii in obj) {
    rs.push(ii + '=' + obj[ii])
  }
  return rs.join(';');
};


