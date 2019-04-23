<template>
    <div class="account_about">
        <table class="account_info" v-if="!isEdit">
            <tbody>
                <tr>
                    <td align="right">登录名：</td>
                    <td>{{logonName}}</td>
                    <td>
                      <!--<span class="btn" @click="editFn('name')">修改</span>-->
                    </td>
                </tr>
                <tr>
                    <td align="right">学生姓名：</td>
                    <td>{{userName}}</td>
                    <td></td>
                </tr>
                <tr>
                    <td align="right">身份证号：</td>
                    <td>{{idCard}}</td>
                    <td></td>
                </tr>
                <tr>
                    <td align="right">登录密码：</td>
                    <td><div class="updata_hint">请设置密码，建议使用数字、字母、字符的组合密码且长度超过6位，提高密码的安全等级</div></td>
                    <td><span class="btn" @click="editFn('password')">修改</span></td>
                </tr>
            </tbody>
        </table>
        <edit v-if="isEdit" :type="isEditType"></edit>
    </div>
</template>
<script>
    import edit from './edit.vue'
    export default {
        components:{
            edit
        },
        data(){
            return{
              isEdit:false,
              isEditType:'password',
              userName:window.userInfo.userName,
              idCard:window.userInfo.idCard,
              logonName:window.userInfo.logonName
            }
        },
        methods:{
            editFn(type){
                this.isEditType = type
                this.isEdit = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .account_about{
        padding: 20px 40px;
    }
    .account_info{
        width: 100%;
        margin-left: 20px;
        td{
            height: 40px;
        }
        tr{
            td:first-child{
                color: #666;
            }
        }
    }
    .btn{
        width: 95px;
        line-height: 30px;
        text-align: center;
        background: #aa2f33;
        color: #fff;
        border:1px solid #aa2f33;
        border-radius: 4px;
        margin: 0 auto;
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
    }
</style>
<style lang="less" scoped>
    //warp版本
    .is_phone{
        .account_about{
            padding:0;
        }
        .account_info{
            position: relative;
            width: calc(~'100% - 20px');
            td{
                height: 60px;
                border-bottom: 1px solid #eee;
            }
            tr{
                td:first-child{
                    color: #999;
                    text-align: left;
                    width: 70px;
                }
                td:last-child{
                    text-align: right;
                    padding-right: 10px;
                }
            }
        }
        .updata_hint{
            position: absolute;bottom:-50px;left:0;right:0;
        }
        .btn{
            width: 70px;
            line-height: 30px;
            color: #2f3861;
            border:1px solid #2f3861;
            border-radius: 16px;
            display: block;
            background: none;
            margin: 0;
            float: right;
        }
    }
</style>