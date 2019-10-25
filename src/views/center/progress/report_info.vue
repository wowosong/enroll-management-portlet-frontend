<template>
    <div class="report_info" :class="{phone_report_info:isPhone}">
        <p class="report_tit">报到信息<span @click="isEdit = !isEdit" v-if="!isEdit">修改</span></p>
        <el-form :model="repInfo" :rules="rules" ref="ruleForm" label-width="86px" class="report_cont">
            <div class="user_img" v-if="!isPhone"><img src="@/imgs/404.png"></div>
            <div class="basic_info" :class="{is_show:!isEdit}">
                <p class="basic_tit">基本信息</p>
                <el-form-item label="照片:" v-if="isPhone">
                    <div class="phone_user_img"><img src="@/imgs/404.png"></div>
                </el-form-item>
                <el-form-item label="学生姓名:" class="no_edit_data">张三山</el-form-item>
                <el-form-item label="省份证号:" class="no_edit_data">510923199205185908</el-form-item>
                <el-form-item label="性别:" class="no_edit_data">女</el-form-item>
                <el-form-item label="出生日期:" class="no_edit_data">1992-05-02</el-form-item>
                <el-form-item label="身高:">
                    <el-input style="width:150px" size="small" v-if="isEdit" class="sg"></el-input>
                    <template v-if="!isEdit">555</template>
                    <span>CM</span>
                </el-form-item>
                <el-form-item label="体重:">
                    <el-input style="width:150px" size="small" v-if="isEdit" class="tz"></el-input>
                    <template v-if="!isEdit">555</template>
                    <span>KG</span>
                </el-form-item>
                <el-form-item label="住读/走读:">
                    <el-select placeholder="请选择" size="small" v-if="isEdit">
                        <el-option label="住读" value="0"></el-option>
                        <el-option label="走读" value="1"></el-option>
                    </el-select>
                    <template v-if="!isEdit">住读/走读</template>
                </el-form-item>
                <el-form-item label="离校方式:">
                    <el-select  placeholder="请选择离校方式" size="small" v-if="isEdit">
                        <el-option label="校车离校" value="0"></el-option>
                        <el-option label="结伴离校" value="1"></el-option>
                        <el-option label="家长接回" value="2"></el-option>
                    </el-select>
                    <template v-if="!isEdit">离校方式</template>
                </el-form-item>
                <el-form-item label="家庭住址:" style="width:100%">
                    <!-- <el-cascader
                        style="width: 100%"
                        filterable
                        :options="addList"
                        v-model="repInfo.stuAdds"/> -->
                    <el-input type="textarea" size="small" v-if="isEdit"></el-input>
                    <template v-if="!isEdit">家庭住址</template>
                </el-form-item>
            </div>
            <!-- PC显示监护人格式 -->
            <el-form-item label="监护人:" required v-if="!isPhone">
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
                <tbody>
                    <tr v-for="i in 2" :key="i">
                        <td>
                            <el-input :maxlength="20" v-model="repInfo.parents[i-1]['s_g']" :disabled="!isEdit"/>
                        </td>
                        <td>
                            <el-input :maxlength="20" v-model="repInfo.parents[i-1]['s_h']" :disabled="!isEdit"/>
                        </td>
                        <td>
                            <el-input :maxlength="10" v-model="repInfo.parents[i-1]['s_i']" :disabled="!isEdit"/>
                        </td>
                        <td>
                            <el-input :maxlength="50" v-model="repInfo.parents[i-1]['s_j']" :disabled="!isEdit"/>
                        </td>
                        <td>
                            <el-input :maxlength="30" v-model="repInfo.parents[i-1]['s_k']" :disabled="!isEdit"/>
                        </td>
                    </tr>
                </tbody>
              </table>
            </el-form-item>
            <!-- PHONE显示监护人格式 -->
            <template v-if="isPhone">
                <p class="basic_tit">监护人：</p>
                <div v-for="i in 2" :key="i">
                    <el-form-item label="姓名:" style="width:100%">
                        <el-input :maxlength="20" v-model="repInfo.parents[i-1]['s_g']" :disabled="!isEdit"/>
                    </el-form-item>
                    <el-form-item label="手机:" style="width:100%">
                        <el-input :maxlength="20" v-model="repInfo.parents[i-1]['s_h']" :disabled="!isEdit"/>
                    </el-form-item>
                    <el-form-item label="学历:" style="width:100%">
                        <el-input :maxlength="10" v-model="repInfo.parents[i-1]['s_i']" :disabled="!isEdit"/>
                    </el-form-item>
                    <el-form-item label="工作单位:" style="width:100%">
                        <el-input :maxlength="50" v-model="repInfo.parents[i-1]['s_j']" :disabled="!isEdit"/>
                    </el-form-item>
                    <el-form-item label="职务:" style="width:100%">
                        <el-input :maxlength="30" v-model="repInfo.parents[i-1]['s_k']" :disabled="!isEdit"/>
                    </el-form-item>
                </div>
            </template>
            <p class="basic_tit">其他：</p>
            <el-form-item label="有误病史:">
                <template v-if="isEdit">
                    <el-select  placeholder="请选择" size="small" style="width:100px">
                        <el-option label="无" value="0"></el-option>
                        <el-option label="有" value="1"></el-option>
                    </el-select>
                    <el-input style="width:553px" size="small"/>
                </template>
                <template v-if="!isEdit">有；爱仕达健康是福萨克斯缴费哈克</template>
            </el-form-item>
            <el-form-item label="有无过敏史:">
                <template v-if="isEdit">
                    <el-select  placeholder="请选择" size="small" style="width:100px">
                        <el-option label="无" value="0"></el-option>
                        <el-option label="有" value="1"></el-option>
                    </el-select>
                    <el-input style="width:553px" size="small"/>
                </template>
                <template v-if="!isEdit">有；爱仕达健康是福萨克斯缴费哈克</template>
            </el-form-item>
            <el-form-item label="备注1:" style="width:100%">
                <el-input type="textarea" size="small" v-if="isEdit"></el-input>
                <template v-if="!isEdit">备注1内容</template>
            </el-form-item>
            <el-form-item label="备注2:" style="width:100%">
                <el-input type="textarea" size="small" v-if="isEdit"></el-input>
                <template v-if="!isEdit">备注2内容</template>
            </el-form-item>
            <el-form-item label="备注3:" style="width:100%">
                <el-input type="textarea" size="small" v-if="isEdit"></el-input>
                <template v-if="!isEdit">备注3内容</template>
            </el-form-item>
        </el-form>
        <div class="sign-btn" v-if="isEdit">
          <span class="save" @click="saveInfo">保存</span>
          <span class="cancel" @click="isEdit = !isEdit">取消</span>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                repInfo:{
                    parents: [
                        {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
                        {s_g: "", s_h: "", s_i: "", s_j: "", s_k: ""},
                    ],
                },
                rules:{

                },
                addList:[],
                isEdit:false,//true:为编辑状态；false为预览状态
            }
        },
        computed:{
            isPhone: function () {
                return this.$store.state.isPhone
            },
        },
        mounted(){
            if(this.isPhone){
                // this.isEdit = true
            }
        },
        methods:{
            saveInfo(){
                this.isEdit = false
            }
        },
    }
</script>

<style lang="less" scoped>
    .report_info{
        margin-top: 30px;
        border-top:1px solid #eee;
        padding-top: 10px;
        .report_tit{
            font-weight: bold;
            color: #999;
            font-size: 14px;
            margin-bottom: 20px;
            span{
                float: right;
                color: #aa2f33;
                cursor: pointer;
            }
        }
    }
    .report_cont{
        position: relative;
        .el-form-item{
            margin-bottom: 15px;
        }
    }
    .user_img{
        width: 125px;
        height: 160px;
        float: left;
        border:1px solid #eee;
        position: absolute;top:0;left:20px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .basic_info{
        margin-left: 180px;
        .el-form-item{
            float: left;
            width: 50%;
        }
        .no_edit_data{
            margin-bottom: 0;
        }
    }
    .is_show{
        .el-form-item{
            margin-bottom: 0;
        }
    }
    .table_list{
        th{
            background: #eee;
        }
        td,th{
            border:1px solid #DCDFE6;
        }
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
            color: #333;
        }
        .submit {
            background: #eeeeee;
            width: 300px;
            color: #333;
        }
    }
    .basic_tit{
        display: none;
    }
</style>