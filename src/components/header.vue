<template>
  <div class="container">
    <header>
      <div class="main-wrap">
        <div class="logo clearfix">
          <img src="@/imgs/logo.png">
          <a v-if="isLogin"><i class="iconfont">&#xe619;</i>首次报名</a>
          <a v-if="!isLogin"><img src="" @error="errorImg($event,'avatar')">赵御瞳</a>
        </div>
      </div>
    </header>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        isShowNav: true,
        isLogin:false
      }
    },
    mounted() {
      let vm = this;
      if (window.isPhone) {
        vm.isShowNav = false
      }
    },
    methods: {
      navFn(menu) {
        this.$store.commit('setMenu', menu.name);
        this.$router.push(menu.path)
      },
      goHome() {
        this.$store.commit('setMenu', '/');
        this.$router.push('/')
      },
      bind(type) {
        this.$store.commit('setMenu', type);
        if (type == '退出') {
          logout()
          this.userId = ''
        }
        else if (type == '个人中心') {
          this.$router.push('center')
        } else {
          this.$router.push({path: '/signin', query: {type: type}})
        }
      },
      navShowFn() {
        this.isShowNav = !this.isShowNav
      },
      closeNavFn() {
        this.isShowNav = !this.isShowNav
      }
    },
    computed: {
      getPhoneInfo() {
        return this.$store.state.isShowPhoneStyle;
      }
    },
    watch: {
      getPhoneInfo(val) {
        // console.log(val)
        this.isShowNav = !val
        // console.log(this.isShowNav)
      }
    }
  }
</script>
<style scoped lang="less">
  header {
    background: #2f3861;
    color: #fff;
    height: 77px;
    line-height: 77px;
    border-bottom: 3px solid #aa2f33;
  }

  .logo {
    cursor: pointer;
    box-sizing: border-box;
    a {
      color: #fff;
      float: right;
      i {
        margin-right: 5px;
      }
      img{
        width: 41px;
        height: 38px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    img {
      vertical-align: middle;
    }
  }
</style>
