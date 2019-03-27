<template>
  <footer>
    <div class="container">
      <div class="main-wrap">
        <div class="tel-wrap">
          <ul class="clearfix">
            <li>锦江小学招生电话：028-85917541</li>
            <li>锦江国高招生电话：028-86666501</li>
            <li>锦江中学招生电话：028-85913229，028-85911236</li>
            <li>成华校区招生电话：028-64201263</li>
            <li>郫县分校招生电话：028-61419990</li>
            <li>北城分校招生电话：028-83835253</li>
            <li>达州嘉祥招生电话：0818-2117702，0818-2117705</li>
            <li>都江堰嘉祥招生电话：18428051628</li>
          </ul>
          <div class="copyright">
            © 2000-2017 嘉祥教育集团 版权所有，并保留所有权利 ICP备案证书号：蜀ICP备00000000号
            <span>川公网安备 00000000000000号</span>
          </div>
        </div>
        <div class="qrcode">
          <img src="@/imgs/qrcode.jpg">
          <span>嘉祥官网</span>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>//page footer
export default {
  data() {
    return {
      menu: [
        {name: '青训报名', path: '/signUp'},
        {name: '填报说明', path: '/explain'},
        {name: '成绩查询', path: '/score_query'},
        {name: '选拔公告', path: '/notice'},
        {name: '关于我们', path: '/aboutus'}
      ],
      nowNav: '青训报名',
      isPhone: window.isPhone
    }
  },
  mounted() {
    let vm = this;
  },
  methods: {
    navFn(menu) {
      this.$router.push(menu.path)
      this.$store.commit('setMenu', menu.name);
    },
    isShowPhoneFn(data) {
      this.$store.commit('setPhoneStyle', data);
    }
  },
}
</script>
<style lang="less" scoped>
  footer {
    padding: 40px 30px 40px 50px;
    color: #fff;
    background: #323232;
    .main-wrap {
      position: relative;
    }
    .tel-wrap {
      margin-right: 50px;
      font-size: 12px;
      box-sizing: border-box;
      ul li {
        float: left;
        line-height: 34px;
        margin-right: 31px;
      }
      ul li:last-child {
        margin-right: 0;
      }
      .copyright {
        margin-top: 40px;
        span {
          margin-left: 30px;
        }
      }
    }
    .qrcode {
      position: absolute;
      right: 0;
      top: 0;
      background: #3a3939;
      padding: 6px;
      width: 82px;
      img {
        width: 100%;
      }
      span {
        display: block;
        margin-top: 6px;
        text-align: center;
      }
    }
  }
</style>
