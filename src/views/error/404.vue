<template>
    <div class="error">
        <div class="error_main">
            <img src="~css_img/404.png">
            <p>抱歉!  您访问的页面失联啦...</p>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                type:404
            }
        },
        mounted() {
            
        },
        methods: {
            goHome(){
                this.$router.push("/")
                this.$store.state.activeMenu.menuValue = 100000
            },
            goRefresh(){
                this.$router.push("/")
            }
        }
    }
</script>

<style lang="less" scoped>
    .error{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .error_main{
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            .info{
                font-size: 16px;
                color: #89949b;
                margin-top: 10px;
            }
        }
        p{
            font-size: 24px;
            color: #586872;
            margin-top: 50px;
        }
        .bar{
            margin-top: 30px;
            span{
                background: #2babee;
                color: #fff;
                display: inline-block;
                width: 88px;
                line-height: 34px;
                border-radius: 3px;
                margin: 0 28px;
                font-size: 14px;
                cursor: pointer;
                i{
                    margin-right: 5px;
                }
            }
            span:hover{
                background: #11a8f6;
            }
        }
    }
</style>
