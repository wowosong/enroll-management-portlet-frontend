<template>
    <div class="comm_main clearfix">
        <div class="comm_item float_left">
            <div class="item_tit">招生计划<span>ENROLLMENT PLAN</span></div>
            <div class="plan_cont">
                <div class="plan_list" v-for="(item,index) in planList" :key="index">
                    <i class="ico"></i>
                    <div class="plan_tit text_one">卡机是否回家看电视附近开始的恢复会计师电话费看见当时方会计师电话费看见当时附近开始的恢复会计师对方还看电视剧符号看电视剧</div>
                    <span class="btn color1" :class="{dis_click:item.isSign == 0}">立即报名</span>
                    <span class="btn">招生简章</span>
                </div>
                <div class="no_data" v-if="!planList || planList.length == 0"></div>
            </div>
        </div>
        <div class="comm_item float_right">
            <div class="campus_tit">全部校区</div>
            <div v-for="(item,index) in campusList" :key="index" class="campus_list">{{item.name}}</div>
            <div class="no_data" v-if="!campusList || campusList.length == 0"></div>
        </div>
    </div>
</template>
<script>
    export default {
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
                campusList:[
                    {
                        name:'接口文档发货就开始对方sdfdshf啊可见度发挥的空间符合可是大家'
                    },
                    {
                        name:'接口文档发货就开始对方'
                    },
                    {
                        name:'接口文档发货就开始对方'
                    }
                ]
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
        .btn.dis_click{
            background: #eee;
            color: #999;
            border:1px solid #bbb;
        }
    }
    .campus_tit{
        border-left: 4px solid #aa2f33;
        padding-left: 16px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        line-height: 16px;
    }
    .campus_list{
        padding:12px 20px 10px 20px;
        color: #666;
        cursor: pointer;
    }
    .campus_list:hover{
        color: #aa2f33;
    }
</style>
