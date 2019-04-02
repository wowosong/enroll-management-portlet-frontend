<template>
  <div>
    <div class="base-header">
      <div class="head">
        <img src="" @error="errorImg($event,'avatar')">
      </div>
      <div>
        <el-row>
          <el-col :span="12" class="col"><span><label>*</label>学生姓名：</span>{{formData.info.name}}</el-col>
          <el-col :span="12" class="col"><span><label>*</label>身份证号：</span>00000000000000000</el-col>
          <el-col :span="12" class="col"><span><label>*</label>出生日期：</span>00000000000000000</el-col>
          <el-col :span="12" class="col"><span><label>*</label>性别：</span>女</el-col>
          <el-col :span="12" class="col"><span>户籍所在地：</span>四川省成都市成华区</el-col>
          <el-col :span="12" class="col"><span>现就读学校：</span>六年级</el-col>
          <el-col :span="12" class="col"><span>现就读年级：</span>六年级</el-col>
          <el-col :span="12" class="col"><span>总分年级排名/年级人数：</span>020/30</el-col>
        </el-row>
      </div>
    </div>
    <div class="user-info-table">
      <div class="table-item">
        <label>监护人:</label>
        <table class="table">
          <thead>
          <tr>
            <th>姓名</th>
            <th>手机</th>
            <th>学历</th>
            <th>工作单位</th>
            <th>职务</th>
          </tr>
          </thead>
          <tbody>
          <!--<tr v-for="item in formData.info.guardianInfo">-->
          <!--<td><input type="text" v-model="item.name"></td>-->
          <!--<td><input type="text" v-model="item.tel"></td>-->
          <!--<td><input type="text" v-model="item.education"></td>-->
          <!--<td><input type="text" v-model="item.workPlace"></td>-->
          <!--<td><input type="text" v-model="item.post"></td>-->
          <!--</tr>-->
          </tbody>
        </table>
      </div>
      <div class="table-item">
        <label>获奖附件:</label>
        <div class="up_idcard" @click="showBig">
          <img src="" @error="errorImg($event,'image')">
          <i class="el-icon-zoom-in"></i>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="login-wrap">
      <p class="login-title">登录密码</p>
      <div class="login-content"><label>*</label><span>登录名：</span>余小云</div>
    </div>
    <div v-if="isShowBig">
      <div class="modal" @click="isShowBig = false"></div>
      <i class="el-icon-close close" @click="isShowBig = false"></i>
      <div class="modal-body">
        <img src="" @error="errorImg($event,'image')">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "baseInfo",
    props:{
      formData:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
        isShowBig: false
      }
    },
    methods: {
      showBig() {
        this.isShowBig = !this.isShowBig
      }
    }
  }
</script>

<style lang="less" scoped>
  .base-header {
    display: flex;
    .head {
      width: 120px;
      height: 150px;
      border: 1px solid #e2e1e1;
      flex-shrink: 0;
      img {
        width: 100%;
      }
    }
    .col {
      margin-bottom: 24px;
      span {
        display: inline-block;
        width: 160px;
        text-align: right;
        color: #666;
        label {
          color: #eb2727;
          margin-right: 8px;
          vertical-align: middle;
        }
      }
    }
  }

  .user-info-table {
    margin-left: 20px;
    .table-item {
      display: flex;
      margin-bottom: 20px;
      label {
        display: inline-block;
        width: 100px;
        text-align: right;
        color: #606266;
        flex-shrink: 0;
        margin-right: 15px;
      }
      .up_idcard {
        border: 1px solid #ccc;
        line-height: 80px;
        height: 100px;
        border-radius: 2px;
        text-align: center;
        width: 140px;
        color: #999;
        display: inline-block;
        vertical-align: top;
        position: relative;
        cursor: pointer;
        i {
          position: absolute;
          right: 16px;
          bottom: 16px;
          font-size: 24px;
          color: #fff;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }

      .table {
        width: 620px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
      .table thead,
      .table tbody tr.tit {
        background: #f7f7f7;
      }
      .table td.tit {
        background: #f7f7f7;
      }
      .table th {
        border-bottom: 1px solid #ccc;
        border-left: 1px solid #ccc;
        height: 40px;
        color: #999;
      }
      .table > tbody > tr > td {
        height: 40px;
        border-bottom: 1px solid #ccc;
        border-left: 1px solid #ccc;
        text-align: center;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    z-index: 999;

  }

  .modal-body {
    position: fixed;
    left: 50%;
    top: 50%;
    max-width: 1182px;
    max-height: 100%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 9999;
    img {
      width: 100%;
    }
  }

  .close {
    position: fixed;
    right: 120px;
    top: 60px;
    font-size: 36px;
    color: #fff;
    z-index: 9999;
    cursor: pointer;
  }
  .login-wrap{
    .login-title{
      color: #666;
      margin-bottom: 30px;
    }
    .login-content{
      text-align: center;
      label {
        color: #eb2727;
        margin-right: 8px;
        vertical-align: middle;
      }
      span {
        color: #666;
    }
    }
  }

  .line{
    border-bottom: 1px solid #e2e1e1;
    margin: 30px 0;
  }
</style>
