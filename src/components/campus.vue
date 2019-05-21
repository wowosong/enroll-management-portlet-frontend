<template>
    <div class="comm_item float_right campus_main">
        <div class="campus_tit" @click="isShowMoreFn" :class="{allInfo:nowCampsId == ''}">全部校区<img src="../imgs/warp/down.png"></div>
        <div class="campus_layer" v-if="isShowMore">
          <div class="layer_main">
            <div v-for="(item,index) in campusList" :key="index" class="campus_list" :class="{active:nowCampsId == item.id}" @click="camputedFn(item)">{{item.cnName}}</div>
            <div class="no_data" v-if="!campusList || campusList.length == 0"></div>
          </div>
          <div class="layer_bg" @click="isShowMore = !isShowMore"></div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      campusList: [],
      isShowMore:true,
      nowCampsId:''
    }
  },
  computed:{
      isPhone: function () {
          return this.$store.state.isPhone
      },
  },
  watch:{
    isPhone:function(oldData,newData){
      this.isShowMore = newData ? false : true
    }
  },
  mounted() {
    this.queryCampus();
    this.isShowMore = this.$store.state.isPhone ? false : true
  },
  methods: {
    //获取校区
    queryCampus() {
      let vm = this;
      http.get("/gateway/platform/api/school/all").then(function (xhr) {
        vm.campusList = xhr.data
      })
    },
    camputedFn(item){
      this.nowCampsId = item.id
      this.$emit("query",item.id)
    },
    isShowMoreFn(){
      this.nowCampsId = ''
      this.$emit("query",'')
      if(this.isPhone){
        this.isShowMore = !this.isShowMore
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .campus_list,.campus_tit{
        padding:0px 20px 0 20px;
        line-height: 16px;
        margin-bottom: 26px;
        color: #666;
        cursor: pointer;
        border-left: 4px solid #fff;
        img{
          display: none;
        }
    }
    .campus_list:hover,
    .active,.allInfo{
        color: #2f3861;
        border-left: 4px solid #aa2f33;
        font-weight: bold;
    }
    // .campus_tit{
    //     border-left: 4px solid #fff;
    //     padding-left: 20px;
    //     font-size: 14px;
    //     // font-weight: bold;
    //     margin-bottom: 15px;
    //     line-height: 16px;
    //     cursor: pointer;
    //     color:#666;
    //     img{
    //       display: none;
    //     }
    // }
    // .allInfo{
    //   color: #2f3861;
    //   border-left: 4px solid #aa2f33;

    // }
    //warp版本
    .is_phone{
      .campus_main{
        background: #fff;
        text-align: center;
        .campus_tit{
          border: none;
          line-height: 45px;
          margin-bottom: 0;
          img{
            margin-left: 10px;
            display: inline-block;
          }
        }
        .campus_layer{
          position: fixed;
          z-index: 100;
          top:87px;
          left: 0;
          right:0;
          bottom:0;
          overflow: auto;
        }
        .campus_list{
          background: #fff;
          border-top:1px solid #eee;
          padding: 13px 20px;
          line-height: 20px;
        }
        .layer_main{
          position: absolute;top:0;left:0;right:0;
          z-index: 10;
        }
        .layer_bg{
          position: absolute;top: 0;left:0;right:0;bottom:0;
          background: rgba(0,0,0,0.5);
        }
      }
    }
</style>

