<template>
  <div class="edit">
    <div class="pro_tit clearfix">
      <div class="pro_item" :class="{active:stempNum == 1}">
        <i></i>
        <p>验证身份</p>
      </div>
      <div class="pro_item" :class="{active:stempNum == 2}">
        <i></i>
        <p v-if="type == 'name'">修改登录名</p>
        <p v-if="type == 'password'">修改密码</p>
      </div>
    </div>
    <div class="edit_cont">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="120px">
        <template v-if="stempNum == 1">
          <el-form-item label="当前登录名:">{{logonName}}</el-form-item>
          <el-form-item label="证件号:" prop="idCard">
            <el-input :maxlength="18" v-model="formData.idCard" style="width:260px;" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="姓名:" prop="userName">
            <el-input v-model="formData.userName" style="width:260px;" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="btn" @click="nextStep()">下一步</div>
          </el-form-item>
        </template>

        <template v-if="stempNum == 2 && type == 'name'">
          <el-form-item label="当前登录名:">{{logonName}}</el-form-item>
          <el-form-item label="新登录名:" required>
            <el-input v-model="formData.idCard" style="width:260px;" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="btn">确定</div>
          </el-form-item>
        </template>

        <div v-if="stempNum == 2 && type == 'password'">
          <el-form-item label="当前登录名:">{{logonName}}</el-form-item>
          <el-form-item label="新密码:" prop="newPass">
            <input type="password" maxlength="18" v-model="formData.newPass" style="width:260px;" placeholder="请输入"
                   class="password_s">
          </el-form-item>
          <el-form-item label="确认新密码:" prop="newCheckPass">
            <input type="password" maxlength="18" v-model="formData.newCheckPass" style="width:260px;" placeholder="请输入"
                   class="password_s">
          </el-form-item>
          <el-form-item label-width="0">
            <div class="btn" @click="submit">确定</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'name'
      }
    },
    data() {
      // 验证身份证/护照号
      let checkIdCard = (rule, value, callback) => {
        let pattern = /^[a-zA-Z0-9]{6,18}$/;
        if (!pattern.test(this.formData.idCard)) {
          return callback(new Error('身份证/护照号为6-18位数字和字母组合'));
        } else {
          callback();
        }
      };
      return {
        formData: {
          idCard: '',
          userName: '',
          id: '',
          newPass: '',
          newCheckPass: '',
          loginName: ''
        },
        logonName: window.userInfo.logonName,
        rules: {
          idCard: [
            {required: true, message: "证件号不能为空!", trigger: "blur"},
            {validator: checkIdCard, trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}

          ],
          userName: [
            {required: true, message: "姓名不能为空!", trigger: "blur"}
          ],
          newPass: [
            {required: true, message: "新密码不能为空!", trigger: "blur"},
            {min: 6, max: 18, message: '密码长度在6-18位之间', trigger: 'blur'}
          ],
          newCheckPass: [
            {required: true, message: "确认密码不能为空!", trigger: "blur"},
            {min: 6, max: 18, message: '密码长度在6-18位之间', trigger: 'blur'}
          ],
        },
        stempNum: 1,
        isNextFalg: false
      }
    },
    mounted() {

    },
    methods: {
      isNextFalgFn() {
        this.$refs.ruleForm.validateField('idCard');
        this.$refs.ruleForm.validateField('userName');

        let pattern = /^[a-zA-Z0-9]{6,18}$/;
        if (this.formData.idCard == '' || this.formData.userName == '' || !pattern.test(this.formData.idCard)) {
          return this.isNextFalg = false
        } else {
          return this.isNextFalg = true
        }
      },
      nextStep() {
        let vm = this;
        if (this.isNextFalgFn()) {
          if (vm.type == 'password') {
            vm.formData.id = window.userInfo.id;
          }
          http.post(`/gateway/platform/jiaXiangUser`, vm.formData).then(xhr => {
            if (xhr.data.code) {
            }
            if (xhr.data.data) {
              vm.stempNum = 2
            } else {
              vm.$message('用户信息验证失败!');
              return
            }
          })
        }
      },
      submit() {
        let vm = this;
        vm.formData.loginName = window.userInfo.logonName;
        vm.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if (vm.formData.newPass != vm.formData.newCheckPass) {
              vm.$message('密码不一致!');
              return;
            } else {
              http.post(`/gateway/platform/jiaXiangUser/resetPassWord`, vm.formData).then(xhr => {
                if (xhr.data.code) {
                  vm.$message.warning(xhr.data.message);
                } else {
                  //todo 需要登出并清除cookies
                  logout();
                }
              })
            }
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .edit {
    width: 60%;
    margin: 0 auto;
    margin-top: 40px;
  }

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
    margin-left: 120px;
  }

  .password_s {
    line-height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 15px;
  }
</style>
<style lang="less" scoped>
  //warp版本
  .is_phone {
    .edit {
      width: 100%;
    }
    .el-input {
      width: auto !important;
      margin-right: 20px;
      display: block;
    }
    .btn {
      width: auto;
      line-height: 45px;
      text-align: center;
      background: #2f3861;
      color: #fff;
      border: 1px solid #2f3861;
      border-radius: 4px;
      cursor: pointer;
      display: block;
      border-radius: 0;
      margin: 10px 20px;
    }
    .pro_tit {
      .active {
        i {
          background: #bcc4eb;
        }
      }
    }
  }
</style>
