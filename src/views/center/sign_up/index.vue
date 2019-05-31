<template>
  <div class="basic_info" v-loading="saving">
    <template v-if="!enrollShow">
      <template v-if="!addrewardsFlag && !addparentFlag && !rankFlag">
        <div class="user_school">
          <span class="school_item">报名校区：{{planInfo.campusName}}</span>
          <span class="school_item">报名年级：{{planInfo.gradeName}}</span>
          <span v-if="editBtn && !Boolean($route.query.enroll)" class="float_r edit_btn"
                @click="idEdit = true">修改</span>
          <!-- <span v-if="idEdit" class="import_hint float_r">提示：报名提交后不支持修改"必填项"，只支持修改"非必填项</span> -->
        </div>
        <div class="show_edit" v-if="idEdit">
          <el-form :model="regInfo" :rules="rules" ref="ruleForm" :label-width="isPhone ? '112px' : '172px'">
            <p class="basic_tit">基本信息</p>
            <div class="user_img clearfix">
              <template v-if="isPhone">
                <div class="upload_btn">上传照片<span>:</span></div>
                <div class="head-wrap">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :multiple="true"
                    :accept="'image/*'"
                    :on-success="handleAvatarSuccess">
                    <img v-if="!regInfo.photoId" src="@/imgs/warp/head.png"/>
                    <img v-if="regInfo.photoId" :src="imgUrl+regInfo.photoId">
                  </el-upload>
                </div>
              </template>
              <template v-else>
                <img :src="imgUrl+regInfo.photoId" @error="errorImg($event,'avatar')" @click="uploadPicture">
                <div class="upload_btn" @click="uploadPicture">上传照片<span>:</span></div>
              </template>
              <p class="upload_hint">本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</p>
            </div>
            <div class="basic_info clearfix">
              <el-form-item label="学生姓名:" required style="margin-bottom:5px">
                {{regInfo.stuName}}
              </el-form-item>
              <el-form-item label="证件号:" required style="margin-bottom:5px">
                {{regInfo.idCard}}
              </el-form-item>
              <el-form-item label="出生日期:" required style="margin-bottom:5px">
                {{regInfo.stuBirthday | dateFormatYmd}}
              </el-form-item>
              <el-form-item label="性别:" required style="margin-bottom:5px">
                {{genderMap[regInfo.stuGender]}}
              </el-form-item>
              <el-form-item label="户籍所在地:" prop="stuAdds" :required="isrequired">
                <el-col :span="12">
                  <template v-if="!isEditInfo">
                    {{regInfo.localStr}}
                  </template>
                  <template v-else>
                    <el-cascader
                      filterable
                      :options="addList"
                      v-model="regInfo.stuAdds"/>
                  </template>
                </el-col>
              </el-form-item>
              <el-form-item label="现就读学校:" prop="nowSchool">
                <el-col :span="12">
                  <template v-if="!isEditInfo">
                    {{regInfo.nowSchool}}
                  </template>
                  <template v-else>
                    <el-autocomplete style="width: 100%" v-model="regInfo.nowSchool" :fetch-suggestions="querySearch"
                                     placeholder="请填写"/>
                  </template>
                </el-col>
              </el-form-item>
              <el-form-item label="现就读年级:" prop="nowGrade">
                <el-col :span="12">
                  <template v-if="!isEditInfo">
                    {{regInfo.nowGradeName}}
                  </template>
                  <template v-else>
                    <el-select clearable v-model="regInfo.nowGrade">
                      <el-option
                        v-for="item in gradeList"
                        :key="item.id"
                        :label="item.gradeName"
                        :value="item.id"/>
                    </el-select>
                  </template>
                </el-col>
              </el-form-item>
            </div>
            <template v-if="!isPhone">
              <el-form-item label="考试成绩:" v-if="planInfo.phaseName  == '高中'">
                <table class="table_list">
                  <thead>
                  <tr>
                    <th>考试名称</th>
                    <th>年级排名(名)</th>
                    <th>年级人数(人)</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="ksmcArr.length" v-for="(i, idx) in regInfo.gradeRank" :key="i.s_v" class="input-no-border">
                    <td>
                      <span v-if="idx < 2" style="color: #f00;">*</span>
                      <span>{{i.vName}}</span>
                    </td>
                    <td>
                      <el-input
                        type="number"
                        :min="1"
                        :step="1"
                        placeholder="请填写"
                        v-model="i['s_a']"/>
                    </td>
                    <td>
                      <el-input
                        type="number"
                        :min="1"
                        :step="1"
                        placeholder="请填写"
                        v-model="i['s_b']"/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-form-item>
              <el-form-item label="监护人:" prop="parentsV">
                <table class="table_list">
                  <thead>
                  <tr>
                    <th>姓名(关系)</th>
                    <th>手机</th>
                    <th>学历</th>
                    <th>工作单位</th>
                    <th>职务</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="i in 2" :key="i">
                    <td>
                      <template v-if="i == 1">{{regInfo.parents[i-1]['s_g']}}</template>
                      <el-input placeholder="示例：张三（父子）" :maxlength="20" v-model="regInfo.parents[i-1]['s_g']" v-else/>
                    </td>
                    <td>
                      <template v-if="i == 1">{{regInfo.parents[i-1]['s_h']}}</template>
                      <el-input :maxlength="20" v-model="regInfo.parents[i-1]['s_h']" v-else/>
                    </td>
                    <td>
                      <el-input :maxlength="10" v-model="regInfo.parents[i-1]['s_i']"/>
                    </td>
                    <td>
                      <el-input :maxlength="50" v-model="regInfo.parents[i-1]['s_j']"/>
                    </td>
                    <td>
                      <el-input :maxlength="30" v-model="regInfo.parents[i-1]['s_k']"/>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </el-form-item>
              <el-form-item label="获奖信息:" v-if="planInfo.phaseName  == '高中'">
                <table class="table_list">
                  <thead>
                  <tr>
                    <th width="140px">获奖时间</th>
                    <th>获奖名称</th>
                    <th>奖项等级</th>
                    <th>奖项范围</th>
                    <th>奖项类别</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="i in rewardRows" :key="i">
                    <td>
                      <el-date-picker
                        placeholder="年/月/日"
                        v-model="regInfo.rewards[i-1]['s_c']"
                        type="date"/>
                    </td>
                    <td>
                      <el-input
                        placeholder="奖项名称（限20字）"
                        :maxlength="20"
                        v-model="regInfo.rewards[i-1]['s_d']"/>
                    </td>
                    <td>
                      <el-input
                        placeholder="奖项等级（限10字）"
                        :maxlength="10"
                        v-model="regInfo.rewards[i-1]['s_e']"/>
                    </td>
                    <td>
                      <el-select v-model="regInfo.rewards[i-1]['s_t']" clearable placeholder="请选择">
                        <el-option
                          v-for="item in enumMap['s_t']"
                          :key="item.seiValue"
                          :label="item.seiName"
                          :value="item.seiValue"/>
                      </el-select>
                    <td>
                      <el-select v-model="regInfo.rewards[i-1]['s_u']" clearable placeholder="请选择">
                        <el-option
                          v-for="item in enumMap['s_u']"
                          :key="item.seiValue"
                          :label="item.seiName"
                          :value="item.seiValue"/>
                      </el-select>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div class="reward-bottom">
                  <div class="table-item-tag">填写示例：2018年3月1日 四川省级科创比赛 一等奖 省级 艺术奖</div>
                  <div class="sign-btn reward-btn">
                    <span class="save" @click="addRewardRows">添加一行</span>
                    <span class="cancel" @click="delRewardRows">删除一行</span>
                  </div>
                </div>
              </el-form-item>
            </template>
            <template v-if="isPhone">
              <div class="parents_info" v-if="planInfo.phaseName  == '高中'">
                <p class="basic_tit">考试成绩</p>
                <div v-for="(i,idx) in regInfo.gradeRank" :key="idx" class="phone_parents_item">
                  <div class="parent_name">
                    考试名称：{{i.vName}}
                  </div>
                  <div class="parent_about">
                    <el-form-item label="年级排名(名)" :required="idx < 2">
                      <template v-if="!isEditInfo">{{i['s_a']}}</template>
                      <template v-else>
                        <el-input :min="0" :maxlength="6" v-model="i['s_a']" placeholder="请输入"></el-input>
                      </template>
                    </el-form-item>
                    <el-form-item label="年级人数(人)" :required="idx < 2">
                      <template v-if="!isEditInfo">{{i['s_b']}}</template>
                      <template v-else>
                        <el-input :min="0" :maxlength="6" v-model="i['s_b']" placeholder="请输入"></el-input>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="parents_info">
                <p class="basic_tit">监护人信息<span v-if="parentsLength < 2 && isEditInfo"
                                                @click="addparentFlagFn">添加</span>
                </p>
                <div v-for="(i,index) in parentsLength" :key="index" class="phone_parents_item">
                  <div class="parent_name">
                    姓名(关系):{{regInfo.parents[i-1]['s_g']}}
                    <span v-if="index > 0 && isEditInfo" class="edit_btn"
                          @click="editParentFn(index,regInfo.parents[i-1])"></span>
                  </div>
                  <div class="parent_about">
                    <span v-if="regInfo.parents[i-1]['s_h']">手机:{{regInfo.parents[i-1]['s_h']}}</span>
                    <span v-if="regInfo.parents[i-1]['s_i']">学历:{{regInfo.parents[i-1]['s_i']}}</span>
                    <span v-if="regInfo.parents[i-1]['s_j']">工作单位:{{regInfo.parents[i-1]['s_j']}}</span>
                  </div>
                  <div class="parent_address">职务:{{regInfo.parents[i-1]['s_k']}}</div>
                </div>
              </div>
              <div class="reward_info" v-if="planInfo.phaseName  == '高中'">
                <p class="basic_tit">获奖信息<span v-if="rewardsLength < 3 && isEditInfo"
                                               @click="addrewardsFlagFn">添加</span>
                </p>
                <div v-for="(i,index) in rewardsLength" :key="index" class="phone_parents_item">
                  <div class="parent_name">{{regInfo.rewards[i-1]['s_d']}}
                    <span class="edit_btn" v-if="isEditInfo" @click="editRewardFn(index,regInfo.rewards[i-1])"></span>
                  </div>
                  <div class="parent_about">
                    <span v-if="regInfo.rewards[i-1]['s_e']">{{regInfo.rewards[i-1]['s_e']}}</span>
                    <span v-if="regInfo.rewards[i-1]['s_c']">{{regInfo.rewards[i-1]['s_c']}}</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="planInfo.phaseName  == '高中'">
              <el-form-item label="获奖附件:">
                <div class="img_box">
                  <div class="img_thumbnail" v-for="(file,fid) in fileList" :key="fid"
                       v-if="fileList && fileList.length>0">
                    <img @error="errorImg($event,'image')" :src="imgUrl+file.fileId">
                    <i v-if="isEditInfo" class="big_btn_l el-icon-close delete-icon" @click="fileList.splice(fid, 1)"></i>
                    <div v-if="!isEditInfo" class="big_btn_l big_btn_bg" @click="showBigImg(file.fileId)"></div>
                  </div>
                  <div class="upload_item" v-if="!isPhone">
                    <div class="up_idcard" @click="uploadEnclosure">
                      <template><img src="@/imgs/upload.png">上传证件</template>
                    </div>
                    <div class="hint prove">请上传证书扫描件：格式为jpg、png等图片形式</div>
                  </div>

                  <el-upload
                    class="phone_upload_img"
                    v-if="isPhone"
                    :action="uploadUrl"
                    :multiple="true"
                    :show-file-list="false"
                    :file-list="fileList"
                    :accept="'image/*'"
                    :on-success="phoneEnclosure">
                    <div class="file-list">
                  <span>
                      <img src="@/imgs/warp/default.png" class="org-img">
                  </span>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </template>
            <div :style="isPhone?'padding: 0 16px':''">
              <el-form-item prop="eduConcept" v-if="planInfo.phaseName  != '高中'" label="家庭教育理念:">
                <template v-if="!isEditInfo">
                  {{regInfo.eduConcept}}
                </template>
                <template v-else>
                  <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="regInfo.eduConcept"></el-input>
                </template>
              </el-form-item>
            </div>
          </el-form>
          <div class="sign-btn" v-if="saveBtn">
            <span class="save" @click="saveInfo">保存</span>
            <span class="cancel" @click="cancel">取消</span>
          </div>
        </div>
        <div class="show_info" v-if="!idEdit">
          <table>
            <tbody>
            <tr>
              <td rowspan="4" width="30%">
                <img :src="imgUrl+regInfo.photoId" class="user_img" @error="errorImg($event,'avatar')">
              </td>
              <td width="84px" align="right">学生姓名：</td>
              <td width="150px">{{regInfo.stuName}}</td>
              <td width="200px" align="right">证件号：</td>
              <td>{{regInfo.idCard}}</td>
            </tr>
            <tr>
              <td align="right">出生日期：</td>
              <td>{{regInfo.stuBirthday | dateFormatYmd}}</td>
              <td align="right">性别：</td>
              <td>{{genderMap[regInfo.stuGender]}}</td>
            </tr>
            <tr>
              <td align="right">户籍所在地：</td>
              <td>
              <span
                style="width:150px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;display: inline-block"
                :title="regInfo.localStr">{{regInfo.localStr}}</span>
              </td>
              <td align="right">现就读学校：</td>
              <td>{{regInfo.nowSchool}}</td>
            </tr>
            <tr>
              <td align="right">现就读年级：</td>
              <td>{{regInfo.nowGradeName}}</td>
            </tr>
            </tbody>
          </table>
          <table v-if="planInfo.phaseName  == '高中'">
            <tbody>
            <tr>
              <td width="110px" valign="top" align="right">考试成绩：</td>
              <td>
                <table class="table_list table-overflow">
                  <thead>
                  <tr>
                    <th>考试名称</th>
                    <th>年级排名(名)</th>
                    <th>年级人数(人)</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="ksmcArr.length" v-for="i in regInfo.gradeRank" :key="i.s_v">
                    <td :title="i.vName">
                      <span>{{i.vName}}</span>
                    </td>
                    <td :title="i['s_a']">
                      {{i['s_a']}}
                    </td>
                    <td :title="i['s_b']">
                      {{i['s_b']}}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <td width="110px" valign="top" align="right">监护人：</td>
              <td>
                <table class="table_list table-overflow">
                  <thead>
                  <tr>
                    <th width="100px">姓名(关系)</th>
                    <th width="100px">手机</th>
                    <th width="100px">学历</th>
                    <th width="100px">工作单位</th>
                    <th width="100px">职务</th>
                  </tr>
                  </thead>
                  <tr v-for="i in 2" :key="i">
                    <td :title="regInfo.parents[i-1]['s_g']">
                      {{regInfo.parents[i-1]['s_g']}}
                    </td>
                    <td :title="regInfo.parents[i-1]['s_h']">
                      {{regInfo.parents[i-1]['s_h']}}
                    </td>
                    <td :title="regInfo.parents[i-1]['s_i']">
                      {{regInfo.parents[i-1]['s_i']}}
                    </td>
                    <td :title="regInfo.parents[i-1]['s_j']">
                      {{regInfo.parents[i-1]['s_j']}}
                    </td>
                    <td :title="regInfo.parents[i-1]['s_k']">
                      {{regInfo.parents[i-1]['s_k']}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr v-if="planInfo.phaseName  == '高中'">
              <td width="110px" valign="top" align="right">
                <div style="line-height:30px">获奖信息：</div>
              </td>
              <td>
                <table class="table_list table-overflow">
                  <thead>
                  <tr>
                    <th width="100px">获奖时间</th>
                    <th width="100px">奖项名称</th>
                    <th width="100px">奖项等级</th>
                    <th width="100px">奖项范围</th>
                    <th width="100px">奖项类别</th>
                  </tr>
                  </thead>
                  <tr v-for="(item, idx) in regInfo.rewards" :key="idx">
                    <template v-if="item['s_c'] && item['s_d'] && item['s_e']">
                      <td :title="item['s_c'] | dateFormatYmdW">{{item['s_c'] | dateFormatYmdW}}</td>
                      <td :title="item['s_d']">{{item['s_d']}}</td>
                      <td :title="item['s_e']">{{item['s_e']}}</td>
                      <td :title="item['s_t']">{{item['s_t']}}</td>
                      <td :title="item['s_u']">{{item['s_u']}}</td>
                    </template>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-if="planInfo.phaseName  == '高中'">
              <td width="110px" valign="top" align="right">获奖附件：</td>
              <td>
                <div v-if="regInfo.rewardFile && regInfo.rewardFile.length > 0">
                  <div class="img_thumbnail" v-for="(file,fid) in regInfo.rewardFile" :key="fid">
                    <img
                      v-if="file.fieldValue"
                      :src="imgUrl+file.fieldValue"
                      @error="errorImg($event,'image')">
                    <div class="big_btn_l big_btn_bg" @click="showBigImg(file.fieldValue)"></div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="planInfo.phaseName != '高中'">
              <td width="110px" valign="top" align="right">家庭教育理念：</td>
              <td>{{regInfo.eduConcept}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="big_img" v-if="isShowBigImg">
          <div class="img_main">
            <span class="close_btn" @click="isShowBigImg = false"></span>
            <img :src="imgUrl+bigimgId">
          </div>
        </div>
      </template>
      <div class="addparentFlag" v-if="addparentFlag">
        <el-form ref="form_parent" :model="formParent" label-width="100px">
          <el-form-item label="姓名(关系)">
            <el-input v-model="formParent.s_g" placeholder="示例：张三（父子）"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formParent.s_h" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="学历">
            <el-input v-model="formParent.s_i" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="formParent.s_j" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="工作单位">
            <el-input v-model="formParent.s_k" placeholder="请输入"></el-input>
          </el-form-item>
          <div class="sign-btn">
            <span class="save" @click="saveParent">保存</span>
          </div>
        </el-form>
      </div>
      <div class="addrewardsFlag" v-if="rankFlag">
        <el-form :model="formRank" label-width="120px">
          <el-form-item label="考试名称">
            {{formRank.vName}}
          </el-form-item>
          <el-form-item label="年级排名(名)">
            <el-input :min="0" :maxlength="6" v-model="formRank.s_a" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="年级人数(人)">
            <el-input :min="0" :maxlength="6" v-model="formRank.s_b" placeholder="请输入"></el-input>
          </el-form-item>
          <div class="sign-btn">
            <span class="save" @click="saveRank">保存</span>
          </div>
        </el-form>
      </div>
      <div class="addrewardsFlag" v-if="addrewardsFlag">
        <el-form ref="form_rewards" :model="formRewards" label-width="72px">
          <el-form-item label="获奖时间">
            <el-date-picker
              v-model="formRewards.s_c"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="奖项名称">
            <el-input v-model="formRewards.s_d" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="奖项等级">
            <el-input v-model="formRewards.s_e" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="奖项范围:">
            <el-select v-model="formRewards.s_t" clearable placeholder="请选择">
              <el-option
                v-for="item in enumMap['s_t']"
                :key="item.seiValue"
                :label="item.seiName"
                :value="item.seiValue"/>
            </el-select>
          </el-form-item>
          <el-form-item label="奖项类别:">
            <el-select v-model="formRewards.s_u" clearable placeholder="请选择">
              <el-option
                v-for="item in enumMap['s_u']"
                :key="item.seiValue"
                :label="item.seiName"
                :value="item.seiValue"/>
            </el-select>
          </el-form-item>
          <div class="sign-btn">
            <span class="save" @click="saveRewards">保存</span>
          </div>
        </el-form>
      </div>
    </template>
    <template v-else>
      <div class="sheet-wrap">
        <i class="el-icon-circle-check sheet"></i>
        <p class="sumbit-tip">已提交</p>
        <p class="tips-date">
          提交时间:{{new Date() | dateFormatYmdHms}}
        </p>
      </div>
    </template>
  </div>
</template>
<script>

  export default {
    data() {
      var parentsVFn = (rule, value, callback) => {
        let parents = this.regInfo.parents
        let isFlag = false
        for (let i = 0; i < parents.length; i++) {
          if (parents[i].s_g && parents[i].s_g != '') {
            isFlag = true
            break
          }
        }
        if (!isFlag) {
          callback(new Error('必填'));
        } else {
          callback();
        }
      };
      // 验证户籍所在地
      let checkStuAdds = (rule, value, callback) => {
        if (this.planInfo.phaseName == '初中' && !this.regInfo.stuAdds) {
          return callback(new Error('必填项'));
        } else {
          callback();
        }
      };
      // 验证户籍所在地
      // let otherDataVFn = (rule, value, callback) => {
      //   if (this.phaseName == '高中' && !this.regInfo.otherData['s_a']) {
      //     return callback(new Error('必填项'));
      //   } else if (this.phaseName == '高中' && !this.regInfo.otherData['s_b']) {
      //     return callback(new Error('必填项'));
      //   } else if (this.phaseName == '高中' && parseInt(this.regInfo.otherData["s_a"]) > parseInt(this.regInfo.otherData["s_b"])) {
      //     return callback(new Error('排名在人数范围内'));
      //   } else {
      //     callback();
      //   }
      // };
      return {
        rankIndex: "",
        formRank: "",
        rankFlag: false,
        ksmcArr: [],
        // 绑数据
        planInfo: {},
        rewardRows: 3,
        regInfo: {
          otherData: {},
          parents: [
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
            {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
          ],
          rewards: [
            {s_t: "", s_u: "", s_c: "", s_d: "", s_e: ""},
            {s_t: "", s_u: "", s_c: "", s_d: "", s_e: ""},
            {s_t: "", s_u: "", s_c: "", s_d: "", s_e: ""}
          ],
          gradeRank: [],
        },
        planId: "",
        regId: "",
        editFlag: false,
        addList: [],
        gradeList: [],
        fileList: [],
        saveFlag: false,
        gradeMap: {},
        operation: "",
        otherEnum: "",
        enumMap: {},
        saving: false,
        // 性别数据
        genderList: [{
          seiValue: 1,
          seiName: "男"
        }, {
          seiValue: 2,
          seiName: "女"
        }],
        genderMap: {2: "女", 1: "男"},
        schoolList: [],
        itemMap: {s_t: {}, s_u: {}},

        // 原始
        idEdit: false,
        isShowBigImg: false,
        bigimgId: '',
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
        rules: {},
        parentsLength: 0,
        rewardsLength: 0,
        addparentFlag: false,
        addrewardsFlag: false,
        addParentIndex: 0,
        addRewardsIndex: 0,
        isAddparentItem: false,
        isAddRewardItem: false,
        formParent: {
          s_g: '',
          s_h: '',
          s_i: '',
          s_j: '',
          s_k: ''
        },
        formRewards: {
          s_c: "",
          s_d: "",
          s_e: "",
          s_t: "",
          s_u: ""
        },
        //户籍所在地是否验证
        isrequired: true,
        rules: {
          eduConcept: [{required: true, message: '必填项', trigger: 'blur'}],
          stuAdds: [{validator: checkStuAdds, message: '必填项', trigger: 'blur'}],
          nowSchool: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          nowGrade: [
            {required: true, message: "必填", trigger: "blur"}
          ],
          'parentsV': [
            {required: true, validator: parentsVFn, trigger: 'blur'}
          ]
        },
        uploadUrl: `/gateway/zuul/filesystem/api/upload/simpleupload?userId=${userInfo.id}`,
        // 手机端判断是否可编辑
        isEditInfo: false,
        // 招生系统扫码信息登记表 已提交状态
        enrollShow: false,
        // 修改按钮是否显示
        editBtn: false,
        // 保存按钮是否显示
        saveBtn: false
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
      },
      userInfo: function () {
        return this.$store.state.userInfo
      },
    },
    watch: {
      '$store.state.userInfo.id': function () {
        this.init()
      },
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        const vm = this;
        vm.getEnum();
        vm.getAddList();
        vm.getGradeList();
        http.get("/gateway/enroll/api/erRegister/byPhone", {params: {phoneNum: window.userInfo.idCard}}).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.planId = xhr.data.data.planId;
          vm.regId = xhr.data.data.regId;
          vm.getPlanInfo();
          vm.getReg();
        })
      },
      querySearch(queryString, cb) {
        let restaurants = this.schoolList;
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.seiName.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      cancel() {
        const vm = this;
        vm.getReg();
        if (!vm.isPhone) {
          vm.idEdit = false;
        }
        if (vm.$route.query.enroll) {
          localStorage.clear();
          vm.$store.commit('changeLogin', false);
          vm.$router.push({path: 'checking', query: {enroll: true}})
        }

      },
      // 手机端上传证件照
      handleAvatarSuccess(res, file) {
        this.regInfo.photoId = res.data.id;
      },
      addRewardRows() {
        let vm = this;
        if (vm.rewardRows < 8) {
          let obj = {s_c: "", s_d: "", s_e: "", s_t: "", s_u: ""};
          let data = _.cloneDeep(vm.regInfo);
          data.rewards[vm.rewardRows++] = obj;
          vm.regInfo = data;
        } else {
          vm.$message.warning('不能超过8条获奖信息');
        }
      },

      delRewardRows() {
        let vm = this;
        if (vm.rewardRows != 1) {
          let obj = {s_c: "", s_d: "", s_e: "", s_t: "", s_u: ""};
          vm.regInfo.rewards[vm.rewardRows--] = obj
        } else {
          vm.$message.warning('不能低于1条获奖信息');
        }
      },
      saveInfo() {
        const vm = this;
        vm.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if (vm.planInfo.phaseName == '高中') {
              for (let i = 0; i < vm.regInfo.gradeRank.length; i++) {
                let regObj = vm.regInfo.gradeRank[i];
                if (Number(regObj.s_a) > Number(regObj.s_b)) {
                  vm.$message.warning("排名不能大于年级人数");
                  return;
                }
                if (i > 1) {
                  break;
                }
                if (!regObj.s_a || !regObj.s_b) {
                  vm.$message.warning("*标记的考试成绩为必填项");
                  return;
                }
              }
            }
            vm.saving = true;
            vm.regInfo.planId = vm.planId;
            vm.regInfo.nowGradeName = vm.gradeMap[vm.regInfo.nowGrade]
            vm.regInfo.rewardFile = [];
            if (vm.fileList && vm.fileList.length) {
              for (let file of vm.fileList) {
                vm.regInfo.rewardFile.push({fieldText: file.fileName, fieldValue: file.fileId});
              }
            }
            vm.regInfo.localStr = "";
            let al = vm.addList;
            if (vm.regInfo.stuAdds && vm.regInfo.stuAdds.length) {
              vm.regInfo.stuAdd = vm.regInfo.stuAdds.join(",");
              for (let key of vm.regInfo.stuAdds) {
                let obj = {};
                for (let addObj of al) {
                  if (addObj.value == key) {
                    obj = addObj;
                    break;
                  }
                }
                vm.regInfo.localStr += obj.label;
                if (obj.children && obj.children.length) {
                  al = obj.children;
                }
              }
            }
            for (let obj of vm.regInfo.gradeRank) {
              for (let key in obj) {
                let value = obj[key];
                if (value) {
                  let text = value;
                  if (key == "s_v") {
                    text = obj["vName"];
                  }
                  vm.$set(obj, key, value + "#," + text);
                }
              }
            }
            for (let i = 0; i < vm.regInfo.rewards.length; i++) {
              let reward = vm.regInfo.rewards[i];
              for (let key in reward) {
                let value = reward[key];
                let text = '';
                if (value) {
                  if (key == "s_c") {
                    value = moment(value).format('YYYY-MM-DD');
                  }
                  if (key == "s_t" || key == "s_u") {
                    for (let s of vm.enumMap[key]) {
                      if (s.seiValue == value) {
                        text = s.seiName;
                        break;
                      }
                    }
                  }
                  vm.$set(reward, key, value + "#," + value);
                }
              }
            }
            for (let i = 0; i < 2; i++) {
              let parent = vm.regInfo.parents[i];
              for (let key in parent) {
                let value = parent[key];
                if (value) {
                  vm.$set(parent, key, value + "#," + value);
                }
              }
            }
            if (vm.regInfo.otherData) {
              for (let key in vm.regInfo.otherData) {
                let value = vm.regInfo.otherData[key];
                if (value) {
                  if (vm.enumMap[key]) {
                    let items = vm.enumMap[key];
                    let text = "";
                    for (let item of items) {
                      if (item.seiValue == value) {
                        text = item.seiName;
                        break;
                      }
                    }
                    vm.$set(vm.regInfo.otherData, key, value + "#," + text);
                  } else {
                    vm.$set(vm.regInfo.otherData, key, value + "#," + value);
                  }
                }
              }
            }
            // vm.regInfo.creatorId = "00001111000011110000111100001111"
            http.put("/gateway/enroll/api/erRegister", vm.regInfo).then((xhr) => {
              vm.saving = false;
              if (xhr.data.code) {
                return;
              }
              vm.getReg();
              if (!isPhone) {
                vm.idEdit = false;
              }
              // 招生系统扫码登记报名表判断
              if (vm.$route.query && vm.$route.query.enroll) {
                vm.enrollShow = true;
              }
            })
          }
        })
      },
      getReg() {
        const vm = this;
        vm.saving = true;
        vm.planFlag = true;
        http.get("/gateway/enroll/api/erRegister/" + vm.regId).then((xhr) => {
          if (xhr.code) {
            return;
          }
          vm.rewardRows = 3;
          let data = xhr.data;
          if (data.rewards && data.rewards.length) {
            vm.rewardRows = data.rewards.length;
          }
          vm.parentsLength = data.parents.length
          vm.rewardsLength = data.rewards.length
          for (let i = 0; i < vm.rewardRows; i++) {
            if (!data.rewards[i]) {
              let obj = {s_c: "", s_d: "", s_e: "", s_t: "", s_u: ""};
              data.rewards[i] = obj;
            } else {
              // vm.regInfo.rewards[i].s_c = new Date(vm.regInfo.rewards[i].s_c);
            }
          }
          for (let i = 0; i < 2; i++) {
            if (i != 2 && !data.parents[i]) {
              data.parents[i] = {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""};
            }
          }
          vm.regInfo = data;
          // 判断报名信息是否可修改
          if (vm.$store.state.isPhone) {
            vm.idEdit = true;
            if (vm.idEdit && vm.regInfo.regStatus == 0 && vm.planInfo.publishStatus == 1) {
              vm.isEditInfo = true;
            }
          }
          if (!vm.idEdit && vm.regInfo.regStatus == 0 && vm.planInfo.publishStatus == 1) {
            vm.editBtn = true;
          }
          if (!vm.idEdit && vm.regInfo.regStatus == 0 && vm.planInfo.publishStatus == 1) {
            vm.isEditInfo = true;
          }
          if (vm.regInfo.regStatus == 0 && vm.planInfo.publishStatus == 1) {
            vm.saveBtn = true;
          }

          if (!vm.regInfo.otherData) {
            vm.regInfo.otherData = {}
          }
          vm.fileList = [];
          if (vm.regInfo.rewardFile && vm.regInfo.rewardFile.length) {
            for (let file of vm.regInfo.rewardFile) {
              vm.fileList.push({fileName: file.fieldText, fileId: file.fieldValue})
            }
          }
          if (vm.regInfo.stuAdd) {
            vm.regInfo.stuAdds = vm.regInfo.stuAdd.split(",");
          }
          if (vm.regInfo.erFields && vm.regInfo.erFields.length) {
            let map = {};
            for (let field of vm.regInfo.erFields) {
              if (field.dicUri) {
                map[field.fieldCode] = field.dicUri;
              }
            }
            if (map && map != {}) {
              vm.getOtherEnum(map);
            }
          }
          vm.saving = false;
        });
      },
      getOtherEnum(fieldMap) {
        const vm = this;
        let pam = {};
        let dicUris = [];
        vm.enumMap = {};
        for (let key in fieldMap) {
          if (!pam[fieldMap[key]]) {
            pam[fieldMap[key]] = key;
          } else {
            pam[fieldMap[key]] = pam[fieldMap[key]] + "," + key;
          }
          dicUris.push(fieldMap[key]);
        }
        Promise.all([
          http.get("/gateway/platform/api/enum/queryByCodes/" + dicUris.join(","))
        ]).then(function (list) {
          for (let key in pam) {
            let codes = [];
            let enums = [];
            let fieldCode = pam[key];
            if (fieldCode.indexOf(",")) {
              for (let code of fieldCode.split(",")) {
                codes.push(code);
              }
            } else {
              codes.push(fieldCode);
            }
            let items = {};
            for (let enumItem of list[0].data) {
              if (enumItem.code == key) {
                enums.push(enumItem);
                items[enumItem.seiValue] = enumItem.seiName;
              }
            }
            for (let c of codes) {
              vm.enumMap[c] = enums;
              vm.itemMap[c] = items;
            }
          }
          vm.initRankArr();
        });
      },
      initRankArr() {
        const vm = this;
        vm.ksmcArr = vm.enumMap["s_v"];
        let i = 0;
        let data = _.cloneDeep(vm.regInfo);
        if (!data.gradeRank || !data.gradeRank.length) {
          for (let obj of vm.ksmcArr) {
            data.gradeRank[i++] = {
              s_v: obj.seiValue,
              s_a: "",
              s_b: "",
              vName: obj.seiName,
            }
          }
        } else {
          for (let obj of vm.ksmcArr) {
            for (let rObj of data.gradeRank) {
              if (rObj.s_v == obj.seiValue) {
                rObj.vName = obj.seiName;
                break;
              }
            }
          }
        }
        vm.regInfo = data;
      },
      getEnum() {
        let vm = this;
        var enumCodes = "studentsType,xsbq,XXLB";
        Promise.all([
          http.get("/gateway/platform/api/enum/queryByCodes/" + enumCodes)
        ]).then(function (list) {
          vm.stuTypes = _.filter(list[0].data, function (i) {
            return i.code == "studentsType";
          });
          vm.tagList = _.filter(list[0].data, function (i) {
            return i.code == "xsbq";
          });
          vm.schoolList = _.filter(list[0].data, function (i) {
            if (i.code == "XXLB") {
              vm.$set(i, "value", i.seiName);
            }
            return i.code == "XXLB";
          });
        });
      },
      getAddList() {
        const vm = this;
        vm.addList = [];
        http.get("/gateway/enroll/erRegister/locals").then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          if (!xhr.data.data || !xhr.data.data.length) {
            return;
          }
          vm.addList = xhr.data.data;
        });
      },
      getGradeList() {
        const vm = this;
        http.get('/gateway/platform/grade/param').then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.gradeList = xhr.data.data;
          if (vm.gradeList.length) {
            for (let grade of vm.gradeList) {
              vm.gradeMap[grade.id] = grade.gradeName;
            }
          }
        });
      },
      getPlanInfo() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erEnrollPlan/" + vm.planId).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.planInfo = xhr.data.data;
          if (xhr.data.data.phaseName == "高中") {
            vm.isrequired = false;
          }
        });
      },
      pointFn(type) {
        document.getElementById(type).scrollIntoView();
        this.current = type
      },
      // 根据证件号码识别出生日期
      idCardNumFn() {
        let vm = this;
        vm.regInfo.idCard = $.trim(vm.regInfo.idCard);
        let idCardNum = vm.regInfo.idCard;
        let pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (pattern.test(idCardNum)) {
          vm.regInfo.stuBirthday = idCardNum.substring(6, 10) + "-" + idCardNum.substring(10, 12) + "-" + idCardNum.substring(12, 14);
        } else {
          vm.regInfo.stuBirthday = ''
        }
      },
      // 上传证件
      uploadPicture() {
        let vm = this;
        fileUpload({
          title: '上传证件照片',
          uploadFileMaxNum: 1,
          mimeTypes: '.png,.jpg,.jpeg',
          confirm: function (files) {
            vm.regInfo.photoId = files[0].id;
            if (vm.regInfo.photoId) {
              vm.userImgErr = false
            }
          }
        });
      },
      // 上获奖附件
      uploadEnclosure() {
        let vm = this;
        fileUpload({
          title: '上传获奖附件',
          uploadFileMaxNum: 1,
          mimeTypes: '.png,.jpg,.jpeg,.pdf',
          confirm: function (files) {
            // 成功回调
            let f = files[0];
            vm.fileList.push({
              fileName: f.filename,
              fileId: _.trim(f.id),
            });
          }
        });
      },
      //手机上传获奖附件
      phoneEnclosure(file) {
        this.fileList.push({
          fileName: file.data.filename,
          fileId: _.trim(file.data.id),
        });
      },
      showBigImg(id) {
        this.bigimgId = id
        this.isShowBigImg = !this.isShowBigImg
      },
      saveParent() {
        let mobileRes = /^1[34578]\d{9}$/;
        if (!mobileRes.test(this.formParent.s_h)) {
          this.$message.error('手机格式错误');
          return
        }
        this.regInfo.parents[this.addParentIndex] = _.cloneDeep(this.formParent)
        if (this.isAddparentItem) {
          this.parentsLength++
        }
        this.$emit("changeTitle", '报名信息')
        this.addparentFlag = false
      },
      addparentFlagFn() {
        for (let i in this.formParent) {
          this.formParent[i] = ''
        }
        this.addParentIndex = this.parentsLength
        this.isAddparentItem = true
        this.$emit("changeTitle", '新增监护人')
        this.addparentFlag = true
      },
      editParentFn(index, item) {
        this.addParentIndex = index
        this.formParent = item
        this.isAddparentItem = false
        this.$emit("changeTitle", '编辑监护人')
        this.addparentFlag = true
      },
      editRankFn(index, item) {
        this.rankFlag = true
        this.rankIndex = index
        this.formRank = item
        this.$emit("changeTitle", '编辑考试成绩')
      },
      saveRank() {
        if (Number(this.formRank.s_a) > Number(this.formRank.s_b)) {
          this.$message.warning("排名不能大于年级人数");
          return;
        }
        this.regInfo.gradeRank[this.rankIndex] = _.cloneDeep(this.formRank)
        this.$emit("changeTitle", '报名信息')
        this.rankFlag = false
      },
      saveRewards() {
        this.regInfo.rewards[this.addRewardsIndex] = _.cloneDeep(this.formRewards)
        if (this.isAddRewardItem) {
          this.rewardsLength++
        }
        this.$emit("changeTitle", '报名信息')
        this.addrewardsFlag = false
      },
      addrewardsFlagFn() {
        for (let i in this.formRewards) {
          this.formRewards[i] = ''
        }
        this.addRewardsIndex = this.rewardsLength
        this.isAddRewardItem = true
        this.$emit("changeTitle", '新增获奖信息')
        this.addrewardsFlag = true
      },
      editRewardFn(index, item) {
        this.addRewardsIndex = index
        this.addrewardsFlag = true
        this.isAddRewardItem = false
        this.$emit("changeTitle", '编辑获奖信息')
        this.formRewards = item
      },
      goBackFn() {
        this.addparentFlag = false
        this.addrewardsFlag = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .user_school {
    margin: 30px 0 30px 35px;
    padding-bottom: 10px;
    border-bottom: 1px solid #E6E6E6;
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
      & > tbody > tr > td {
        padding: 10px 0;
        vertical-align: top;
      }
    }
    .user_img {
      width: 130px;
      max-height: 170px;
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
      background: url('~@/imgs/upload.png') no-repeat 25px center;
      padding-left: 20px;
      span {
        display: none;
      }
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
    table-layout: fixed;
    thead {
      background: #f7f7f7;
      color: #999;
    }
    td, th {
      height: 48px;
      border: 1px solid #ddd;
      text-align: center;
    }
  }

  .table-overflow {
    td, th {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
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
    margin-right: 30px;
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
      cursor: pointer;
      background-color: rgba(0, 0, 0, .4);
      color: #fff;
      font-size: 18px;
      text-align: right;
    }
    .big_btn_bg {
      background-image: url(~@/imgs/big_btn.png);
      background-repeat: no-repeat;
      background-position: 115px 65px;
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
    width: 150px;
    border-radius: 2px;
    text-align: center;
    color: #999;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    // margin-left: 30px;
    img {
      vertical-align: middle;
      margin-right: 5px;
      // width: 100%;
      // height: 100%;
    }
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
    margin-top: 50px;
  }

  .area_margin {
    margin: 0 !important;
  }

  .sign-btn {
    text-align: center;
    span {
      width: 118px;
      height: 40px;
      border: none;
      line-height: 40px;
      color: #fff;
      margin: 0 8px;
      border-radius: 4px;
      letter-spacing: 5px;
      display: inline-block;
      cursor: pointer;
    }
    .save {
      background: #2f3861;
    }
    .cancel {
      background: none;
      color: #2f3861;;
      border: 1px solid #2f3861;
    }
    .submit {
      background: #eeeeee;
      width: 300px;
      color: #333;
    }
  }

  .basic_tit {
    display: none;
  }

  .el-autocomplete, .el-cascader, .el-select {
    width: 260px;
  }

  table .el-select {
    width: 145px;
  }
</style>
<style lang="less" scoped>
  .basic_tit {
    border-left: 3px solid #aa2f33;
    line-height: 16px;
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;
    padding-left: 4px;
    margin-bottom: 20px;
    span {
      float: right;
      color: #aa2f33;
      margin-right: 20px;
      font-weight: normal;
      font-size: 14px;
    }
  }

  .reward-bottom {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .table-item-tag {
      color: #999;
      font-size: 12px;
      margin-top: 5px;
      line-height: normal;
    }
    .reward-btn {
      float: right;
      span {
        width: auto;
        height: auto;
        letter-spacing: 0;
        line-height: normal;
        padding: 3px 6px;
        margin: 0;
      }
    }
  }

  .phone_parents_item {
    border-bottom: 1px solid #eee;
    margin-left: 20px;
    padding: 20px 20px 20px 0;
    .parent_name {
      font-weight: bold;
      .edit_btn {
        width: 15px;
        height: 15px;
        background: url(~@/imgs/warp/edit.png) no-repeat;
        background-size: 100%;
        float: right;
      }
    }
    .parent_about {
      margin-top: 10px;
      span {
        border: 1px solid #2f3861;
        color: #2f3861;
        padding: 2px 5px;
        line-height: 16px;
        display: block;
        margin-bottom: 12px;
      }
    }
    .parent_address {
      margin-top: 10px;
    }
  }

  .phone_parents_item:last-child {
    border-bottom: none;
  }

  .parents_info {
    border-bottom: 10px solid #eee;
    margin-bottom: 20px;
  }

  .cancel {
    display: none;
  }

  .save {
    display: block;
    width: auto;
    border-radius: 0;
    margin-bottom: 20px;
  }

  .basic_tit {
    display: block;
  }

  .addparentFlag,
  .addrewardsFlag {
    padding: 20px;
    .save {
      margin: 0;
    }
  }

  .prove {
    display: none;
  }

  .other_data_s_a, .other_data_s_b {
    display: inline-block;
  }
</style>
<style lang="less">
  .basic_info {
    .table_list {
      .el-input__inner {
        border: none;
      }
    }
    .error_item {
      .el-form-item__error {
        display: inline-block;
        position: static;
        margin-left: 20px;
      }
    }

    .el-form-item__error {
      &::before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(~@/imgs/error.png) no-repeat;
        background-size: 100%;
        float: left;
        margin-right: 4px;
        margin-top: -2px;
      }
    }
  }
</style>
<style lang="less" scoped>
  //warp版本
  .is_phone {
    .sheet-wrap {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      i {
        font-size: 64px;
        color: #67c23a;
      }
      .sumbit-tip {
        margin: 24px 0;
      }
      .tips-date {
        color: #999;
        font-size: 12px;
      }
    }
    .sign-btn {
      margin-bottom: 20px;
    }
    .long_label {
      .el-form-item__label {
        line-height: 20px;
      }
    }
    .phone_upload_img {
      border: 1px solid #ccc;
      padding: 10px 15px 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user_school {
      text-align: center;
      margin: 30px 0 10px 0;
    }
    .img_box {
      & > div {
        width: 30%;
        height: 70px;
        float: left;
        .up_idcard {
          width: 100%;
          height: 70px;
          line-height: 70px;
        }
      }

      .img_thumbnail {
        width: 30%;
        height: 70px;
        margin-bottom: 20px;
        margin-right: 3%;
        .big_btn_bg{
          background-position: 50px 40px;
        }
      }
      .el-autocomplete, .el-cascader, .el-select {
        width: 100%;
      }
      .other_data_s_a,
      .other_data_s_b {
        display: block;
      }
    }
    .import_hint {
      display: block;
      float: none;
      border-top: 10px solid #eee;
      padding: 10px 20px;
      margin-top: 20px;
      text-align: left;
    }
    .show_edit {
      .user_img {
        position: static;
        width: auto;
        margin: 0 20px;
        img {
          width: 70px;
          height: 80px;
        }
        .upload_btn {
          border: none;
          background: none;
          padding-left: 0;
          margin-top: 0;
          float: left;
          width: 100px;
          text-align: right;
          padding-right: 12px;
          span {
            display: inline-block;
          }
        }
        p {
          margin-top: 0;
          margin-left: 102px;
        }
      }
      .basic_info {
        padding: 0 20px 10px 0;
        margin: 0;
        margin-bottom: 20px;
        border-bottom: 10px solid #eee;
      }
    }
    .basic_tit {
      border-left: 3px solid #aa2f33;
      line-height: 16px;
      font-size: 16px;
      font-weight: bold;
      margin-left: 20px;
      padding-left: 4px;
      margin-bottom: 20px;
      span {
        float: right;
        color: #aa2f33;
        margin-right: 20px;
        font-weight: normal;
        font-size: 14px;
      }
      .upload_btn {
        border: none;
        background: none;
        padding-left: 0;
        margin-top: 0;
        float: left;
        width: 100px;
        text-align: right;
        padding-right: 12px;
        span {
          display: inline-block;
        }
      }
      p {
        margin-top: 0;
        margin-left: 102px;
      }
    }
    .el-col-12 {
      width: 100%;
      .el-cascader, .el-select {
        width: 100%;
      }
    }

  }
</style>
<style lang="less">
  .table_list {
    .el-select > .el-input {
      width: 90%;
    }
    .el-date-editor.el-input{
      width: 100%;
    }
  }

</style>


