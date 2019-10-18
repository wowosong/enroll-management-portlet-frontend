<template >
    <div class="content">
        <!-- 个人信息 -->
        <div class="box">
            <span class="border-left">个人信息</span>
            <ul class="list">
                <li v-for="(item,index) in brInfo" :key="index">
                    <div class="left-box">
                        <span v-if="item.isRequired == 1" class="colorred">*</span>
                        <span>{{item.fieldName}}:</span>
                    </div>
                    <div class="right-box">
                        <span>{{item.fieldText}} <span v-if="item.remark  != ''">,{{item.remark}}</span></span>
                       
                    </div>
                </li>
            </ul>
        </div>
        <!-- 家长信息 -->
        <div class="box" v-if="parentInfo.length != 0">
            <span class="border-left">家长信息</span>
            <ul class="list">
                <li v-for="(item,index) in parentInfo" :key="index">
                    <div class="left-box">
                        <span v-if="item.isRequired == 1" class="colorred">*</span>
                        <span>{{item.fieldName}}:</span>
                    </div>
                    <div class="right-box">
                        <span>{{item.fieldText}}<span v-if="item.remark  != ''">,{{item.remark}}</span></span>
                       
                    </div>
                </li>
            </ul>
        </div>
        <!-- 其他信息 -->
        <div class="box" v-if="otherInfo.length != 0">
            <span class="border-left">其他信息</span>
            <ul class="list">
                <li v-for="(item,index) in otherInfo" :key="index">
                    <div class="left-box">
                        <span v-if="item.isRequired == 1" class="colorred">*</span>
                        <span>{{item.fieldName}}:</span>
                    </div>
                    <div class="right-box">
                        <span>{{item.fieldText}}</span>
                        <span v-if="item.remark  != ''">,{{item.remark}}</span>
                          <ul class="fileList" v-if="item.domType == 7">
                              <div v-if="isPhone == true">
                              <li v-if="fileInfo && fileInfo.length > 0" v-for="(item,index) in fileInfo" :key="index">
                                    <el-tooltip effect="light" :content="item.fileName" placement="top-start">
                                        <a style="color: #6dbfff" :href="downloadUrl+item.fileId">{{index + 1}}
                                            、{{item.fileName}}</a>`
                                    </el-tooltip>      
                                </li>
                                </div>
                                <div v-if="isPhone == false">
                                   <img :src="imgUrl + id" alt="" style="border: 1px solid #ccc ; width: 100px ; height: 100px" class="imgBig" @click="imgBig">
                                   <div class="maskImg" @click="FDimg" v-if="isBig">
                                     <img :src="imgUrl + id" alt="" >
                                     <div></div>
                                   </div>
                                </div>
                                 
                      </ul>
                    </div>
                    <!-- <ul class="fileList" v-if="item.domType == 7">
                              <div v-if="isPhone == true">
                              <li v-if="fileInfo && fileInfo.length > 0" v-for="(item,index) in fileInfo" :key="index">
                                    <el-tooltip effect="light" :content="item.fileName" placement="top-start">
                                        <a style="color: #6dbfff" :href="downloadUrl+item.fileId">{{index + 1}}
                                            、{{item.fileName}}</a>`
                                    </el-tooltip>      
                                </li>
                                </div>
                                <div v-if="isPhone ==false">
                                   <img :src="imgUrl + id" alt="" style="border: 1px solid #ccc ; width: 100px ; height: 100px" class="imgBig" @click="imgBig">
                                   <div class="maskImg" @click="FDimg" v-if="isBig">
                                     <img :src="imgUrl + id" alt="" >
                                   </div>
                                </div>
                                 
                      </ul> -->
                     
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
            configList: {},
            fileInfo: [],
            imgUrl: '/gateway/zuul/filesystem/api/image/thumbnail/',
            id: localStorage.getItem('imgId'),
            isPhone: this.$store.state.isPhone,
            isBig: false,
            downloadUrl: '/gateway/zuul/filesystem/file/download/'
        }
    },
    created() {
        let vm = this
         vm.isPhone = vm.$store.state.isPhone;
        //  console.log('isPone',vm.isPhone)
        http.get('/gateway/enroll/api/erReport/getByReportInfo/' + localStorage.getItem('planid') + "/" + localStorage.getItem('regid'))
        .then((xhr) => {
        // console.log(res.data.fieldInfos)
         if (xhr.data.code) {
            return;
          }
          vm.configList = xhr.data;
          vm.fileInfo = vm.configList.fileInfo;
          let idx = 0;
          let parentTemp = [];
          let temp = [
            "s_g",
            "s_h",
            "s_j"
            /*,
            "s_i",
            "s_k"*/
          ];
          //处理数据字典下拉列表数据
          if (vm.configList.fieldInfos && vm.configList.fieldInfos.length) {
            let map = {};
            for (let field of vm.configList.fieldInfos) {
              if (field.dicUri) {
                map[field.fieldCode] = field.dicUri;
              }
            }
            if (map && map != {}) {
              vm.getOtherEnum(map);
            }
          }
          vm.brInfo= [];
          vm.parentInfo = [];
          vm.otherInfo = [];
          for (let i of vm.configList.fieldInfos) {
            if (i.classifyName == '本人信息') {
              vm.brInfo.push(i);
            } else if (i.classifyName == '家长信息') {
              vm.parentInfo.push(i);
              if(vm.configList.flag) {
                if(temp.indexOf(i.fieldCode)!=-1) {
                  let temp = _.cloneDeep(i);
                  if (temp.fieldValue == i.fieldValue) {
                    temp.fieldValue = ""
                  }
                  if (temp.fieldText == i.fieldText) {
                    temp.fieldText = ""
                  }
                  parentTemp.push(temp);
                  idx = vm.parentInfo.length;
                }
              }
            } else {
              vm.otherInfo.push(i);
            }
          }
          for(let i of vm.parentInfo) {
            if(i.fieldCode == "s_g" && i.batNum == 1) {
              i.fieldName = '监护人1姓名';
            }
            if(i.fieldCode == "s_g" && i.batNum == 2) {
              i.fieldName = '监护人2姓名';
            }

            if(i.fieldCode == "s_h" && i.batNum == 1) {
              i.fieldName = '监护人1手机号';
            }
            if(i.fieldCode == "s_h" && i.batNum == 2) {
              i.fieldName = '监护人2手机号';
            }
            if(i.fieldCode == "s_j" && i.batNum == 1) {
              i.fieldName = '监护人1工作单位';
            }
            if(i.fieldCode == "s_j" && i.batNum == 2) {
              i.fieldName = '监护人2工作单位';
            }
          }
          if(vm.parentInfo && parentTemp && parentTemp.length) {
            for(let i of parentTemp) {
              if(i.fieldCode == "s_g") {
                i.fieldName = '监护人2姓名';
              }
              if(i.fieldCode == "s_h") {
                i.fieldName = '监护人2手机号';
              }
              if(i.fieldCode == "s_j") {
                i.fieldName = '监护人2工作单位';
              }
            }
            vm.parentInfo = vm.parentInfo.slice(0,idx).concat(parentTemp).concat(vm.parentInfo.splice(idx));
          }

     })
    },
    methods: {
      FDimg() {
        let vm = this
        vm.isBig = false
      },
      imgBig() {
        console.log('1111')
        this.isBig = true
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
              // vm.itemMap[c] = items;
            }
            vm.flag = true;
          }
        });
      },
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
                    width: 160px;
                    text-align: right;
                    padding-right: 10px;
                    .colorred {
                        color: red;
                    }
                }
                .right-box{ width: 650px; }
            }
        }
    }
    .maskImg {
      width: 100%;
      height: 100%;
      background:   rgba(204,204,204,.5);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 998;
    }
    .maskImg img {
      width: 600px;
      height: 600px;
      opacity: 1 !important;
      z-index: 999;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%)
    }
    @media screen and (max-width: 480px) {
      .is_phone {
        text-align: left  !important;
      }
      .content {
        margin-top: 30px;
        border-top: 1px solid #cccccc;
        .box {
          text-align: left;
             margin-top: 20px;
             border-bottom: 1px solid #cccccc;
            .border-left {
                border-left: 10px solid #97330e;
                padding-left: 8px;
                text-align: left 
            }
            .list {
                margin-top: 10px;
            }
            .list li {
                display: flex;
                margin-bottom: 10px;
                .left-box {
                    width: 160px;
                    
                    text-align: left;
                    padding-right: 10px;
                    .colorred {
                        color: red;
                    }
                }
                .right-box {
                  width: 200px;
                }
            }
        }
    }
    // .right-box {
    
    // }
    .right-box span {
      display: inline-block;
      width: 200px;
      word-break: break-word
    }
    }
</style>
