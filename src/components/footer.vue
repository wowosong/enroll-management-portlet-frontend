<template>
  <div class="container footer">
    <footer>
      <div class="main-wrap">
        <p class="edition-wrap" v-if="isPhone && !$route.query.enroll">
          <span @click="changeBrowser(false)">电脑版</span>
          <span @click="changeBrowser(true)">手机版</span>
        </p>
        <div class="tel-wrap">
          <ul class="clearfix">
            <li>成都嘉祥外国语学校成华校区：028-64201263</li>
            <li>成都市郫都区嘉祥外国语学校：028-61419980</li>
            <li>彭州市嘉祥外国语学校：028-83835253</li>
            <li>成都市温江区嘉祥外国语小学：028-65487722</li>
            <li>乐山高新区嘉祥外国语学校：18183319888</li>
            <li>达州嘉祥外国语学校：0818-2117702/2117705</li>
            <li>自贡市嘉祥外国语学校：8220022</li>
            <li>都江堰市嘉祥外国语学校：028-87229966</li>
            <li>达州嘉祥招生电话：0818-2117702，0818-2117705</li>
            <li>成都嘉祥外国语学校锦江校区（小学）：028-86653930</li>
            <li>成都嘉祥外国语学校锦江校区（国际高中）：028-86666501</li>
            <li>成都七中嘉祥外国语学校锦江校区（中学）：028-85913229/85911236</li>
          </ul>
          <div class="copyright">
            © 2000-2017 嘉祥教育集团 版权所有，并保留所有权利 ICP备案证书号：蜀ICP备00000000号
            <span>川公网安备 00000000000000号</span>
          </div>
        </div>
        <!--<div class="qrcode">-->
        <!--<img src="@/imgs/qrcode.jpg">-->
        <!--<span>嘉祥官网</span>-->
        <!--</div>-->
      </div>
    </footer>
  </div>
</template>
<script>
  export default {
    computed: {
      isPhone: function () {
        return window.isPhone
      },
    },
    methods: {
      // 电脑版 / 手机版切换
      changeBrowser(value) {
        this.$store.commit('setPhoneStyle', value);
        if (!value) {
          $("meta[name='viewport']").attr('content', "width=device-width, initial-scale=0.1");
          $("#changeHref").attr('href', '');
          $("#app").removeClass('is_phone');
        } else {
          $("#app").addClass('is_phone');
          $("#changeHref").attr('href', 'static/css/wrap.css');
          $("meta[name='viewport']").attr('content', "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
        }
      }
    },
  }
</script>
<style lang="less" scoped>
  footer {
    color: #fff;
    background: #323232;
    .main-wrap {
      position: relative;
      padding: 27px 30px 40px 50px;
    }
    .edition-wrap {
      text-align: center;
      font-size: 12px;
      span:last-child {
        border-left: 1px solid #cacaca;
        margin-left: 8px;
        padding-left: 8px;
        line-height: 14px;
        display: inline-block;
      }
    }
    .tel-wrap {
      margin-right: 50px;
      font-size: 12px;
      box-sizing: border-box;
      ul li {
        float: left;
        min-width: 340px;
        line-height: 34px;
      }
      ul li:last-child {
        margin-right: 0;
      }
      .copyright {
        margin-top: 27px;
        text-align: center;
        span {
          margin-left: 30px;
        }
      }
    }
    .qrcode {
      position: absolute;
      right: 10px;
      top: 40px;
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

  .container {
    background: #323232;
  }
</style>
