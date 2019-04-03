<template>
    <div class="comm_main clearfix">
        <div class="comm_item float_left">
           <div class="center_tabs clearfix">
               <span @click="tabIndexFn(0)" :class="{active:tabIndex == 0}">报名信息</span>
               <span @click="tabIndexFn(1)" :class="{active:tabIndex == 1}">招生进度</span>
               <span @click="tabIndexFn(2)" :class="{active:tabIndex == 2}">账号安全</span>
               <div class="tab_active_border" :style="'left:'+left+'px'"></div>
           </div>
           <signUpWidget v-if="tabIndex == 0"></signUpWidget>
           <progressWidget v-if="tabIndex == 1"></progressWidget>
           <accountWidget v-if="tabIndex == 2"></accountWidget>
        </div>
        <div class="comm_item float_right">
            <div class="campus_tit">嘉祥官网</div>
            <div class="campus_list">http://www.jxfls.com</div>
            <!-- <div class="no_data"></div> -->
        </div>
    </div>
</template>
<script>
    import progressWidget from './progress/index'
    import signUpWidget from './sign_up/index'
    import accountWidget from './account/index'
    export default {
        components:{
            progressWidget,
            signUpWidget,
            accountWidget
        },
        data(){
            return{
                tabIndex:2,
                left:30
            }
        },
        mounted(){
            this.tabIndexFn(0)
        },
        methods:{
            tabIndexFn(index){
                this.tabIndex = index
                this.left = index * 132 + 30
            }
        }
    }
</script>

<style scoped lang="less">
    .float_left{
        min-height: 100%;
    }
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
    .center_tabs{
        border-bottom: 1px solid #E6E6E6;
        font-size: 18px;
        color: #999;
        position: relative;
        padding: 10px 0 30px 0;
        span{
            margin: 0 30px;
            cursor: pointer;
            float: left;
        }
        span.active,
        span:hover{
            color: #333;
        }
        .tab_active_border{
            position: absolute;
            bottom: 0;
            border-bottom:2px solid #333;
            width: 70px;
            left: 30px;
            transition: left .3s;
        }
    }
</style>
