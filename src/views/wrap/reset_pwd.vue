<template>
  <div>
    <div class="title"><span @click="$router.back(-1)"></span>忘记密码</div>
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
            <el-form-item label="登录名:" prop="logonName">
              <el-input v-model="formData.logonName" style="width:260px;" placeholder="请输入登录名"></el-input>
            </el-form-item>
            <el-form-item label="证件号:" prop="idCard">
              <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入证件号"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="userName">
              <el-input v-model="formData.userName" style="width:260px;" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <div class="btn" @click="next('ruleForm')">验 证</div>
          </template>
          <template v-if="stempNum == 2">
            <el-form-item label="登录名:">{{formData.logonName}}</el-form-item>
            <el-form-item label="新密码:" prop="newPass">
              <el-input type="password" v-model="formData.newPass" style="width:260px;" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码:" prop="newCheckPass">
              <el-input type="password" v-model="formData.newCheckPass" style="width:260px;" placeholder="请输入再次新密码"></el-input>
            </el-form-item>
            <el-form-item  v-if="msgError">
              <span class="error">{{msgError}}</span>
            </el-form-item>
            <div class="btn-area">
              <div class="cancel" @click="$router.back(-1)">取 消</div>
              <div @click="submit">确 定</div>
            </div>
          </template>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "reset_pwd",
    data() {
      return {
        formData: {
          logonName: '',
          idCard: '',
          userName: '',
          loginName: '',
          newPass: '',
          newCheckPass: ''
        },
        rules: {
          logonName: [
            {required: true, message: '请填写登录名', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请输入证件号', trigger: 'blur'},
            {min:9, message: '证件号格式错误', trigger: 'blur'},
          ],
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          newPass: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          newCheckPass: [
            {required: true, message: '请确认新密码', trigger: 'blur'}
          ],
        },
        stempNum: 1,
        isdialog: true,
        msgError:''
      }
    },
    methods: {
      //下一步
      next(formName) {
        let vm = this;
        vm.$refs[formName].validate((valid) => {
          if (valid) {
            http.post(`/gateway/platform/jiaXiangUser`, vm.formData).then(xhr => {
              if (xhr.data.code) {
              }
              if (xhr.data.data) {
                vm.stempNum = 2;
                vm.formData.userId = xhr.data.data.id;
                vm.formData.loginName = xhr.data.data.logonName;
              } else {
                vm.$message('用户信息验证失败!');
                return
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submit() {
        let vm = this;
        vm.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if (vm.formData.newPass != vm.formData.newCheckPass) {
              vm.msgError = '两次密码不一致';
              return
            } else {
              http.post(`/gateway/platform/jiaXiangUser/resetPassWord`, vm.formData).then(xhr => {
                if (xhr.data.code) {
                  window.hint(
                    {
                      msg: xhr.data.message,
                      type: 'fail'
                    }
                  )
                } else {
                  logout();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .wrap-reset {
    padding-top: 30px;
  }

  .pro_tit {
    border-top: 1px solid #ccc;
    width: 50%;
    margin: 0 auto;
    i {
      width: 20px;
      height: 20px;
      background: #ccc;
      display: inline-block;
      vertical-align: top;
      border-radius: 50%;
      margin-bottom: 10px;
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
        background: #bcc4eb;
      }
    }
  }

  .edit_cont {
    margin-top: 30px;
  }

  .btn-area {
    display: flex;
    justify-content: space-around;
    width: 80%;
    margin: 0 auto;
    div {
      width: 45%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background: #2f3861;
      color: #fff;
      border: 1px solid #2f3861;
      display: inline-block;
      cursor: pointer;
    }
    .cancel {
      background: #fff;
      color: #333;
      border: 1px solid #ccc;
      margin-right: 12px;
    }
  }

  .btn {
    width: 80%;
    position: relative;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: #2f3861;
    color: #fff;
    border: 1px solid #2f3861;
    display: inline-block;
    cursor: pointer;
  }
  .error{
    color: #F56C6C;
    font-size: 12px;
  }
  .title {
    background: #2f3861;
    text-align: center;
    position: relative;
    height: 45px;
    line-height: 45px;
    color: #fff;
    font-size: 16px;
    display: block;
    a {
      color: #fff;
    }
    span {
      background: url(~@/imgs/warp/back.png) no-repeat center;
      background-size: 11px 20px;
      position: absolute;
      top: 0;
      left: 5px;
      width: 45px;
      height: 45px;
    }
  }
</style>
<style lang="less">
  .wrap-reset {
    .el-input {
      width: 85% !important;
    }
  }
</style>
