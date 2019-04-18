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
                    <td>请设置密码，建议使用数字、字母、字符的组合密码且长度超过6位，提高密码的安全等级</td>
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
