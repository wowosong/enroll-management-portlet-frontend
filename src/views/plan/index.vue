<template>
    <div class="comm_main clearfix">
        <div class="comm_item float_left">
            <div class="item_tit">招生计划<span>ENROLLMENT PLAN</span></div>
            <div class="plan_cont">
                <div class="plan_list" v-for="(item,index) in planList" :key="index">
                    <i class="ico"></i>
                    <div class="plan_tit text_one">{{item.campusName}} {{item.planName}}</div>
                    <span class="btn color1" :class="{dis_click:item.publishStatus != 1}" @click="signUp()">立即报名</span>
                    <span class="btn color2" @click="enrollmentGuide(item)">招生简章</span>
                </div>
                <div class="no_data" v-if="!planList || planList.length == 0"></div>
            </div>
        </div>
        <campus></campus>
    </div>
</template>
<script>
    import campus from '@/components/campus.vue'
    export default {
        components:{
            campus
        },
        data(){
            return{
                planList:[],
                filter:{
                  campusId: '',
                },
            }
        },
        mounted() {
            //初始化数据
            let vm = this;
            http.get("/enroll/api/erEnrollPlan/portalQuery", {params: vm.filter}).then(function (xhr) {
              vm.planList = xhr.data.data;
            })
        },
      methods: {
        signUp() {
          this.$router.push({path:'/signup'});
        },
        enrollmentGuide(item) {
          if( item.auditStatus != 3 && item.erEnrollmentGuide.publishStatus != 1) {
            this.$message({
              message: '请选择审批通过和招生简章发布了的招生计划！',
              type: "warning"
            })
            return;
          }
          if(item.erEnrollmentGuide == null) {
            this.$message({
              message: '还没填写招生简章！',
              type: "warning"
            })
            return;
          }
          this.$router.push({path:'/plan/detail',query:{erEnrollmentGuide:item.erEnrollmentGuide}});
        }
      }
    }
</script>

<style scoped lang="less">
    .item_tit{
        border-bottom:1px solid #E6E6E6;
        padding-bottom: 25px;
        font-size: 22px;
        margin-top: 6px;
        span{
            font-size: 12px;
            color: #999;
            margin-left: 10px;
            font-style: italic;
        }
    }
    .plan_cont{
        padding-top: 20px;
    }
    .float_left{
        min-height: 100%;
    }
    .plan_list{
        height: 32px;
        margin-bottom:20px;
        .ico{
            background: #333;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            float: left;
            margin-top: 14px;
            margin-right: 10px;
        }
        .plan_tit{
            color: #333;
            margin-top: 6px;
            width: 600px;
            display: inline-block;
            cursor: pointer;
        }
        .plan_tit:hover{
            color: #aa2f33;
        }
        .btn{
            line-height: 32px;
            border-radius: 3px;
            border:1px solid #bbb;
            float: right;
            margin-left: 22px;
            padding: 0 15px;
            cursor: pointer;
        }
        .color1{
            color: #aa2f33;
            border:1px solid #aa2f33;
        }
        .btn:hover{
            background: #aa2f33;
            border:1px solid #aa2f33;
            color: #fff;
        }
        .btn.dis_click{
            background: #eee;
            color: #999;
            border:1px solid #bbb;
        }
    }
</style>
