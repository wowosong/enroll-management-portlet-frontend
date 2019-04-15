<template>
  <div class="user_info">
    <div class="user_school">
      <span class="school_item">报名校区：锦江校区</span>
      <span class="school_item">报名年级：初一</span>
      <span v-if="!idEdit" class="float_r edit_btn" @click="idEdit = !idEdit">修改</span>
      <span v-if="idEdit" class="import_hint float_r">提示：报名提交后不支持修改"必填项"，只支持修改"非必填项</span>
    </div>
    <div class="show_edit" v-if="idEdit">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="172px">
        <div class="user_img">
          <img src="@/imgs/404.png">
          <div class="upload_btn">上传照片</div>
          <p class="upload_hint">本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</p>
        </div>
        <div class="basic_info clearfix">
          <el-form-item label="学生姓名:" required style="margin-bottom:5px">{{formData.name}}</el-form-item>
          <el-form-item label="身份证号:" required style="margin-bottom:5px">{{formData.idCard}}</el-form-item>
          <el-form-item label="出生日期:" required style="margin-bottom:5px">{{formData.birth}}</el-form-item>
          <el-form-item label="性别:" required style="margin-bottom:5px">{{formData.gender}}</el-form-item>
          <el-form-item label="户籍所在地:">
            <cityPicker :selectedFn="getArea" class="area_margin"></cityPicker>
          </el-form-item>
          <el-form-item label="现就读学校:">
            <el-input v-model="formData.address" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="现就读年级:">
            <el-select v-model="formData.grade" clearable placeholder="请选择" style="width:200px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总分年级排名/年级人数:">
            <el-input v-model="formData.rank" placeholder="年级排名" style="width:98px"></el-input>
            <el-input v-model="formData.number" placeholder="年级人数" style="width:98px"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="监护人:" label-width="82px">
          <table class="table_list">
            <thead>
            <tr>
              <th>姓名</th>
              <th>手机</th>
              <th>学历</th>
              <th>工作单位</th>
              <th>职务</th>
            </tr>
            </thead>
            <tr>
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item label="获奖信息:" label-width="82px">
          <table class="table_list">
            <thead>
            <tr>
              <th>获奖时间</th>
              <th>获奖名称</th>
              <th>奖项等级</th>
            </tr>
            </thead>
            <tr>
              <td>
                <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
              </td>
              <td>
                <el-input placeholder="限20个字"></el-input>
              </td>
              <td>
                <el-input placeholder="限10个字"></el-input>
              </td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item label="获奖附件:" label-width="82px">
          <div class="img_thumbnail">
            <img src="@/imgs/404.png">
            <div class="big_btn_l" @click="showBigImg()"></div>
          </div>
          <div class="upload_item">
            <div class="up_idcard" @click="uploaddDutyFile">
              <template><img src="@/imgs/upload.png">上传责任书</template>
            </div>
            <div class="hint prove">证明您的获奖情况</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="show_info" v-if="!idEdit">
      <table>
        <tbody>
        <tr>
          <td rowspan="4" width="30%"><img src="@/imgs/404.png" class="user_img"></td>
          <td width="84px" align="right">学生姓名：</td>
          <td width="130px">余虹虹</td>
          <td width="162px" align="right">身份证号：</td>
          <td>4444545455555</td>
        </tr>
        <tr>
          <td align="right">出生日期：</td>
          <td>余虹虹</td>
          <td align="right">性别：</td>
          <td>女</td>
        </tr>
        <tr>
          <td align="right">户籍所在地：</td>
          <td>余虹虹</td>
          <td align="right">现就读学校：</td>
          <td>四川大学</td>
        </tr>
        <tr>
          <td align="right">现就读年级：</td>
          <td>余虹虹</td>
          <td align="right">总分年级排名/年级人数：</td>
          <td>2323</td>
        </tr>
        </tbody>
      </table>
      <table>
        <tbody>
        <tr>
          <td width="82px" valign="top" align="right">监护人：</td>
          <td>
            <table class="table_list">
              <thead>
              <tr>
                <th>姓名</th>
                <th>手机</th>
                <th>学历</th>
                <th>工作单位</th>
                <th>职务</th>
              </tr>
              </thead>
              <tr>
                <td>姓名</td>
                <td>手机</td>
                <td>学历</td>
                <td>工作单位</td>
                <td>职务</td>
              </tr>
              <tr>
                <td>姓名</td>
                <td>手机</td>
                <td>学历</td>
                <td>工作单位</td>
                <td>职务</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="82px" valign="top" align="right">获奖信息：</td>
          <td>
            <table class="pin_wink">
              <tbody>
              <tr v-for="i in 5" :key="i">
                <td width="100px">2012-09-09</td>
                <td width="400px">开机按时打卡实践活动看见爱上的卡萨几点开始</td>
                <td>一等奖</td>
              </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td width="82px" valign="top" align="right">获奖附件：</td>
          <td>
            <div class="img_thumbnail">
              <img src="@/imgs/404.png">
              <div class="big_btn_l" @click="showBigImg()"></div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="big_img" v-if="isShowBigImg">
      <div class="img_main">
        <span class="close_btn" @click="isShowBigImg = false"></span>
        <img :src="bigImgUrl + bigFileId">
      </div>
    </div>
  </div>
</template>
<script>
  import cityPicker from '@/components/cityPicker'

  export default {
    components: {
      cityPicker
    },
    data() {
      return {
        // 绑数据
        planInfo: {},
        regInfo: {
          otherData: {},
          parents: [
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
          ],
          rewards: [
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""},
            {s_c: "", s_d: "", s_e: ""}
          ],
        },

        // 原始
        idEdit: false,
        isShowBigImg: false,
        bigFileId: '',
        bigImgUrl: '/gateway/zuul/filesystem/api/data/original/',
        imgUrl: '/gateway/zuul/filesystem/api/image/thumbnail/',
        formData: {
          name: '张三三',
          idCard: 510923199205185908,
          birth: '1992-05-18',
          gender: '女',
          address: "案件司法是解放军爱的飒飒的会计法",
          grade: '0',
          rank: 1,
          number: 1000
        },
        options: [
          {
            value: '0',
            label: '一年级'
          },
          {
            value: '2',
            label: '二年级'
          },
        ],
        rules: {}
      }
    },
    methods: {
      showBigImg() {

      },
      uploaddDutyFile() {

      },
      //省市区组件method
      getArea(e) {

      },
    }
  }
</script>
<style lang="less" scoped>
  .user_school {
    margin: 30px 0 30px 0;
  }

  .import_hint {
    color: #999;
  }

  .float_r {
    float: right;
  }

  .school_item {
    margin-right: 20px;
  }

  .edit_btn {
    color: #aa2f33;
    cursor: pointer;
  }

  .edit_btn:hover {
    color: #de0b12;
  }

  .show_info {
    table {
      width: 100%;
      margin-bottom: 10px;
    }
    .user_img {
      width: 130px;
      height: 170px;
      margin-left: 30px;
    }
  }

  .show_edit {
    position: relative;
    .user_img {
      position: absolute;
      width: 130px;
      left: 40px;
      img {
        width: 130px;
        height: 170px;
        border: 1px solid #ccc;
      }
    }
    .upload_btn {
      border: 1px solid #ccc;
      line-height: 40px;
      text-align: center;
      color: #666;
      margin-top: 20px;
      cursor: pointer;
      background: url('~@/imgs/upload.png') no-repeat 40px center;
      padding-left: 20px;
    }
    .upload_hint {
      font-size: 12px;
      color: #999;
      margin-top: 20px;
    }
    .basic_info {
      margin-left: 180px;
    }
  }

  .table_list {
    width: 100%;
    thead {
      background: #f7f7f7;
      color: #999;
    }
    th{
      font-weight: normal;
    }
    td, th {
      height: 36px;
      border: 1px solid #ddd;
      text-align: center;
    }
  }

  .pin_wink {
    width: 80%;
    td {
      height: 30px;
    }
  }

  .img_thumbnail {
    display: inline-block;
    width: 150px;
    height: 100px;
    border: 1px solid #ccc;
    padding: 4px;
    position: relative;
    vertical-align: top;
    img {
      width: 100%;
      height: 100%;
    }
    .big_btn_l {
      position: absolute;
      top: 2px;
      right: 2px;
      bottom: 2px;
      left: 2px;
      z-index: 1;
      background: url(~@/imgs/big_btn.png) no-repeat rgba(0, 0, 0, .2);
      background-position: 115px 65px;
      cursor: pointer;
    }
  }

  .big_img {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    z-index: 1000;
  }

  .big_img .img_main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }

  .big_img img {
    max-height: 100%;
    max-width: 100%;
  }

  .close_btn {
    width: 36px;
    height: 36px;
    background: url(~@/imgs/close.png) no-repeat;
    display: block;
    position: absolute;
    right: -18px;
    top: -18px;
    cursor: pointer;
  }

  .upload_item {
    display: inline-block;
  }

  .upload_item .up_idcard {
    border: 1px solid #ccc;
    line-height: 100px;
    height: 100px;
    border-radius: 2px;
    text-align: center;
    width: 150px;
    color: #999;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 30px;
  }

  .upload_item .up_idcard img {
    vertical-align: middle;
    margin-right: 5px;
  }

  .upload_item .card {
    float: left;
  }

  .upload_item .hint {
    line-height: 20px;
    padding: 5px 0;
    font-size: 12px;
    width: 160px;
    background: url(~@/imgs/hint.png) no-repeat;
    background-size: 100% 100%;
    padding-left: 18px;
    display: inline-block;
    margin-top: 70px;
  }

  .area_margin {
    margin: 0 !important;
  }
</style>
<style lang="less">
  .table_list {
    .el-input__inner {
      border: none;
    }
  }
</style>


