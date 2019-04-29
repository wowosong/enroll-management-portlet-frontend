<template>
    <div class="report_info">
        <el-form :model="repInfo" :rules="rules" ref="ruleForm" label-width="102px" class="report_cont">
            <div class="user_img"><img src="@/imgs/404.png"></div>
            <div class="basic_info">
                <el-form-item label="学生姓名:" class="no_edit_data">张三山</el-form-item>
                <el-form-item label="省份证号:" class="no_edit_data">510923199205185908</el-form-item>
                <el-form-item label="性别:" class="no_edit_data">女</el-form-item>
                <el-form-item label="出生日期:" class="no_edit_data">1992-05-02</el-form-item>
                <el-form-item label="身高:">
                    <el-input style="width:150px" size="small"></el-input>
                    <span>CM</span>
                </el-form-item>
                <el-form-item label="体重:">
                    <el-input style="width:150px" size="small"></el-input>
                    <span>KG</span>
                </el-form-item>
                <el-form-item label="住读/走读:">
                    <el-select placeholder="请选择" size="small">
                        <el-option label="住读" value="0"></el-option>
                        <el-option label="走读" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="离校方式:">
                    <el-select  placeholder="请选择离校方式" size="small">
                        <el-option label="校车离校" value="0"></el-option>
                        <el-option label="结伴离校" value="1"></el-option>
                        <el-option label="家长接回" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="家庭住址:" style="width:100%">
                    <!-- <el-cascader
                        style="width: 100%"
                        filterable
                        :options="addList"
                        v-model="repInfo.stuAdds"/> -->
                    <el-input type="textarea" size="small"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="监护人:" required>
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
                            <el-input :maxlength="20" v-model="repInfo.parents[i-1]['s_g']"/>
                        </td>
                        <td>
                            <el-input :maxlength="20" v-model="repInfo.parents[i-1]['s_h']"/>
                        </td>
                        <td>
                            <el-input :maxlength="10" v-model="repInfo.parents[i-1]['s_i']"/>
                        </td>
                        <td>
                            <el-input :maxlength="50" v-model="repInfo.parents[i-1]['s_j']"/>
                        </td>
                        <td>
                            <el-input :maxlength="30" v-model="repInfo.parents[i-1]['s_k']"/>
                        </td>
                    </tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item label="有误病史:">
                <el-select  placeholder="请选择" size="small" style="width:100px">
                    <el-option label="无" value="0"></el-option>
                    <el-option label="有" value="1"></el-option>
                </el-select>
                <el-input style="width:553px" size="small"/>
            </el-form-item>
            <el-form-item label="有无过敏史:">
                <el-select  placeholder="请选择" size="small" style="width:100px">
                    <el-option label="无" value="0"></el-option>
                    <el-option label="有" value="1"></el-option>
                </el-select>
                <el-input style="width:553px" size="small"/>
            </el-form-item>
            <el-form-item label="备注1:" style="width:100%">
                <el-input type="textarea" size="small"></el-input>
            </el-form-item>
            <el-form-item label="备注2:" style="width:100%">
                <el-input type="textarea" size="small"></el-input>
            </el-form-item>
            <el-form-item label="备注3:" style="width:100%">
                <el-input type="textarea" size="small"></el-input>
            </el-form-item>
        </el-form>
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
                addList:[]
            }
        }
    }
</script>

<style lang="less" scoped>
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
    .table_list{
        th{
            background: #eee;
        }
        td,th{
            border:1px solid #DCDFE6;
        }
    }
</style>

