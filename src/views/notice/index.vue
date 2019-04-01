<template>
    <div class="comm_main clearfix">
        <div class="comm_item float_left">
            <div class="item_tit">通知公告</div>
            <div class="plan_cont">
                <div class="plan_list" v-for="(item,index) in planList" :key="index">
                    <i class="ico"></i>
                    <div class="plan_tit text_one" @click="noticeDetail(item)">卡机是否回家看电视附近开始的恢复会计师电话费看见当时方会计师电话费看见当时附近开始的恢复会计师对方还看电视剧符号看电视剧</div>
                    <span class="time">2019-09-09</span>
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
                planList:[
                    {
                        id:1,
                        title:'看见爱上发挥的教科书福建省的看法和圣诞节开发速度快',
                        isSign:0
                    },
                    {
                        id:1,
                        title:'看见爱上发挥的教科书福建省的看法和圣诞节开发速度快',
                        isSign:1
                    }
                ],
                
            }
        },
        mounted(){

        },
        methods:{
            noticeDetail(item){
                this.$router.push('/notice/detail')
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
            margin-top: 8px;
        }
        .plan_tit{
            color: #333;
            cursor: pointer;
            margin-left: 10px;
            display: inline-block;
            width: 720px;
        }
        .plan_tit:hover{
            color: #aa2f33;
        }
        .time{float: right;}
    }
</style>
