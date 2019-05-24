<template>
  <div class="comm_main comm_item">
    <h6 class="detail_tit">{{signInfo.campusName}} {{signInfo.planName}}</h6>
    <div class="cont">
      <p class="info_tit">招生须知>></p>
      <div class="info_list">
        <p>1. 保证你所填报信息真实有效，如有隐瞒或虚报，学校有权取消入学资格；</p>
        <p>2. 学生及监护人认同“嘉祥”的教育理念，并保证支持和配合学校教育教学活动；</p>
        <p>3. 学生及监护人有义务维护学校正常管理秩序，通过正常途径，有理、有据、有节地反馈意见和表达诉求。因家长不当行为影响到学校正常教学秩序的，学校有权对其子女进行教育直至终止《入学协议》；</p>
        <p>4. 学生必须严格遵守国家法律法规和学校规章制度，凡是学生违反校纪校规，学校有权根据学校管理条例对学生做出处理；</p>
        <p>5. 学生在校期间，学生监护人按照相关法律法规对学生进行教育和管理，并承担相应监护责任。</p>
      </div>
      <el-checkbox v-model="isAgree" class="agree">我已同意并了解《招生须知》事项。</el-checkbox>
      <p class="agree_hint">我承诺我所填写信息均真实有效,我愿意承担因信息不真实而应承担的责任</p>
      <div class="btn " :class="{dis_btn:!isAgree}" @click="isAgreeGo">下一步</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isAgree: false,
        signInfo: {
          campusName: '',
          planName: '',
          id: ''
        }
      }
    },
    mounted() {
      this.signInfo = this.$route.query
    },
    methods: {
      isAgreeGo() {
        if (this.isAgree) {
          this.$router.push({path: '/signup', query: this.signInfo})
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .detail_tit {
    font-size: 22px;
    border-bottom: 1px solid #E6E6E6;
    padding: 10px 0 30px 0;
    text-align: center;
    color: #333;
  }

  .comm_item {
    padding: 20px 30px;
  }

  .cont {
    margin: 40px 28px;
  }

  .info_tit {
    color: #2f3861;
    font-size: 16px;
    margin-bottom: 26px;
    font-weight: 600;
  }

  .info_list {
    p {
      margin-bottom: 26px;
    }
  }

  .el-checkbox {
    color: #aa2f33;
    font-size: 12px;
  }

  .agree_hint {
    color: #666;
    font-size: 12px;
  }

  .btn {
    width: 115px;
    line-height: 40px;
    text-align: center;
    background: #aa2f33;
    color: #fff;
    border-radius: 4px;
    margin: 0 auto;
    margin-top: 50px;
    cursor: pointer;
  }

  .dis_btn {
    background: #ccc;
  }
</style>
<style lang="less">
  .agree .el-checkbox__label {
    font-size: 12px;
  }
</style>
