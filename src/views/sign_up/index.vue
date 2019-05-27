<template>
  <div class="container sign-wrap">
    <div class="comm_main" v-loading="saving">
      <div class="sign-left">
        <h6 class="sign-tit">[{{planInfo.campusName}}] {{planInfo.planName}}</h6>
        <div class="sign-subttit">
          报名校区：<span>{{planInfo.campusName}}</span> 报名年级：<span>{{planInfo.gradeName}}</span>
        </div>
        <!--基本信息-->
        <p class="tip">提示：加<span>*</span>为<span>“必须填”</span></p>
        <div class="sign-main" id="info">
          <b class="item-tit tit750">基本信息</b>
          <el-form :model="regInfo" :rules="rules" ref="ruleForm" label-width="180px">
            <div class="basic-info">
              <!--pc 显示-->
              <div class="user-img" id="regInfo_photoId" v-if="!isPhone">
                <div class="user_photo">
                  <img :src="imgUrl+regInfo.photoId" v-if="regInfo.photoId">
                </div>
                <div class='img_null' v-if="userImgErr"><i class="el-icon-circle-close"></i>必填项</div>
                <div class="up_suerphoto" @click="uploadPicture">
                  <span style="color: #F56C6C">*</span>
                  <img src="@/imgs/upload.png">上传证件照
                </div>
                <p>本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</p>
              </div>
              <div class="user-info">
                <!--手机浏览器 显示-->
                <el-form-item label="证件照:" prop="photoId" v-if="isPhone" class="phone-img" id="regInfo_photoId">
                  <span class="head-tips">本人近期免冠2寸白底或 蓝底证件照片。格式为png/jpg</span>
                  <div class="head-wrap">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :multiple="true"
                      :accept="'image/*'"
                      :on-success="handleAvatarSuccess">
                      <img v-if="!regInfo.photoId" src="@/imgs/warp/head.png" class="org-img"/>
                      <img v-if="regInfo.photoId" :src="imgUrl+regInfo.photoId" class="new-img">
                    </el-upload>
                    <div style="color: #f23939" v-if="userImgErr"><i class="el-icon-circle-close"></i>必填项</div>
                  </div>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="学生姓名:" prop="stuName" id="regInfo_stuName">
                  <el-col :span="12">
                    <el-input v-model="regInfo.stuName" placeholder="请填写"></el-input>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="身份证/护照号:" prop="idCard" id="regInfo_idCard">
                  <el-col :span="12">
                    <el-input v-model="regInfo.idCard" :maxlength="18" placeholder="请填写" @change="idCardNumFn"
                              style="line-height: normal"></el-input>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="出生日期:" prop="stuBirthday" id="regInfo_stuBirthday">
                  <el-col :span="12">
                    <el-date-picker
                      type="date"
                      placeholder="请填写"
                      v-model="regInfo.stuBirthday"
                      format="yyyy-MM-dd"></el-date-picker>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="性别:" prop="stuGender" id="regInfo_stuGender">
                  <el-radio-group v-model="regInfo.stuGender">
                    <el-radio v-for="(gender,index) in genderList" :key="index" :label="gender.seiValue">
                      {{gender.seiName}}
                    </el-radio>
                  </el-radio-group>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item prop="stuAdds" label="户籍所在地:" id="regInfo_stuAdds">
                  <el-col :span="12" class="width_750">
                    <el-cascader
                      placeholder="请填写"
                      style="width: 100%"
                      filterable
                      :options="addList"
                      v-model="regInfo.stuAdds"/>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="现就读学校:" prop="nowSchool" id="regInfo_nowSchool">
                  <el-col :span="12" class="width_750">
                    <el-autocomplete :maxlength="50" v-model="regInfo.nowSchool" :fetch-suggestions="querySearch"
                                     placeholder="请填写"/>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
                <el-form-item label="现就读年级:" prop="nowGrade" id="regInfo_nowGrade">
                  <el-col :span="12" class="width_750">
                    <el-select clearable v-model="regInfo.nowGrade" placeholder="请填写">
                      <el-option
                        v-for="item in gradeList"
                        :key="item.id"
                        :label="item.gradeName"
                        :value="item.id"/>
                    </el-select>
                  </el-col>
                  <!--错误信息-->
                  <template slot="error" slot-scope="scope">
                    <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                  </template>
                </el-form-item>
              </div>
              <!--手机浏览器显示-->
              <template v-if="isPhone && phaseName == '高中'">
                <!--间隔线-->
                <div class="line"></div>
                <!--监护人信息-->
                <div class="guardian_info" id="regInfo_ranks">
                  <p class="item-tit open-info">
                    考试成绩
                    <label class="error-info" style="font-size: 12px" v-if="rankMsg"><i
                      class="el-icon-circle-close"></i>{{rankMsg}}</label>
                    <span v-if="!rankOpen" @click="rankOpen = !rankOpen">展开<i
                      class="el-icon-arrow-down"></i> </span>
                    <span v-else @click="rankOpen = !rankOpen">收起 <i class="el-icon-arrow-up"></i> </span>
                  </p>
                  <template v-for="(i, idx) in regInfo.gradeRank" v-if="rankOpen && ksmcArr.length">
                    <el-form-item label="考试名称:">
                      <span>{{i.vName}}</span>
                    </el-form-item>
                    <el-form-item label="年级排名(名):" :required="idx < 2">
                      <el-input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="请填写"
                        v-model="i['s_a']"/>
                    </el-form-item>
                    <el-form-item label="年级人数(人):" :required="idx < 2">
                      <el-input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="请填写"
                        v-model="i['s_b']"/>
                    </el-form-item>
                    <div class="line-1" v-if="idx+1 < ksmcArr.length"></div>
                  </template>
                </div>
              </template>
              <!--pc 显示-->
              <template v-if="!isPhone && phaseName == '高中'">
                <div class="user-info-table" id="regInfo_ranks">
                  <div class="table-item">
                    <label>考试成绩:
                      <div style="width:50px;font-size: 12px;color: #F56C6C;float: right;margin-top: 5px">
                        (标记为<span style="color: #f00;">*</span>的成绩为必填)
                      </div>
                    </label>
                    <div>
                      <table class="table">
                        <thead>
                        <tr>
                          <th>考试名称</th>
                          <th>年级排名(名)</th>
                          <th>年级人数(人)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="ksmcArr.length" v-for="(i, idx) in regInfo.gradeRank" :key="i.s_v"
                            class="input-no-border">
                          <td>
                            <span v-if="idx < 2" style="color: #f00;">*</span>
                            <span>{{i.vName}}</span>
                          </td>
                          <td>
                            <el-input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="请填写"
                              v-model="i['s_a']"/>
                          </td>
                          <td>
                            <el-input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="请填写"
                              v-model="i['s_b']"/>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </template>
              <!--pc 显示-->
              <template v-if="!isPhone">
                <div class="user-info-table" v-if="!isPhone" id="regInfo_parents">
                  <div class="table-item">
                    <label class="fill">
                      监护人:
                      <div style="width:50px;font-size: 12px;color: #F56C6C;float: right;margin-top: 5px">(监护人1姓名及手机必填)
                      </div>
                    </label>
                    <table class="table">
                      <thead>
                      <tr>
                        <th style="width: 180px;">姓名(关系)</th>
                        <th>手机</th>
                        <th>学历</th>
                        <th>工作单位</th>
                        <th>职务</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="i in 2" :key="i" class="input-no-border">
                        <td>
                          <el-input :maxlength="20" v-model="regInfo.parents[i-1]['s_g']" placeholder="示例：张三（父子）"/>
                        </td>
                        <td>
                          <el-input :maxlength="20" v-model="regInfo.parents[i-1]['s_h']" @blur="setLoginName"/>
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
                    <div>
                    <span class="error-info" v-if="parentsMsg">
                      <i class="el-icon-circle-close"></i>{{parentsMsg}}
                    </span>
                    </div>
                  </div>

                  <div class="table-item" v-if="phaseName != '高中'" id="regInfo_eduConcept">
                    <label class="fill">家庭教育理念:</label>
                    <el-input type="textarea" :maxlength="100" style="width: 600px" :rows="4" placeholder="请填写(限100字)"
                              v-model="regInfo.eduConcept"></el-input>
                    <div>
                    <span class="error-info" v-if="eduMsg">
                      <i class="el-icon-circle-close"></i>{{eduMsg}}
                    </span>
                    </div>
                  </div>
                  <div class="table-item" v-if="phaseName  == '高中'">
                    <label>获奖信息:</label>
                    <div>
                      <table class="table">
                        <thead>
                        <tr>
                          <th>获奖时间</th>
                          <th>奖项名称</th>
                          <th>奖项等级</th>
                          <th>奖项范围</th>
                          <th>奖项类别</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="i in rewardRows" :key="i" class="input-no-border">
                          <td>
                            <el-date-picker
                              placeholder="年/月/日"
                              v-model="regInfo.rewards[i-1]['s_c']"
                              type="date"/>
                          </td>
                          <td>
                            <el-input
                              placeholder="（限20字）"
                              :maxlength="20"
                              v-model="regInfo.rewards[i-1]['s_d']"/>
                          </td>
                          <td>
                            <el-input
                              placeholder="（限10字）"
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
                          </td>
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
                    </div>
                  </div>
                  <div class="table-item" v-if="phaseName  == '高中'">
                    <label>获奖附件:</label>
                    <div class="up_idcard clearfix">
                      <template v-if="fileList && fileList.length > 0">
                      <span v-for="(item,index) in fileList" :key="index">
                        <div class="cover"><i class="el-icon-close"
                                              @click="fileList.splice(index, 1)"></i></div>
                        <img :src="imgUrl+item.fileId" class="card">
                      </span>
                      </template>
                      <div class="up_area">
                       <span @click="uploadEnclosure">
                      <img src="@/imgs/upload.png">上传证件
                      </span>
                        <div class="hint">请上传证书扫描件：格式为jpg、png等图片形式</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <!--手机浏览器 显示-->
            <template v-if="isPhone">
              <!--间隔线-->
              <div class="line"></div>
              <!--监护人信息-->
              <div class="guardian_info" id="regInfo_parents">
                <p class="item-tit open-info">
                  监护人信息
                  <label class="error-info" style="font-size: 12px" v-if="parentsMsg"><i
                    class="el-icon-circle-close"></i>{{parentsMsg}}</label>
                  <span v-if="!guardianOpen" @click="guardianOpen = !guardianOpen">展开<i
                    class="el-icon-arrow-down"></i> </span>
                  <span v-else @click="guardianOpen = !guardianOpen">收起 <i class="el-icon-arrow-up"></i> </span>
                </p>
                <template v-for="i in 2" v-if="guardianOpen">
                  <el-form-item label="姓名(关系):" :required="i==1 ? true:false">
                    <el-input :maxlength="20" placeholder="示例：张三（父子）" v-model="regInfo.parents[i-1]['s_g']"/>
                  </el-form-item>
                  <el-form-item label="手机:" :required="i==1 ? true:false">
                    <el-input :maxlength="20" placeholder="请填写" v-model="regInfo.parents[i-1]['s_h']"
                              @blur="setLoginName"/>
                  </el-form-item>
                  <el-form-item label="学历:" :required="i==1 ? true:false">
                    <el-input :maxlength="10" placeholder="请填写" v-model="regInfo.parents[i-1]['s_i']"/>
                  </el-form-item>
                  <el-form-item label="工作单位:" :required="i==1 ? true:false">
                    <el-input :maxlength="50" placeholder="请填写" v-model="regInfo.parents[i-1]['s_j']"/>
                  </el-form-item>
                  <el-form-item label="职务:">
                    <el-input :maxlength="30" placeholder="请填写" v-model="regInfo.parents[i-1]['s_k']"/>
                  </el-form-item>
                  <div class="line-1" v-if="i==1"></div>
                </template>
              </div>
              <!--间隔线-->
              <div class="line"></div>
              <!--家庭教育理念-->
              <div class="prize_info" v-if="phaseName != '高中'" id="regInfo_eduConcept">
                <p class="item-tit open-info">家庭教育理念
                  <label class="error-info" style="font-size: 12px" v-if="eduMsg"><i
                    class="el-icon-circle-close"></i>{{eduMsg}}</label>
                </p>
                <el-input type="textarea" :maxlength="100" :rows="4" placeholder="请填写(限100字)"
                          v-model="regInfo.eduConcept"></el-input>
              </div>
              <!--间隔线-->
              <div class="line" v-if="phaseName  != '高中'"></div>
              <!--获奖信息-->
              <div class="prize_info" v-if="phaseName  == '高中'">
                <p class="item-tit open-info">
                  获奖信息
                  <span v-if="!prizeOpen" @click="prizeOpen = !prizeOpen">展开<i
                    class="el-icon-arrow-down"></i> </span>
                  <span v-else @click="prizeOpen = !prizeOpen">收起 <i class="el-icon-arrow-up"></i> </span>
                </p>
                <template v-for="i in rewardRows" v-if="prizeOpen">
                  <el-form-item label="获奖时间:">
                    <el-date-picker placeholder="年/月/日" v-model="regInfo.rewards[i-1]['s_c']" type="date"/>
                  </el-form-item>
                  <el-form-item label="奖项名称:">
                    <el-input placeholder="（限20字）" :maxlength="20" v-model="regInfo.rewards[i-1]['s_d']"/>
                  </el-form-item>
                  <el-form-item label="奖项等级:">
                    <el-input placeholder="（限10字）" :maxlength="10" v-model="regInfo.rewards[i-1]['s_e']"/>
                  </el-form-item>
                  <el-form-item label="奖项范围:">
                    <el-select v-model="regInfo.rewards[i-1]['s_t']" clearable placeholder="请选择">
                      <el-option
                        v-for="item in enumMap['s_t']"
                        :key="item.seiValue"
                        :label="item.seiName"
                        :value="item.seiValue"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="奖项类别:">
                    <el-select v-model="regInfo.rewards[i-1]['s_u']" clearable placeholder="请选择">
                      <el-option
                        v-for="item in enumMap['s_u']"
                        :key="item.seiValue"
                        :label="item.seiName"
                        :value="item.seiValue"/>
                    </el-select>
                  </el-form-item>
                  <div class="line-1" v-if="i != rewardRows"></div>
                  <template v-if="i == rewardRows">
                    <div class="is_phone_reward">
                      <span @click="addRewardRows">添加获奖</span>
                      <span @click="delRewardRows">删除获奖</span>
                    </div>
                    <div class="line-1"></div>
                    <el-form-item label="获奖附件:" class="file-wrap" style="line-height: 1">
                      <div class="file-list">
                      <span v-for="(item,index) in fileList" :key="index">
                            <div class="cover"></div>
                             <img :src="imgUrl+item.fileId" class="new-img">
                              <i class="el-icon-close delete-icon"
                                 @click="fileList.splice(index, 1)"></i>
                         </span>
                      </div>
                      <el-upload
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
                    </el-form-item>
                    <div style="text-align: center;font-size: 12px;color: #F56C6C;margin-bottom: 8px">
                      请上传证书扫描件（照片和扫描件，图片的形式）
                    </div>
                  </template>
                </template>
              </div>
            </template>
            <!--间隔线-->
            <div class="line" v-if="phaseName  == '高中'"></div>
            <!--登录密码-->
            <div class="sign-pwd" id="pwd">
              <b class="item-tit">登录密码</b>
              <div class="sign-pwd-tit">
                请设置密码，建议使用字符的组合密码且长度超过6位
                <p>注：若未设置密码，下次登录的密码为“证件号后六位”</p>
              </div>
              <el-row>
                <el-col :span="16" :offset="4">
                  <el-form-item label="登录名:" prop="phoneNum">
                    <el-col :span="18">
                      <el-input v-show="showInput" disabled v-model="regInfo.phoneNum"
                                placeholder="请输入第一监护人手机号"></el-input>
                      <!--解决google自动填充输入框-->
                      <el-input class="hide"></el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="设置密码:">
                    <el-col :span="18">
                      <el-input v-show="showInput" :maxlenght="18" v-if="!isPwd" type="password" v-model="regInfo.pwd"
                                placeholder="默认密码 (证件号后六位)">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                      <el-input v-show="showInput" :maxlenght="18" v-if="isPwd" type="text" v-model="regInfo.pwd">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="isPwd" @click="isPwd = !isPwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="!isPwd" @click="isPwd = !isPwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="确认密码:" prop="repwd">
                    <el-col :span="18">
                      <el-input v-show="showInput" :maxlenght="18" v-if="!isRePwd" type="password"
                                v-model="regInfo.repwd"
                                placeholder="默认密码 (证件号后六位)">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="isRePwd" @click="isRePwd = !isRePwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="!isRePwd" @click="isRePwd = !isRePwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                      <el-input v-show="showInput" :maxlenght="18" v-if="isRePwd" type="text" v-model="regInfo.repwd">
                        <template slot="suffix">
                          <i class="iconfont pointer" v-if="isRePwd" @click="isRePwd = !isRePwd">&#xe60d;</i>
                          <i class="iconfont pointer" v-if="!isRePwd" @click="isRePwd = !isRePwd">&#xe6b8;</i>
                        </template>
                      </el-input>
                    </el-col>
                    <!--错误信息-->
                    <template slot="error" slot-scope="scope">
                      <span class="error-info"> <i class="el-icon-circle-close"></i>{{scope.error}}</span>
                    </template>
                  </el-form-item>
                  <!--解决google自动填充输入框-->
                  <el-input class="hide" type="password"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div class="sign-btn">
            <button class="save" @click="save('ruleForm')">提交报名</button>
            <button class="cancel" @click="$router.push('/plan')">取消</button>
          </div>
        </div>
      </div>
      <!--nav-->
      <div class="sign-right">
        <div class="nav_point">
          <div class="point" :class="{active:current == 'info'}" @click="pointFn('info')">基本信息</div>
          <div class="point" :class="{active:current == 'pwd'}" @click="pointFn('pwd')">登录密码</div>
        </div>
      </div>
      <!--提交报名信息提示-->
      <el-dialog v-if="!isPhone" v-loading="saving" title="警告" :visible.sync="saveFlag" width="600px">
        <div class="mb-20">
          确定提交报名？提交后以下信息将<span class="text-red">不支持修改</span>：
        </div>
        <!--todo 分割线 -->
        <el-row class="mb-5">
          <el-col :span="24" :offset="2">
            <span class="modal-item">身份证/护照号：{{regInfo.idCard}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="2">
            <span class="modal-item">监护人1：{{regInfo.parents[0]['s_g']}}</span>
          </el-col>
          <el-col :span="10">
            <span class="modal-item">手机号：{{regInfo.parents[0]['s_h']}}</span>
          </el-col>
        </el-row>
        <div slot="footer">
          <el-button @click="saveFlag=false">取消</el-button>
          <el-button @click="saveInfo" type="primary">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog v-else title="警告" v-loading="saving" :visible.sync="saveFlag" width="334px">
        <div class="mb-20">
          确定提交报名？提交后以下信息将<span class="text-red">不支持修改</span>：
        </div>
        <!--todo 分割线 -->
        <el-row class="mb-5">
          <el-col :span="24" :offset="2">
            <span class="modal-item">身份证/护照号：{{regInfo.idCard}}</span>
          </el-col>
          <el-col :span="24" :offset="2">
            <span class="modal-item">监护人1：{{regInfo.parents[0]['s_g']}}</span>
          </el-col>
          <el-col :span="24" :offset="2">
            <span class="modal-item">手机号：{{regInfo.parents[0]['s_h']}}</span>
          </el-col>
        </el-row>
        <div slot="footer">
          <el-button @click="saveFlag=false">取消</el-button>
          <el-button @click="saveInfo" type="primary">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>
<script>
  export default {
    name: "index",
    data() {
      // 验证排名/年级人数
      // let checkRank = (rule, value, callback) => {
      //   if (this.phaseName != '初中' && !this.regInfo.otherData['s_a']) {
      //     return callback(new Error('必填项'));
      //   } else if (this.phaseName != '初中' && !this.regInfo.otherData['s_b']) {
      //     return callback(new Error('必填项'));
      //   } else if (this.phaseName != '初中' && parseInt(this.regInfo.otherData["s_a"]) > parseInt(this.regInfo.otherData["s_b"] && this.phaseName != '初中')) {
      //     return callback(new Error('排名不能高于年级人数'));
      //   } else {
      //     callback();
      //   }
      // };
      // 验证登录密码
      let checkpwd = (rule, value, callback) => {
        if (this.regInfo.pwd && this.regInfo.pwd != this.regInfo.repwd && this.regInfo.repwd) {
          return callback(new Error('密码不一致'));
        } else {
          callback();
        }
      };

      return {
        rankMsg: "",
        ksmcArr: [],
        // 绑数据
        planInfo: {},
        regInfo: {
          photoId: "",
          regStatus: 0,
          otherData: {},
          eduConcept: '',
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
        addList: [],
        gradeList: [],
        fileList: [],
        planId: "",
        regId: "",
        gradeMap: {},
        operation: "",
        otherEnum: "",
        enumMap: {},
        itemMap: {s_t: {}, s_u: {}},
        saving: false,
        saveFlag: false,
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

        // 原始
        current: 'info',
        isShow: false,
        userImgErr: false,
        isPwd: false,
        isRePwd: false,
        imgUrl: '/gateway/zuul/filesystem/api/image/thumbnail/',
        // 表单验证
        rules: {
          stuName: [{required: true, message: '必填项', trigger: 'blur'}],
          idCard: [
            {required: true, message: '必填项', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ],
          stuBirthday: [{required: true, message: '必填项', trigger: 'blur'}],
          phoneNum: [{required: true, message: '必填项', trigger: 'blur'}],
          repwd: [{validator: checkpwd, trigger: 'blur'}],
          stuAdds: [{required: true, message: '必填项', trigger: 'blur'}],
          stuGender: [{required: true, message: '必填项', trigger: 'blur'}],
          photoId: [{required: true, message: '必填项', trigger: 'blur'}],
          nowSchool: [{required: true, message: '必填项', trigger: 'blur'}],
          nowGrade: [{required: true, message: '必填项', trigger: 'blur'}],
          // rank: [{validator: checkRank, required: true, trigger: 'blur'}]
        },
        //  监护人信息是否展开
        guardianOpen: true,
        // 获奖信息是否展开
        prizeOpen: true,
        // 排名信息是否展开
        rankOpen: true,
        // 上传图片 请求地址
        uploadUrl: `/gateway/zuul/filesystem/api/upload/simpleupload?userId=00000000000000000000000000000000`,
        // 监护人错误提示
        parentsMsg: '',
        // 登录密码框是否显示
        showInput: false,
        // 奖项范围数据
        ranges: [
          {value: '选项1', label: '奖项范围'}
        ],
        // 奖项类别
        awardTypes: [
          {value: '选项1', label: '奖项范围'}
        ],
        // 家庭教育理念错误提示
        eduMsg: '',
        //  学段
        phaseName: '',
        //户籍所在地是否验证
        isrequired: true,
        rewardRows: 3,
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
        // return true
      },
    },

    mounted() {
      const vm = this;
      vm.phaseName = vm.$route.query.phaseName;
      vm.planId = vm.$route.query.id;
      if (vm.phaseName == "高中") {
        vm.isrequired = false
      }
      // 查询性别
      vm.getEnum();
      vm.getAddList();
      vm.getGradeList();
      vm.getPlanInfo();
      vm.getReg();
      // 解决google记住密码后自动填充
      setTimeout(() => {
        vm.showInput = true;
      }, 300)
    },
    methods: {
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
      saveInfo() {
        const vm = this;
        vm.saving = true;
        vm.regInfo.stuBirthday = moment(vm.regInfo.stuBirthday).format('YYYY-MM-DD');
        vm.regInfo.planId = vm.planId;
        vm.regInfo.nowGradeName = vm.gradeMap[vm.regInfo.nowGrade];
        vm.regInfo.rewardFile = [];
        if (vm.fileList && vm.fileList.length) {
          for (let file of vm.fileList) {
            vm.regInfo.rewardFile.push({fieldText: file.fileName, fieldValue: file.fileId});
          }
        }
        // vm.regInfo.localStr = "";
        let al = vm.addList;
        if (vm.regInfo.stuAdds && vm.regInfo.stuAdds.length) {
          vm.regInfo.stuAdd = vm.regInfo.stuAdds.join(",");
          // for (let key of vm.regInfo.stuAdds) {
          //   let obj = {};
          //   for (let addObj of al) {
          //     if (addObj.value == key) {
          //       obj = addObj;
          //       break;
          //     }
          //   }
          //   vm.regInfo.localStr += obj.label;
          //   if (obj.children && obj.children.length) {
          //     al = obj.children;
          //   }
          // }
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
              vm.$set(reward, key, value + "#," + (text ? text : value));
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
        vm.regInfo.creatorId = "00001111000011110000111100001111";
        vm.regInfo.campusName = vm.planInfo.campusId;

        http.post("/gateway/enroll/api/erRegister", vm.regInfo).then((xhr) => {
          vm.saving = false;
          if (xhr.data.code) {
            //处理数据
            vm.clData();
            return;
          }
          vm.regId = xhr.data.data;
          vm.saveFlag = false;
          // todo 自动登录跳转到个人中心
          vm.login();
        })
      },
      clData() {
        let vm = this;
        for (let i = 0; i < 2; i++) {
          let parent = vm.regInfo.parents[i];
          for (let key in parent) {
            let value = parent[key];
            if (value) {
              vm.$set(parent, key, value.split("#,")[0]);
            }
          }
        }
        for (let i = 0; i < vm.regInfo.rewards.length; i++) {
          let reward = vm.regInfo.rewards[i];
          for (let key in reward) {
            let value = reward[key];
            if (value) {
              vm.$set(reward, key, value.split("#,")[0]);
            }
          }
        }
        for (let i = 0; i < vm.regInfo.gradeRank.length; i++) {
          let rank = vm.regInfo.gradeRank[i];
          for (let key in rank) {
            let value = rank[key];
            if (value) {
              vm.$set(rank, key, value.split("#,")[0]);
            }
          }
        }
      },
      // 自动登陆
      login() {
        let vm = this;
        let loginForm = {
          grant_type: 'password',
          username: vm.regInfo.phoneNum,
          password: vm.regInfo.pwd ? vm.regInfo.pwd : vm.regInfo.idCard.substring(vm.regInfo.idCard.length - 6)
        };
        http.post('/gateway/auth/oauth/token', loginForm, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic YnJvd3Nlcjo='
          },
          emulateJSON: true,
          transformRequest: [function (data) {
            let ret = '';
            Object.keys(data).map(key => {
              ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
            });
            return ret
          }]
        }).then(function (xhr) {
          if (xhr.data.code == '20001')
            return vm.$message.warning(xhr.data.message);
          if (xhr.data && xhr.data.access_token) {
            let dataToken = xhr.data;
            localStorage.setItem('accesstoken', JSON.stringify(dataToken));
            localStorage.setItem('active', 'center');
            vm.$store.commit('changeLogin', true);
            vm.$store.commit('setMenu', 'center');
            vm.$router.push({path: '/'});
          }
          vm.clData();
        })
      },
      getReg() {
        const vm = this;
        vm.planFlag = true;
        http.get("/gateway/enroll/erRegister/empty").then((xhr) => {
          if (xhr.code) {
            return;
          }
          let data = xhr.data;
          for (let i = 0; i < 3; i++) {
            if (!data.rewards[i]) {
              let obj = {s_c: "", s_d: "", s_e: "", s_t: "", s_u: ""};
              data.rewards[i] = obj;
            } else {
              // vm.regInfo.rewards[i].s_c = new Date(vm.regInfo.rewards[i].s_c);
            }
            if (i != 2 && !data.parents[i]) {
              data.parents[i] = {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""};
            }
          }
          vm.regInfo = data;
          if (!vm.regInfo.otherData) {
            vm.regInfo.otherData = {}
          }
          vm.fileList = [];
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
        for (let obj of vm.ksmcArr) {
          data.gradeRank[i++] = {
            s_v: obj.seiValue,
            s_a: "",
            s_b: "",
            vName: obj.seiName,
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
        });
      },

      pointFn(type) {
        document.getElementById(type).scrollIntoView();
        this.current = type
      },

      // 根据身份证号码识别出生日期
      idCardNumFn() {
        let vm = this;
        vm.regInfo.idCard = $.trim(vm.regInfo.idCard);
        let idCardNum = vm.regInfo.idCard;
        let pattern = /(^\d{18}$)|(^\d{17}[0-9xX]$)/;
        vm.regInfo.stuBirthday = ''
        if (pattern.test(idCardNum)) {
          debugger
          let date = new Date(idCardNum.substring(6, 10) + "-" + idCardNum.substring(10, 12) + "-" + idCardNum.substring(12, 14));
          if (date.getTime()) {
            vm.regInfo.stuBirthday = date;
          }
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
      // 手机端上传证件照
      handleAvatarSuccess(res, file) {
        this.regInfo.photoId = res.data.id;
      },
      // 上获奖附件
      uploadEnclosure() {
        let vm = this;
        fileUpload({
          title: '上传获奖附件',
          uploadFileMaxNum: 10,
          mimeTypes: '.png,.jpg,.jpeg,.pdf',
          confirm: function (files) {
            // 成功回调
            let tempList = [];
            if (files && files.length > 0) {
              _.map(files, (i) => {
                tempList.push({
                  fileName: i.filename,
                  fileId: _.trim(i.id),
                })
              });
            }
            vm.fileList = [...vm.fileList, ...tempList];
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
      //根据第一监护人手机号填充登录名
      setLoginName() {
        this.regInfo.phoneNum = this.regInfo.parents[0]['s_h'];
      },
      addRewardRows() {
        let vm = this;
        if (vm.rewardRows < 8) {
          let obj = {s_c: "", s_d: "", s_e: "", s_t: "", s_u: ""};
          let data = _.cloneDeep(vm.regInfo);
          data.rewards[vm.rewardRows++] = obj;
          vm.regInfo = data;
        }
      },

      delRewardRows() {
        let vm = this;
        if (vm.rewardRows != 1) {
          let obj = {s_c: "", s_d: "", s_e: "", s_t: "", s_u: ""};
          vm.regInfo.rewards[vm.rewardRows--] = obj
        }
      },
      // 保存
      save(formName) {
        let vm = this;
        vm.userImgErr = false;
        vm.parentsMsg = '';
        vm.eduMsg = '';
        // 身份证验证
        if (vm.phaseName == '高中' && !vm.regInfo.photoId) {
          if (!vm.isLogin) {
            vm.userImgErr = true;
          }
          document.getElementById('regInfo_photoId').scrollIntoView();
          return false
        }
        if (vm.phaseName == '高中') {
          for (let i = 0; i < vm.regInfo.gradeRank.length; i++) {
            let regObj = vm.regInfo.gradeRank[i];
            if (Number(regObj.s_a) > Number(regObj.s_b)) {
              vm.rankMsg = "排名不能大于年级人数";
              document.getElementById('regInfo_ranks').scrollIntoView();
              return;
            }
            if (i > 1) {
              break;
            }
            if (!regObj.s_a || !regObj.s_b) {
              vm.rankMsg = "必填项";
              document.getElementById('regInfo_ranks').scrollIntoView();
              return;
            }

          }
        }
        // 监护人信息1验证
        if (!vm.regInfo.parents[0]["s_g"] || !vm.regInfo.parents[0]["s_h"] || !vm.regInfo.parents[0]["s_i"] || !vm.regInfo.parents[0]["s_j"]) {
          vm.parentsMsg = '必填项';
          document.getElementById('regInfo_parents').scrollIntoView();
          return false
        }
        // 监护人手机号1验证
        for (let i = 0; i <= vm.regInfo.parents.length; i++) {
          let mobileRes = /^1[3456789]\d{9}$/;
          if (vm.regInfo.parents[i] && vm.regInfo.parents[i]["s_h"] && !mobileRes.test(vm.regInfo.parents[i]["s_h"])) {
            vm.parentsMsg = '手机错误';
            document.getElementById('regInfo_parents').scrollIntoView();
            return false;
          }
        }
        // 家庭教育理念验证
        if (!vm.regInfo.eduConcept && vm.phaseName != '高中') {
          vm.eduMsg = '必填项';
          document.getElementById('regInfo_eduConcept').scrollIntoView();
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!vm.regInfo.stuBirthday) return document.getElementById('regInfo_stuBirthday').scrollIntoView();
            vm.saveFlag = true;
          } else {
            if (!vm.regInfo.stuName) return document.getElementById('regInfo_stuName').scrollIntoView();
            if (!vm.regInfo.idCard) return document.getElementById('regInfo_idCard').scrollIntoView();
            if (!vm.regInfo.stuBirthday) return document.getElementById('regInfo_stuBirthday').scrollIntoView();
            if (!vm.regInfo.stuGender) return document.getElementById('regInfo_stuGender').scrollIntoView();
            if (!vm.regInfo.stuAdds) return document.getElementById('regInfo_stuAdds').scrollIntoView();
            if (!vm.regInfo.nowSchool) return document.getElementById('regInfo_nowSchool').scrollIntoView();
            if (!vm.regInfo.nowGrade) return document.getElementById('regInfo_nowGrade').scrollIntoView();
            if (vm.phaseName == '高中' && !vm.regInfo.otherData['s_a'] || vm.phaseName == '高中' && vm.regInfo.otherData['s_b']) return document.getElementById('regInfo_rank').scrollIntoView();
            return false;
          }
        });
      },
      // 提交报名
      submitForm() {
        const vm = this;
        if (!vm.regId) {
          vm.$message.warning("注册账号失败，无法提交，请重试！");
          return;
        }
        vm.saving = true;
        http.put("/gateway/enroll/api/erRegister/confirm", {id: vm.regId}).then((xhr) => {
          vm.saving = false;
          if (xhr.data.code) {
            return;
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped>
  .comm_main {
    position: relative;
  }

  .sign-left {
    margin: 0 320px 0 0;
    padding: 40px 20px 30px;
    box-sizing: border-box;
    .sign-tit {
      color: #333;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
    }
    .sign-subttit {
      border-bottom: 1px solid #e2e1e1;
      padding-bottom: 10px;
      margin-top: 30px;
      span {
        color: #aa2f33;
        margin-right: 24px;
      }
      .update-txt {
        float: right;
        color: #00b7ee;
        cursor: pointer;
      }
    }
    .tip {
      font-size: 12px;
      color: #999;
      padding: 16px 0 0;
      display: block;
      span {
        color: #f23939;
      }
    }
    .sign-main {
      margin: 30px 0;
      .item-tit {
        color: #666;
        margin-bottom: 30px;
      }
      .basic-info {
        .user-img {
          width: 160px;
          margin-left: 60px;
          position: absolute;
          left: 0;
          .user_photo {
            width: 160px;
            height: 200px;
            border: 1px solid #ccc;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .up_suerphoto {
            border: 1px solid #ccc;
            line-height: 40px;
            text-align: center;
            color: #666;
            margin-top: 20px;
            cursor: pointer;
            img {
              margin-right: 10px;
              vertical-align: middle;
            }
          }
          p {
            color: #999;
            font-size: 12px;
            margin-top: 20px;
          }
          .img_null {
            color: #eb2727;
            top: 200px;
            left: 0;
            position: absolute;
          }
        }
        .user-info {
          margin-left: 240px;
        }
        .user-info-table {
          margin-left: 60px;
          .table-item {
            display: flex;
            margin-bottom: 20px;
            label {
              display: inline-block;
              width: 110px;
              text-align: right;
              color: #606266;
              flex-shrink: 0;
              padding-right: 12px;
            }
            .fill::before {
              content: '*';
              color: #F56C6C;
              margin-right: 4px;
            }
            .reward-bottom {
              margin-top: 12px;
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
                  padding: 3px 6px;
                  border-radius: 4px;
                  cursor: pointer;
                }
                span:first-child {
                  color: #fff;
                }
              }
            }
            .up_idcard {
              text-align: center;
              color: #999;
              display: inline-block;
              vertical-align: top;
              cursor: pointer;
              span {
                display: inline-block;
                width: 120px;
                line-height: 80px;
                height: 80px;
                margin-right: 12px;
                border: 1px solid #ccc;
                border-radius: 2px;
                position: relative;
                float: left;
                margin-bottom: 12px;
                &:hover .cover {
                  display: block;
                }
                .cover {
                  position: absolute;
                  top: 0;
                  z-index: 8;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.5);
                  display: none;
                  i {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    z-index: 100;
                    color: #fff;
                    font-size: 24px;
                  }
                }
              }
              .up_area {
                float: left;
              }
              .card {
                width: 100%;
                height: 100%;
              }
            }
            .hint {
              line-height: 20px;
              padding: 5px 0 0 18px;
              font-size: 12px;
              width: 160px;
              background: url(~css_img/hint.png) no-repeat;
              background-size: 100% 100%;
              display: inline-block;
              margin-top: 32px;
            }
            .table {
              width: 600px;
              border-top: 1px solid #ccc;
              border-right: 1px solid #ccc;
              text-align: center;
              th, td {
                border-bottom: 1px solid #ccc;
                border-left: 1px solid #ccc;
                height: 36px;
              }
              th {
                font-weight: normal;
                color: #999;
              }
              input {
                width: 100%;
                border: none;
                outline: none;
                padding: 0 15px;
                color: #606266;
              }
              thead tr th {
                background: #f7f7f7;
              }
            }
          }
        }
      }
      .sign-pwd {
        .sign-pwd-tit {
          text-align: center;
          margin-bottom: 12px;
          color: #999;
          p {
            color: #aa2f33;
            margin-top: 8px;
          }
        }
      }
      .sign-btn {
        text-align: center;
        button {
          width: 118px;
          height: 40px;
          border: none;
          line-height: 40px;
          color: #fff;
          margin: 0 8px;
          border-radius: 4px;
          letter-spacing: 5px;
          cursor: pointer;
        }
        .save {
          background: #2f3861;
        }
        .cancel {
          background: none;
          color: #333;
          border: 1px solid #2f3861;
        }
        .submit {
          background: #eeeeee;
          width: 300px;
          color: #333;
        }
      }
    }
    .is_phone_reward {
      text-align: right;
      margin-bottom: 12px;
      span {
        color: #aa2f33;
      }
      span:last-child {
        margin-left: 12px;
      }
    }
  }

  .sign-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }

  .sign-left, .sign-right {
    background: #fff;
    border-radius: 4px;
  }

  .m-r-12 {
    margin-right: 12px;
  }

  .line {
    border-bottom: 1px solid #e2e1e1;
    margin: 30px 0;
  }

  .pointer {
    cursor: pointer;
  }

  .error-info {
    color: #F56C6C;
    font-size: 12px;
    i {
      margin-left: 10px;
      margin-right: 5px;
    }
  }
</style>
<style lang="less">
  .sign-wrap {
    /*height: 100%;*/
    /*overflow-y: scroll;*/
    .el-autocomplete {
      display: block;
    }
    .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
    .input-no-border {
      .el-input__inner {
        border: none !important;
      }
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #2f3861;
    }
    .el-radio__input.is-checked .el-radio__inner {
      border-color: #2f3861;
      background: #2f3861;
    }
  }

  .hide {
    width: 0 !important;
    height: 0 !important;
    position: absolute;
    z-index: -1;
    input {
      border: none !important;
      -webkit-text-fill-color: #fff !important;
    }
  }

  .mb-20 {
    margin-bottom: 30px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }

  .mb-5 {
    margin-bottom: 20px;
  }

  .text-red {
    color: red;
  }

  .modal-item::before {
    content: "*";
    color: red;
    padding-right: 8px;
  }

  .el-dialog__body {
    padding: 20px !important;
  }
</style>
