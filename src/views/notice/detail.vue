<template>
    <div class="comm_main clearfix">
        <div class="comm_item float_left">
            <h6 class="detail_tit">{{datail.noticeTitle}}</h6>
            <div class="notice_about">
                <!--<span v-if="datail.publishTime">发布时间：{{datail.publishTime | dateFormatYmdHms}}</span>-->
                <span>发布单位：{{datail.orgName}}</span>
            </div>
            <div class="cont">
                <div v-html="datail.noticeContent"></div>
                <div class="files" v-if="datail && datail.files">
                    <strong>附件：</strong>
                    <div class="file_ceil" v-for="(file,index) in datail.files" :key="index">
                        <div class="file_name">{{file.fileName}}</div>
                        <span class="down_btn" @click="down(file)">【下载】</span>
                    </div>
                </div>
            </div>
            <!--<div class="no_data" v-if="!datail || datail.noticeContent == ''"></div>-->
        </div>
        <campus @query="goNoticeListFn"></campus>
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
                datail:{
                  files:[]
                }
            }
        },
      mounted() {
        let vm = this;
        vm.datail = JSON.parse(vm.$route.query.datail);
      },
      methods: {
        down(file){
          window.filesystemSingleDownload([{id:file.fileId},{filename:file.fileName}])
        },
        goNoticeListFn(data){
            this.$router.push({path:'/notice',query:{id:data}});
        }
      }
    }
</script>

<style scoped lang="less">
    .notice_about{
        text-align: center;
        span{
            margin:0 15px;
        }
    }
    .float_left{
        min-height: 100%;
    }
    .detail_tit{
        font-size: 22px;
        padding: 10px 0 10px 0;
        text-align: center;
    }
    .cont{
        margin-top: 30px;
        padding-top: 20px;
        border-top:1px solid #E6E6E6;
    }
    .files{
        border:1px dashed #ccc;
        padding: 20px;
        margin-top: 20px;
    }
    .file_ceil{
        margin: 10px 0 0 32px;
        strong{
            float: left;
        }
        div{
            display: inline-block;
            vertical-align: top;
            margin-right: 5px;
        }
        span:hover{
            cursor: pointer;
            color: #06B7ED;
        }
    }
</style>
<style lang="less" scoped>
.is_phone{
    .notice_about{
        span{
            display: block;
        }
    }
}
</style>
<style lang="less">
    .cont{
        img{
            max-width: 100%;
        }
    }
</style>
