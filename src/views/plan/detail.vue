<template>
    <div class="comm_main comm_item">
        <h6 class="detail_tit">{{datail.guideTitle}}</h6>
        <div class="cont" v-html="datail.sourceContent"></div>
        <div class="no_data" v-if="!datail || datail.sourceContent == ''"></div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                datail:{}
            }
        },
      mounted() {
        let vm = this;
        vm.datail = vm.$route.query.erEnrollmentGuide
      },
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
