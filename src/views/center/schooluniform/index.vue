<template>
  <div class="uniform-wrap">
    <div class="uniform-header">
      您于<span class="text-red">2018年12月23日</span>完成校服登记~
      <span class="btn" v-if="!isEdit" @click="isEdit =  true">修改</span>
    </div>
    <div class="uniform-main">
      <div class="uniform-prote">
        <span class="uniform-title d-block">亲爱的新嘉祥人：</span>
        <span class="d-block">嘉祥专属的校服将伴随你们在嘉祥求学、生活的美好时光。现在，请将你的身高、体重、尺码等信息告诉我们吧，让我们为你度身定做一身新校服！！</span>
        <span class="d-block">服务电话：<span class="text-red">13568808187/18581525220</span></span>
      </div>
      <el-form class="uniForm" :model="uniForm" :rules="rules" ref="uniForm" label-width="140px">
        <el-form-item label="报名校区：" required>锦江校区</el-form-item>
        <el-form-item label="报名年级：" required>锦江校区</el-form-item>
        <el-form-item label="学生姓名：" required>余虹虹</el-form-item>
        <el-form-item label="性别：" required>女</el-form-item>
        <el-form-item label="监护人1姓名：" required>余悠悠</el-form-item>
        <el-form-item label="监护人1手机号：" required>0000000000</el-form-item>
        <el-form-item label="身高：" prop="height">
          <template v-if="isEdit">
            <el-col :span="6">
              <el-input :min="0" type="number" v-model="uniForm.height"></el-input>
            </el-col>
            <el-col :span="1" class="cpy">CM</el-col>
          </template>
          <template v-else>150CM</template>
          <!--错误信息-->
          <template slot="error" slot-scope="scope">
            <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
          </template>
        </el-form-item>
        <el-form-item label="体重：" prop="weight">
          <template v-if="isEdit">
            <el-col :span="6">
              <el-input :min="0" type="number" v-model="uniForm.weight"></el-input>
            </el-col>
            <el-col :span="1" class="cpy">KG</el-col>
          </template>
          <template v-else>160GK</template>
          <!--错误信息-->
          <template slot="error" slot-scope="scope">
            <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
          </template>
        </el-form-item>
        <el-form-item label="尺码：" prop="size">
          <template v-if="isEdit">
            <el-col :span="6" class="select-size">
              <el-select v-model="uniForm.size" placeholder="请选择">
                <el-option
                  v-for="item in sizes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7" class="cpy">
              <el-input v-model="uniForm.size" placeholder="不确定尺寸,以厂家测量为准"></el-input>
            </el-col>
          </template>
          <template v-else>150B(胖)</template>
          <!--错误信息-->
          <template slot="error" slot-scope="scope">
            <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
          </template>
        </el-form-item>
        <div class="uniform-tip">
          <span>此为定制新校服参考信息，请参考尺码对照表给学生确定尺码。如有疑问，</span>
          <span>请联系服务电话：13568808187/18581525220</span>
        </div>
      </el-form>
      <div class="uniform-size clearfix">
        <p class="uniform-title">尺码对照表</p>
        <div class="img-box"><img src="~@/imgs/boy_size.jpg" alt=""></div>
        <div class="img-box"><img src="~@/imgs/boy_size.jpg" alt=""></div>
      </div>
      <div class="uniform-bottom" v-if="isEdit">
        <div class="text-red">提交前，请您仔细核对所填信息*</div>
        <div class="uniform-check">
          <el-checkbox v-model="checked">是的，我核对清楚了。</el-checkbox>
        </div>
        <div class="uniform-btn">
          <el-button @click="submitForm('uniForm')">提交</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        // 是否可编辑
        isEdit: true,
        //表单验证规则
        rules: {
          height: [
            {required: true, message: '必填项', trigger: 'blur'},
          ],
          weight: [
            {required: true, message: '必填项', trigger: 'blur'},
          ],
          size: [
            {required: true, message: '必填项', trigger: 'blur'},
          ]
        },
        //表单提交信息
        uniForm: {
          height: '',
          weight: '',
          size: '',
        },
        checked: false,
        //  尺码下拉数据
        sizes: [
          {value: '1', label: '120A(标准)'}
        ]
      }
    },
    methods: {
      submitForm(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!vm.checked) {
              vm.$message.warning('请同意所填信息')
            }
            vm.isEdit = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .uniform-wrap {
    .uniform-header {
      line-height: 28px;
      padding: 20px 0;
      border-bottom: 1px solid #E6E6E6;
    }
    .btn {
      cursor: pointer;
      width: 60px;
      float: right;
      text-align: center;
      line-height: 28px;
      color: #2f3861;
      border: 1px solid #2f3861;
      border-radius: 4px;
      display: block;
    }
    .uniform-header::before {
      content: "";
      display: inline-block;
      width: 28px;
      height: 28px;
      background: url(~@/imgs/pass.png) no-repeat;
      background-size: contain;
      vertical-align: middle;
    }
    .uniform-main {
      .uniform-prote {
        line-height: 22px;
        color: #999;
        padding: 20px 0;
        border-bottom: 1px solid #E6E6E6;
        .d-block:not(:first-child) {
          margin-left: 13px;
        }
      }
      .uniform-title {
        border-left: 6px solid #aa2f33;
        padding-left: 10px;
      }
      .uniForm {
        .cpy {
          margin-left: 6px;
        }
        .uniform-tip {
          margin-left: 140px;
          font-size: 12px;
          color: #aa2f33;
          line-height: 22px;
          span {
            display: block;
          }
        }
        .error-info {
          color: #F56C6C;
          font-size: 12px;
          i {
            margin-left: 10px;
            margin-right: 5px;
          }
        }
      }
      .uniform-size {
        border-top: 1px solid #E6E6E6;
        padding: 20px 0 0;
        .img-box {
          width: 50%;
          float: left;
          margin-top: 24px;
          img {
            width: 100%;
          }
        }
      }
      .uniform-bottom {
        line-height: 32px;
        .uniform-btn {
          width: 118px;
          margin-top: 8px;
          button {
            width: 100%;
            background: #2f3861;
            color: #fff;
          }
        }
      }
    }

    .text-red {
      color: #aa2f33;
    }
    .d-block {
      display: block;
    }
  }
</style>
<!--wrap-->
<style lang="less" scoped>
  .is_phone {
    .uniform-wrap {
      padding: 0 12px 16px;
      .uniform-main{
        .uniform-size{
          .img-box{
            width: 100%;
          }
        }
      }
      .uniForm{
        .uniform-tip{
          margin-left: 0;
          span{
            display: initial;
          }
        }
      }
      .uniform-bottom{
        line-height: 40px;
        .uniform-check{
          border: 1px solid #E6E6E6;
          padding: 0 8px;
        }
        .uniform-btn{
          margin: 12px auto 0;
        }
      }
    }
    .el-col-6 {
      width: 80%;
    }
    .select-size{
      width: 100%;
    }
    .el-col-7{
      width: 100%;
    }
    .el-col-1{
      width: auto;
    }
  }
</style>
