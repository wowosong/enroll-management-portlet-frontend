<template>
  <div>
    <table v-if="pageFlag" style="width: 100%; font-size: 13px; margin-bottom: 10px;">
      <tr>
        <td style="background: #ebeef5">
          <el-button type="primary" @click="beforeWeek" icon="el-icon-arrow-left"/>
          <el-button type="primary" @click="afterWeek" icon="el-icon-arrow-right"/>
        </td>
        <td :style="(item.today?'background: #409EFF; color: #fff':'background: #ebeef5')" v-for="item in tableHead"
            :key="item.date">
          <div>{{item.date| dateFormatYmd}}</div>
          <div>{{item.weekday}}</div>
        </td>
      </tr>
      <tr v-for="item in trTime" :key="item.seiValue">
        <td style="background: #ebeef5">{{item.seiName}}</td>
        <td v-for="i in tableHead"
            :key="i.date"
            @mouseover="changeBg('#409EFF', i.date+item.seiValue, (reserveMap[i.date]&&new Date()<i.date)?reserveMap[i.date][item.seiValue].nonChange:true)"
            @mouseout="changeBg('#fff', i.date+item.seiValue, (reserveMap[i.date]&&new Date()<i.date)?reserveMap[i.date][item.seiValue].nonChange:true)"
            @click="choseTime((reserveMap[i.date]&&new Date()<i.date&&!reserveMap[i.date][item.seiValue].nonChange)?reserveMap[i.date][item.seiValue].id:'')"
            :id="i.date+item.seiValue"
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
</template>

<script>
  export default {
    props: {planId: String},
    name: "reserve",
    data() {
      return {
        editFlag: false,
        tableHead: [],
        trTime: [],
        addWeek: 0,
        copyNum: "",
        minNum: "",
        today: {},
        reserveMap: {},
        pageFlag: false,
      }
    },
    mounted() {
      const vm = this;
      vm.pageFlag = false;
      vm.thisWeek();
    },
    methods: {
      choseTime(id) {
        if (!id) {
          return;
        }
        console.log("id, id: ", id)
        this.$emit("serReserve", id);
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

<style scoped>
  td {
    text-align: center;
    border: 1px solid #e5e7ea;
    padding: 5px;
  }

  .set_reserve {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 2px solid #ebeef5;
  }
</style>
