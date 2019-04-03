<template>
    <div class="progress" >
        <div class="rate_hint">
            <img src="@/imgs/pass.png" v-if="stempInfo.isPass == 0">
            <img src="@/imgs/sh.png" v-if="stempInfo.isPass == 1">
            <div class="hint_info">
                <template v-if="stempInfo.status == 0">报名<span class="color1">成功</span>，请按学校通知时间到校现场确认，并参加面试（笔试）~</template>
                <template v-if="stempInfo.status == 1 && stempInfo.isPass == 0">
                    <div>您<span class="color1">已被录取</span><span class="btn">查看成绩</span></div>
                    <div>请在截止时间前完成缴费~</div><div>缴费截止时间：2019-06-10</div>
                </template>
                <template v-if="stempInfo.status == 1 && stempInfo.isPass == 1">
                    <div>您<span class="color1">未已被录取</span><span class="btn">查看成绩</span></div>
                    <div>人生的机会还有很多哦...</div>
                </template>
                <template v-if="stempInfo.status == 2">请在预约时间段前往学校缴费<p>2019-06-01  14:00~16:00</p></template>
                <template v-if="stempInfo.status == 3">恭喜您，缴费成功！<span>6500元</span></template>
                <template v-if="stempInfo.status == 4">分班与寝室分配已公布~</template>
                <template v-if="stempInfo.status == 5">请按学校通知时间到校报到，并填写报到信息~</template>
            </div>
        </div>
        <template v-if="stempInfo.status == 1 && stempInfo.isPass == 0">
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
                    <td>sds</td>
                    <td>1828702541999</td>
                    <td>水电费水电费</td>
                    <td>师傅的说法是的发生的</td>
                    <td>时代大厦多所</td>
                </tr>
            </table>
            <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="172px">
                <el-form-item label="预约缴费时间段:" prop="dataTime" required>
                    <el-date-picker
                        v-model="formData.dataTime"
                        type="date"
                        placeholder="选择日期" style="width:180px">
                    </el-date-picker>
                    <el-time-picker
                        is-range
                        v-model="formData.timeRang"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围" style="width:390px">
                    </el-time-picker>
                </el-form-item>
            </el-form>
        </template>
        <template v-if="stempInfo.status == 3">
            <table class="table_list">
                <thead>
                    <tr>
                        <th>报名卡号</th>
                        <th>姓名</th>
                        <th>身份证号</th>
                        <th>奖学金（元）</th>
                        <th>应缴费（元）</th>
                    </tr>
                </thead>
                <tr>
                    <td>33333</td>
                    <td>zhangsanasan</td>
                    <td>510923199205815</td>
                    <td>343</td>
                    <td>5600</td>
                </tr>
            </table>
            <p class="pay_hint">友情提示：若需要退学退费，请线下联系学校财务。</p>
        </template>
        <template v-if="stempInfo.status == 4">
            <table class="table_list">
                <thead>
                    <tr>
                        <th>报名卡编号</th>
                        <th>姓名</th>
                        <th>身份证号</th>
                        <th>校区</th>
                        <th>年级</th>
                        <th>所属班级</th>
                        <th>所属寝室</th>
                    </tr>
                </thead>
                <tr>
                    <td>33333</td>
                    <td>zhangsanasan</td>
                    <td>510923199205815</td>
                    <td>343</td>
                    <td>5600</td>
                    <td>343</td>
                    <td>5600</td>
                </tr>
            </table>
        </template>
        <template v-if="stempInfo.status == 5">
            <div class="btn sub_btn">填写报到信息</div>
        </template>
    </div>
</template>
<script>
export default {
    data(){
        return{
            stempInfo:{
                status:5,
                isPass:0
            },
            formData:{
                dataTime:'',
                timeRang:''
            },
            rules:{
                dataTime:[]
            }
        }
    },
    mounted(){
        this.query()
    },
    methods:{
        query(){

        }
    }
}
</script>
<style lang="less" scoped>
    .progress{
        padding: 40px 20px 20px 60px;
    }
    .rate_hint{
        font-size: 16px;
        img{
            float: left;

        }
        .hint_info{
            margin-left: 40px;
            line-height: 26px;
        }
    }
    .color1{
        color: #aa2f33;
    }
    .btn{
        width: 95px;
        line-height: 30px;
        text-align: center;
        // background: #aa2f33;
        color: #aa2f33;
        border:1px solid #aa2f33;
        border-radius: 4px;
        margin: 0 auto;
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
    }
    .btn:hover,
    .sub_btn{
        background: #aa2f33;
        color: #fff;
    }
    .sub_btn{
        margin-left:300px;
        margin-top: 40px;
    }
    .table_list{
        width: 100%;
        margin: 20px 0;
        thead{
            background: #f7f7f7;
            color: #999;
        }
        td,th{
            height: 48px;
            border:1px solid #ddd;
            text-align: center;
        }
    }
    .pay_hint{
        text-align: right;
        color: #666;
    }
</style>
