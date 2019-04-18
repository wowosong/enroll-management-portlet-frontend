<template>
    <div class="comm_main clearfix" :class="{is_has_child:tabIndex}">
        <div class="title">
            <span @click="goback"></span>
            {{title}}
        </div>
        <div class="user_info">
            <img src="@/imgs/avatar.png">
            <p>张三山</p>
        </div>
        <div class="comm_item float_left">
           <div class="center_tabs clearfix">
               <span @click="tabIndexFn(0)" :class="{active:tabIndex == 0}"><img src="@/imgs/warp/center_tab1.png">{{titleList[0]}}</span>
               <span @click="tabIndexFn(1)" :class="{active:tabIndex == 1}"><img src="@/imgs/warp/center_tab2.png">{{titleList[1]}}</span>
               <span @click="tabIndexFn(2)" :class="{active:tabIndex == 2}"><img src="@/imgs/warp/center_tab3.png">{{titleList[2]}}</span>
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
                tabIndex:0,
                left:30,
                title:'个人中心',
                titleList:['报名信息','招生进度','账号安全']
            }
        },
        computed:{
            isPhone: function () {
                return this.$store.state.isPhone
            },
        },
        mounted(){
            if(this.isPhone){
                this.tabIndex = 0
                $("#app>div").addClass("phone_center")
            }
            this.tabIndexFn(this.tabIndex)
        },
        methods:{
            tabIndexFn(index){
                if(index){
                    this.tabIndex = index
                    this.left = index * 132 + 30
                    this.title = this.titleList[index]
                }
            },
            goback(){//判断是返回上一页还是显示tab首页
                this.tabIndex = this.tabIndex ? null : this.$router.back(-1)
            }
        }
    }
</script>

<style scoped lang="less">
    .float_left{
        min-height: 100%;
    }
    .user_info,.title{
        display: none;
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
            img{
                display: none;
            }
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
<style lang="less" scoped>
    //warp版本
    .is_phone{
        .comm_main{
            background: #fff;
        }
        .float_right{
            display: none;
        }
        .user_info{
            text-align: center;
            padding: 20px;
            border-bottom:10px solid #eee;
            display: block;
            img{
                width:74px;
                height: 74px;
                border-radius: 50%;
                border:2px solid #eee;
            }
            p{
                margin-top: 15px;
            }
        }
        .float_left{
            padding: 0;
            min-height: auto;
        }
        .center_tabs{
            border-bottom:none;
            span{
                display: block;
                border-bottom: 1px solid #eee;
                float: none;
                margin: 0;
                margin-left: 16px;
                height: 60px;
                line-height: 60px;
                color: #333;
                background: url(~@/imgs/warp/right.png) no-repeat;
                background-position: 94% center;
                background-size: 6px 11px;
                img{
                    width: 23px;
                    vertical-align: middle;
                    margin-right: 10px;
                    display: inline-block;
                }
            }
            .tab_active_border{
                display: none;
            }
        }
        .title{
            background: #2f3861;
            text-align: center;
            position: relative;
            height: 45px;
            line-height: 45px;
            color: #fff;
            font-size: 16px;
            display: block;
            span{
                background: url(~@/imgs/warp/back.png) no-repeat center;
                background-size: 11px 20px;
                position: absolute;top:0;left:5px;
                width: 45px;
                height: 45px;
            }
        }
        .is_has_child{
            .user_info,.center_tabs{
                display: none;
            }
        }
    }
</style>
<style lang="less">
    //warp版本
    .is_phone{
        .phone_center{
            .header,.footer{
                display: none;
            }
        }
    }
</style>
