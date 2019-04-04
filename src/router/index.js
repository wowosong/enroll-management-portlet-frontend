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
    }
  ],
},
  {
    path: '*',
    name: '404', // 用于显示没有匹配到的页面
    component: page404,
  }
];

export default list

export {list}
