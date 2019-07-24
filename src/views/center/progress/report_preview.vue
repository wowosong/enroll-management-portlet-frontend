<template >
    <div class="content">
        <!-- 个人信息 -->
        <div class="box">
            <span class="border-left">个人信息</span>
            <ul class="list">
                <li v-for="(item,index) in brInfo" :key="index">
                    <div class="left-box">
                        <span v-if="item.isRequired == 0" class="colorred">*</span>
                        <span>{{item.fieldName}}:</span>
                    </div>
                    <div class="right-box">
                        <span>{{item.fieldText}}</span>
                        <span v-if="item.remark  != ''">,{{item.remark}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 家长信息 -->
        <div class="box">
            <span class="border-left">家长信息</span>
            <ul class="list">
                <li v-for="(item,index) in parentInfo" :key="index">
                    <div class="left-box">
                        <span v-if="item.isRequired == 0" class="colorred">*</span>
                        <span>{{item.fieldName}}:</span>
                    </div>
                    <div class="right-box">
                        <span>{{item.fieldText}}</span>
                        <span v-if="item.remark  != ''">,{{item.remark}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 其他信息 -->
        <div class="box">
            <span class="border-left">其他信息</span>
            <ul class="list">
                <li v-for="(item,index) in otherInfo" :key="index">
                    <div class="left-box">
                        <span v-if="item.isRequired == 0" class="colorred">*</span>
                        <span>{{item.fieldName}}:</span>
                    </div>
                    <div class="right-box">
                        <span>{{item.fieldText}}</span>
                        <span v-if="item.remark  != ''">,{{item.remark}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            brInfo: [], // 本人信息
            parentInfo: [], // 家长信息
            otherInfo: [], // 其他信息
        }
    },
    created() {
        let vm = this
        http.get('/gateway/enroll/api/erReport/getByReportInfo/' + localStorage.getItem('planid') + "/" + localStorage.getItem('regid'))
        .then((res) => {
         console.log(res.data.fieldInfos)
         let info = res.data.fieldInfos
         info.forEach(item => {
             if(item.classifyName == '本人信息'){
                 vm.brInfo.push(item)
             }
             if(item.classifyName == '家长信息'){
                 vm.parentInfo.push(item)
             }
             if(item.classifyName == '其他信息'){
                 vm.otherInfo.push(item)
             }
         });

     })
    },
    methods: {
        
    }
}
</script>
<style lang="less" scoped>
    .content {
        margin-top: 30px;
        border-top: 1px solid #cccccc;
        .box {
             margin-top: 20px;
             border-bottom: 1px solid #cccccc;
            .border-left {
                border-left: 10px solid #97330e;
                padding-left: 8px;
                
            }
            .list {
                margin-top: 10px;
            }
            .list li {
                display: flex;
                margin-bottom: 10px;
                .left-box {
                    width: 140px;
                    text-align: right;
                    padding-right: 10px;
                    .colorred {
                        color: red;
                    }
                }
            }
        }
    }
</style>
