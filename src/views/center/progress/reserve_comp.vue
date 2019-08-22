<template>
  <div class="reserve-wrap" v-if="pageFlag">
    <div class="reserve-ceil" v-if="isPhone">
      <div class="grid">
        <el-button class="arrow-btn" type="primary" @click="beforeWeek" icon="el-icon-arrow-left"/>
        <el-button class="arrow-btn" type="primary" @click="afterWeek" icon="el-icon-arrow-right"/>
      </div>
      <div class="grid" v-for="item in trTime" :key="item.seiValue">
        {{item.seiName}}
      </div>
    </div>
    <div class="reserve-table">
      <table>
        <tr>
          <td style="background: #ebeef5" v-if="!isPhone">
            <el-button class="arrow-btn" type="primary" @click="beforeWeek" icon="el-icon-arrow-left"/>
            <el-button class="arrow-btn" type="primary" @click="afterWeek" icon="el-icon-arrow-right"/>
          </td>
          <td :style="(item.today?'background: #409EFF; color: #fff':'background: #ebeef5')" v-for="item in tableHead"
              :key="item.date">
            <div>{{item.date| dateFormatYmd}}</div>
            <div>{{item.weekday}}</div>
          </td>
        </tr>
        <tr v-for="item in trTime" :key="item.seiValue">
          <td v-if="!isPhone" style="background: #ebeef5">{{item.seiName}}</td>
          <td v-for="(i,index) in tableHead" 
              :key="i.date"
              @mouseover="changeBg('#409EFF', i.date+item.seiValue, (reserveMap[i.date]&&new Date()<i.date)?reserveMap[i.date][item.seiValue].nonChange:true)"
              @mouseout="changeBg('#fff', i.date+item.seiValue, (reserveMap[i.date]&&new Date()<i.date)?reserveMap[i.date][item.seiValue].nonChange:true)"
              @click="choseTime((reserveMap[i.date]&&new Date()<i.date&&!reserveMap[i.date][item.seiValue].nonChange)?{id:reserveMap[i.date][item.seiValue].id,time:item.seiName,day:i.date}:'')"
              :id="i.date+item.seiValue" v-bind:class="backgroundId==(reserveMap[i.date]?(reserveMap[i.date][item.seiValue]).id:'')?'backgroundStyle':''"
              :style="(reserveMap[i.date]&&new Date()<i.date)?(reserveMap[i.date][item.seiValue].nonChange?'background: #ff0000; color: #fff':'background: #fff'):'background: #e4e7ed'">
          <span v-if="reserveMap[i.date] && new Date() < i.date">
            <span v-if="reserveMap[i.date][item.seiValue].nonChange">
              已约满
            </span>
            <span v-else>
              可预约
            </span>
          </span>
            <span v-else>不可预约</span>
          </td>
        </tr>
      </table>
    </div>
  </div>

</template>

<script>
  export default {
    props: {planId: String},
    name: "reserve",
    data() {
      return {
        backgroundId:"default",
        editFlag: false,
        tableHead: [],
        trTime: [],
        addWeek: 0,
        copyNum: "",
        minNum: "",
        today: {},
        reserveMap: {},
        pageFlag: false,
        selectId: ''
      }
    },
    computed: {
      isPhone: function () {
        return this.$store.state.isPhone
      },
    },
    mounted() {
      const vm = this;
      vm.pageFlag = false;
      vm.thisWeek();
    },
    methods: {
      choseTime(msg) {       
        if (!msg) {
          return;
        }
        this.backgroundId = msg.id;
        this.$emit("serReserve", msg);
      },
      changeBg(color, id, nonChange) {
        if (nonChange) {
          return;
        }
        $("#" + id).css("background-color", color);
      },
      getReserve() {
        const vm = this;
        http.get("/gateway/enroll/erPayment/reserves/" + vm.planId).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          let reserves = xhr.data.data;
          vm.reserveMap = {};
          let reserveDateList = [];
          for (let r of reserves) {
            if (reserveDateList.indexOf(r.reserveDate) == -1) {
              reserveDateList.push(r.reserveDate);
            }
          }
          for (let date of reserveDateList) {
            let obj = {};
            let haveNum = 0;
            let maxNum = 0;
            for (let r of reserves) {
              if (r.reserveDate == date) {
                r.haveNum = r.haveNum ? r.haveNum : 0;
                vm.$set(r, "nonChange", r.maxNum <= r.haveNum && r.maxNum != 0);
                obj[r.timeVal] = r;
                haveNum += r.haveNum;
                maxNum += r.maxNum;
              }
            }
            obj["haveNum"] = haveNum;
            obj["maxNum"] = maxNum;
            vm.reserveMap[date] = obj;
          }
          vm.getEnum();
        })
      },
      getEnum() {
        let vm = this;
        var enumCodes = "YYJFSJD";
        Promise.all([
          http.get("/gateway/platform/api/enum/queryByCodes/" + enumCodes)
        ]).then(function (list) {
          vm.trTime = _.filter(list[0].data, function (i) {
            return i.code == "YYJFSJD";
          });
          vm.pageFlag = true;
        });
      },
      thisWeek() {
        const vm = this;
        http.get("/gateway/enroll/erPayment/thisWeek/" + vm.addWeek).then((xhr) => {
          if (xhr.data.code) {
            return;
          }
          vm.tableHead = xhr.data.data;
          vm.getReserve();
        })
      },
      afterWeek() {
        const vm = this;
        vm.addWeek++;
        vm.thisWeek();
      },
      beforeWeek() {
        const vm = this;
        vm.addWeek--;
        vm.thisWeek();
      },
    },
  };
</script>

<style scoped lang="less">
  .reserve-table {
    width: 100%;
    font-size: 13px;
    margin-bottom: 10px;
    table {
      width: 100%;
    }
  }

  td {
    text-align: center;
    border: 1px solid #e5e7ea;
    padding: 5px;
  }

  .is_phone {
    .reserve-wrap {
      font-size: 13px;
      position: relative;
      .reserve-ceil {
        background: #ebeef5;
        width: 100px;
        position: absolute;
        left: 0;
        z-index: 999;
        .grid:first-child {
          height: 57px;
          line-height: 57px;
        }
        .grid {
          height: 31px;
          line-height: 31px;
        }
      }
      .reserve-table {
        width: 100%;
        overflow-x: scroll;
        table {
          width: 800px;
          margin-left: 100px;
        }
        .reserve-tr {
          td:first-child {
            position: absolute;
            top: 0;
            left: 0;
          }
        }

      }
      .arrow-btn {
        padding: 2px 4px;
      }
      td {
        padding: 2px;
      }
    }

  }

  .backgroundStyle{
    background: rgb(64, 158, 255) !important;
    color: white !important;
  }
</style>
