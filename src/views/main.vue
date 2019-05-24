<template>
  <div v-if="inited" class="main">
    <comm_head></comm_head>
    <router-view class="box"></router-view>
    <comm_footer></comm_footer>
  </div>
</template>

<script>
  import comm_head from '@/components/header.vue'
  import comm_footer from '@/components/footer.vue'

  export default {
    components: {comm_head, comm_footer},
    data() {
      return {
        roles: '',
        refresh: 1,
        inited: false
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      '$store.state.isLogin': function () {
        let vm = this;
        vm.init()
      },
    },
    methods: {
      init() {
        this.getRoleType();
      },
      getRoleType() {
        let vm = this;
        let localtoken = localStorage.getItem('accesstoken') ? JSON.parse(localStorage.getItem('accesstoken')) : '';
        if (localtoken && localtoken.access_token) {
          http.get('/gateway/platform/users/roleTypes/2', {
            headers: {Authorization: 'Bearer ' + localtoken.access_token},
          }).then(function (xhr) {
            if (xhr.data.error == "invalid_token") {
              logout();
            }
            if (xhr.data.data.isAdmin) {
              vm.err = true;
              vm.errorMsg = '管理员身份不能登录业务平台！';
            } else {
              //本地保存token
              if (xhr.data.data.roleTypes.length > 0) {
                vm.roles = xhr.data.data.roleTypes[0].id;
                vm.getUserInfo()
              }
            }
          });
        }
        else {
          vm.inited = true
        }

      },
      getUserInfo() {
        let vm = this;
        http.get('/gateway/platform/user', {
          params: {
            roleTypeId: vm.roles
          }
        }).then(xhr => {
          window.userInfo = xhr.data.data;
          vm.$store.commit('getUserInfo', xhr.data.data);
          // console.log('11111111111111111',vm.$store.state.userInfo)
          vm.getSystemParam();
        })
      },
      getSystemParam() {
        let vm = this;
        http.get('/gateway/platform/configuration/list', {}).then(response => {

          let list = response.data.data;
          let obj = {};
          for (let ii of list) {
            let str = ii.scValue + '';
            obj[ii.scKey] = str.replace(/\/$/, '') // 容错, 去掉末尾的/
          }
          window.systemParameter = obj;// 生成如 systemParameter.FILE_SYSTEM_URL
          vm.inited = true;
        })
      },
    }
  }
</script>
<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 100%;
  }

  .box {
    flex-grow: 1;
  }
</style>

