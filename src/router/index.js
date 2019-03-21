// import main from '../views/main'
import HelloWorld from '@/components/HelloWorld'

import page404 from '../views/error/404'


const list = [
  {
    path: '/',
    name: 'main',
    component: HelloWorld,
  },
  {
    path: '*',
    name: '404', // 用于显示没有匹配到的页面
    component: page404,
  },
]

export default list

export {
  list
}
