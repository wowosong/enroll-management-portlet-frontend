<template>
    <div class="edit">
        <div class="pro_tit clearfix">
            <div class="pro_item active">
                <i></i>
                <p>验证身份</p>
            </div>
            <div class="pro_item">
                <i></i>
                <p v-if="type == 'name'">修改登录名</p>
                <p v-if="type == 'password'">修改密码</p>
            </div>
        </div>
        <div class="edit_cont">
            <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="120px">
                <template v-if="stempNum == 1">
                    <el-form-item label="当前登录名:">ssssssssss</el-form-item>
                    <el-form-item label="身份证号:" required>
                        <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名:" required>
                        <el-input v-model="formData.name" style="width:260px;" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="btn">下一步</div>
                    </el-form-item>
                </template>

                <template v-if="stempNum == 2 && type == 'name'">
                    <el-form-item label="当前登录名:">ssssssssss</el-form-item>
                    <el-form-item label="新登录名:" required>
                        <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="btn">确定</div>
                    </el-form-item>
                </template>

                <template v-if="stempNum == 2 && type == 'password'">
                    <el-form-item label="当前登录名:">ssssssssss</el-form-item>
                    <el-form-item label="新密码:" required>
                        <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码:" required>
                        <el-input v-model="formData.name" style="width:260px;" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="btn">确定</div>
                    </el-form-item>
                </template>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            type:{
                type:String,
                default:'name'
            }
        },
        data(){
            return{
                formData:{
                    idCard:'',
                    name:''
                },
                rules:{

                },
                stempNum:1
            }
        }
    }
</script>

<style lang="less" scoped>
    .edit{
        width: 60%;
        margin: 0 auto;
        margin-top: 40px;
    }
    .pro_tit{
        border-top:1px solid #ccc;
        width: 200px;
        margin: 0 auto;
        i{
            width: 20px;
            height: 20px;
            background: #ccc;
            display: inline-block;
            vertical-align: top;
            border-radius: 50%;
            margin-bottom: 20px;
        }
        .pro_item{
            text-align: center;
            width: 50%;
            float: left;
            position: relative;
            top: -10px;
            color: #999;
        }
        .pro_item:first-child{
            left: -50px;
        }
        .pro_item:last-child{
            right: -50px;
        }
        .active{
            color: #333;
            i{
                background: #aa2f33;
            }
        }
    }
    .edit_cont{
        margin-top: 40px;
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
        cursor: pointer;
    }
</style>
