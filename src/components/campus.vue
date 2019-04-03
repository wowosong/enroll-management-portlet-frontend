<template>
    <div class="comm_item float_right">
        <div class="campus_tit">全部校区</div>
        <div v-for="(item,index) in campusList" :key="index" class="campus_list">{{item.campusName}}</div>
        <div class="no_data" v-if="!campusList || campusList.length == 0"></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      campusList: []
    }
  },
  mounted() {
    this.queryCampus();
  },
  methods: {
    //获取校区
    queryCampus() {
      let vm = this;
      http.get("/gateway/campus/list").then(function (xhr) {
        vm.campusList = xhr.data.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .campus_list{
        padding:12px 20px 10px 20px;
        color: #666;
        cursor: pointer;
    }
    .campus_list:hover{
        color: #aa2f33;
    }
    .campus_tit{
        border-left: 4px solid #aa2f33;
        padding-left: 16px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        line-height: 16px;
    }
</style>

