<template>
  <div class="wrap-reset">
    <div class="pro_tit clearfix">
      <div :class="['pro_item',{'active':stempNum==1}]">
        <i></i>
        <p>验证身份</p>
      </div>
      <div :class="['pro_item',{'active':stempNum==2}]">
        <i></i>
        <p>找回密码</p>
      </div>
    </div>
    <div class="edit_cont">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="110px">
        <template v-if="stempNum == 1">
          <el-form-item label="登录名:" prop="account">
            <el-input v-model="formData.account" style="width:260px;" placeholder="请输入登录名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idCard">
            <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formData.name" style="width:260px;" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn" @click="next('ruleForm')">下一步</div>
          </el-form-item>
        </template>
        <template v-if="stempNum == 2">
          <el-form-item label="登录名:" required="">{{formData.account}}</el-form-item>
          <el-form-item label="新密码:" prop="newPwd">
            <el-input v-model="formData.newPwd" style="width:260px;" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码:" prop="confirmPwd">
            <el-input v-model="formData.confirmPwd" style="width:260px;" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn cancel" @click="handleClose">取 消</div>
            <div class="btn">确 定</div>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "reset_pwd",
    data() {
      return {
        formData: {
          account: '',
          idCard: '',
          name: '',
          newPwd: '',
          confirmPwd: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入登录名', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请输入身份证号', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          newPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          confirmPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
        },
        stempNum: 1,
        isdialog: true
      }
    },
    methods: {
      //下一步
      next(formName) {
        let vm = this;
        vm.$refs[formName].validate((valid) => {
          if (valid) {
            vm.stempNum = 2;
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 取消找回密码
      handleClose() {
        this.$router.back(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .wrap-reset {
    padding-top: 30px;
  }

  .pro_tit {
    border-top: 1px solid #ccc;
    width: 80%;
    margin: 0 auto;
    i {
      width: 20px;
      height: 20px;
      background: #ccc;
      display: inline-block;
      vertical-align: top;
      border-radius: 50%;
      margin-bottom: 20px;
    }
    .pro_item {
      text-align: center;
      width: 50%;
      float: left;
      position: relative;
      top: -10px;
      color: #999;
    }
    .pro_item:first-child {
      right: 22%;
    }
    .pro_item:last-child {
      left: 22%;
    }
    .active {
      color: #333;
      i {
        background: #aa2f33;
      }
    }
  }

  .edit_cont {
    margin-top: 20px;
  }

  .btn {
    width: 95px;
    line-height: 30px;
    text-align: center;
    background: #aa2f33;
    color: #fff;
    border: 1px solid #aa2f33;
    border-radius: 4px;
    margin: 0 auto;
    display: inline-block;
    cursor: pointer;
  }

  .cancel {
    background: #fff;
    color: #333;
    border: 1px solid #ccc;
    margin-right: 12px;
  }
</style>
<style lang="less">
  .wrap-reset {
    .el-input {
      width: 85% !important;
    }
  }
</style>
