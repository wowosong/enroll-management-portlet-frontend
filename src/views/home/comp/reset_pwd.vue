<template>
  <div>
    <el-dialog title="找回密码" :visible.sync="isdialog" width="460px" @close="handleClose">
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
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="120px">
          <template v-if="stempNum == 1">
            <el-form-item label="登录名:" prop="logonName">
              <el-input v-model="formData.logonName" style="width:260px;" placeholder="请输入登录名"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idCard">
              <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="userName">
              <el-input v-model="formData.userName" style="width:260px;" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="btn" @click="next('ruleForm')">下一步</div>
            </el-form-item>
          </template>
          <template v-if="stempNum == 2">
            <el-form-item label="登录名:" required="">{{formData.logonName}}</el-form-item>
            <el-form-item label="新密码:" prop="newPass">
              <el-input v-model="formData.newPass" style="width:260px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码:" prop="newCheckPass">
              <el-input v-model="formData.newCheckPass" style="width:260px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="btn cancel" @click="handleClose">取 消</div>
              <div class="btn" @click="submit">确 定</div>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "reset_pwd",
    data() {
      return {
        formData: {
          logonName:'',
          loginName:'',
          idCard: '',
          userId:'',
          userName: '',
          newPass:'',
          newCheckPass:''
        },
        rules: {
          logonName: [
            { required: true, message: '请输入登录名', trigger: 'blur' }
          ],
          idCard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          newPass: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          newCheckPass: [
            { required: true, message: '请输入确认密码', trigger: 'blur' }
          ],
        },
        stempNum: 1,
        isdialog:true
      }
    },
    computed:{
      isShow: vm => vm.showResetPwd
    },
    methods: {
      //下一步
      next(formName) {
        let vm = this;
        vm.$refs[formName].validate((valid) => {
          if (valid) {
            http.post(`/gateway/platform/jiaXiangUser`, vm.formData).then(xhr => {
              if (xhr.data.code){}
              if(xhr.data.data) {
                vm.stempNum = 2;
                vm.formData.userId = xhr.data.data.id;
                vm.formData.loginName = xhr.data.data.logonName;
              } else {
                vm.$message('用户信息验证失败!');
                return
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submit(){
        let vm = this;
        vm.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if(vm.formData.newPass != vm.formData.newCheckPass) {
              vm.$message('密码不一致!');
              return;
            } else {
              http.post(`/gateway/platform/jiaXiangUser/resetPassWord`, vm.formData).then(xhr => {
                if (xhr.data.code){
                  window.hint(
                    {
                      msg:xhr.data.message,
                      type:'fail'
                    }
                  )
                }else{
                  //todo 需要登出并清除cookies
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      // 取消找回密码
      handleClose() {
        let vm = this;
        vm.isdialog = false;
        vm.$emit('cancelFn')
      }
    }
  }
</script>

<style lang="less" scoped>
  .pro_tit {
    border-top: 1px solid #ccc;
    width: 200px;
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
      left: -50px;
    }
    .pro_item:last-child {
      right: -50px;
    }
    .active {
      color: #333;
      i {
        background: #aa2f33;
      }
    }
  }

  .edit_cont {
    margin-top: 40px;
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
  .cancel{
    background: #fff;
    color: #333;
    border: 1px solid #ccc;
    margin-right: 12px;
  }
</style>
