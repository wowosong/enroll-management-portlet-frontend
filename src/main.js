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

import default_avatar from '@/imgs/avatar1.png'
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
  next(function (response) {
    let data = response.data;
    if (data) {
      if (data.level == 'info' && data.showHits) {
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
      // if (!data.data || data.error == 'invalid_token' || data.error == 'unauthorized') {
      //   // 跳到登录页
      //   logout();
      // }
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
  mode: 'history',
  routes: router_list,
});
// window 自定义
// 文件系统地址 本地使用
window.systemParameter = {};
window.systemParameter.FILE_SYSTEM_URL = '/gateway/zuul/filesystem';
window.systemParameter.FILE_SYSTEM_URL = '/gateway/zuul/filesystem';
window.systemParameter.fileSystemWriteUrl = '/gateway/filesystem';

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
      // 清空用户信息
      store.commit('getUserInfo', {});
      // 重置登录状态
      store.commit('changeLogin', false);
      // 设置导航栏状态
      store.commit('setMenu', 'home');
      localStorage.setItem('active', 'home');
      console.log(router.history.current)
      if(router.history.current.query.enroll){
        router.push({path:'/checking',query: {enroll: true}})
      }else{
        router.push('/')
      }
    })
  } else {
    // 清空用户信息
    store.commit('getUserInfo', {});
    // 重置登录状态
    store.commit('changeLogin', false);
    // 设置导航栏状态
    store.commit('setMenu', 'home');
    localStorage.setItem('active', 'home');
    console.log(router.history.current)
   if(router.history.current.query.enroll){
     router.push({path:'/checking',query: {enroll: true}})
   }else{
     router.push('/')
   }
  }
}
// 判断是否为手机浏览器
window.isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

// 修改meta viewport
function getPhone() {
  $("meta[name='viewport']").attr('content', "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
  $("#changeHref").attr('href', 'static/css/wrap.css');
}

if (isPhone) {
  getPhone();
}


let localtoken = localStorage.getItem('accesstoken') ? JSON.parse(localStorage.getItem('accesstoken')) : '';
let active = localStorage.getItem('active') ? localStorage.getItem('active') : 'home';
// 初始化 store
const store = new Vuex.Store({
  state: {
    isLogin: localtoken ? true : false,
    userInfo: {},
    isPhone: window.isPhone,
    active: active
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
    },
    setMenu(state, value) {
      state.active = value
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
        id: 'app',
        class: isPhone ? 'is_phone' : ''
      }
    }, [h('router-view')]);
  }
});
app.$mount('#app');

/* 初始化路由 并挂载到vue
 *-------------------------------------------------------------------------------end*/


/* 全局方法
 *-------------------------------------------------------------------------------*/

window.eduFilterParam = function (obj) {
  let rs = [];
  for (let ii in obj) {
    rs.push(ii + '=' + obj[ii])
  }
  return rs.join(';');
};


