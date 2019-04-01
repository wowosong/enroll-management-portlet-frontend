<template>
    <div class="comm_main clearfix">
        <div class="comm_item float_left">
            <h6 class="detail_tit">{{datail.tit}}</h6>
            <div class="notice_about">
                <span>发布时间：2019-6-25</span>
                <span>发布单位：都江堰嘉祥</span>
                <span>浏览量：20</span>
            </div>
            <div class="cont">
                <div v-html="datail.content"></div>
                <div class="files" v-if="datail.files.length > 0">
                    <strong>附件：</strong>
                    <div class="file_ceil" v-for="(file,index) in datail.files" :key="index">
                        <div class="file_name">{{file.fileName}}</div>
                        <span class="down_btn" @click="down(file)">【下载】</span>
                    </div>
                </div>
            </div>
            <div class="no_data" v-if="!datail || datail.content == ''"></div>
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
                datail:{
                    tit:'按时艰苦了飞机迪斯科付款',
                    content:'安科技孵化打卡时间发货多少空间粉红色的水电开发技术对抗速度飞快，士大夫的技术开发水电开发的数据库速度飞快收到回复可见电话反馈。',
                    files:[
                        {fileName:'sajfasdkjfdjdk.png'},
                        {fileName:'sajfasdkjfdjdk.png'}
                    ]
                }
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
