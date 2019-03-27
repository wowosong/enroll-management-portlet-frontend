<template>
  <header>
    <div class="container">
      <div class="main-wrap">
        <div class="logo clearfix">
          <img src="@/imgs/logo.png">
          <a><i class="iconfont">&#xe619;</i>首次报名</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        isShowNav: true
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
    height: 74px;
    border-bottom: 3px solid #aa2f33;
  }

  .logo {
    line-height: 74px;
    cursor: pointer;
    a {
      color: #fff;
      float: right;
    }
    img {
      vertical-align: middle;
    }
  }
  .container{
    background: #2f3861;
  }
</style>
