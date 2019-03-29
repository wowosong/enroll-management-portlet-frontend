<template>
    <div class="comm_main comm_item">
        <h6 class="detail_tit">{{datail.tit}}</h6>
        <div class="cont" v-html="datail.content"></div>
        <div class="no_data" v-if="!datail || datail.content == ''"></div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                datail:{
                    tit:'按时艰苦了飞机迪斯科付款',
                    content:'安科技孵化打卡时间发货多少空间粉红色的水电开发技术对抗速度飞快，士大夫的技术开发水电开发的数据库速度飞快收到回复可见电话反馈。'
                }
            }
        }
    }
</script>
<style scoped lang="less">
    .detail_tit{
        font-size: 22px;
        border-bottom:1px solid #E6E6E6;
        padding: 10px 0 30px 0;
        text-align: center;
    }
    .comm_item{
        padding: 20px 30px;
    }
    .cont{
        margin-top: 20px;
    }
</style>
