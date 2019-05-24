// import main from '../views/main'
import main from '@/views/main'
// 首页
import home from '@/views/home/index'

// 招生计划
import plan from '@/views/plan/index'
//招生计划详情
import detail from '@/views/plan/detail'
//填写须知
import instructions from '@/views/plan/instructions'
//个人中心
import center from '@/views/center/index'
//通知
import notice from '@/views/notice/index'
//通知详情
import noticeDetail from '@/views/notice/detail'

// 报名填写
import signup from '@/views/sign_up/index'

import page404 from '../views/error/404'

/**********wrap start****************/
// 登录
import login from '../views/wrap/login'
// 忘记密码
import reset from '../views/wrap/reset_pwd'

import checking from '../views/enroll/index'
// 招生系统扫码跳转

const list = [{
  path: '',
  component: main,
  children: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
    {
      path: '/plan',
      name: 'plan',
      component: plan,
    },
    {

      path: '/signup',
      name: 'signup',
      component: signup
    },
    {
      path: '/plan/detail',
      name: 'detail',
      component: detail,
    },
    {
      path: '/fillInstructions',
      name: 'instructions',
      component: instructions,
    },
    {
      path: '/center',
      name: 'center',
      component: center,
    },
    {
      path: '/notice',
      name: 'notice',
      component: notice,
    },
    {
      path: '/notice/detail',
      name: 'noticeDetail',
      component: noticeDetail,
    },
    {
      path: '/checking',
      name: 'checking',
      component: checking,
    }
  ],
},
  {
    path: '*',
    name: '404', // 用于显示没有匹配到的页面
    component: page404,
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/reset',
    name: 'reset',
    component: reset,
  }
];

export default list

export {list}
