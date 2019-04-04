<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-select v-model="areaInfo.provinceId" clearable placeholder="省" @change="getCity">
        <el-option v-for="item in provinces" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select v-model="areaInfo.cityId" clearable placeholder="市" @change="getArea">
        <el-option v-for="item in citys" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select v-model="areaInfo.areaId" clearable placeholder="区(县)" @change="selectInfo">
        <el-option v-for="item in areas" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "cityPicker",
    props:{
      provinceId:{
        type:String,
        default:''
      },
      cityId:{
        type:String,
        default:''
      },
      areaId:{
        type:String,
        default:''
      },
    },
    data() {
      return {
        provinces: [{
          value: '选项1',
          label: '四川省'
        }],
        citys: [{
          value: '选项1',
          label: '成都市'
        }],
        areas: [{
          value: '选项1',
          label: '武侯区'
        }],
        areaInfo:{
          provinceId:'',
          cityId:'',
          areaId:''
        }
      }
    },
    mounted() {
    },
    methods: {
      // 获取市
      getCity(){

      },
      // 获取区,县
      getArea(){

      },
      // 回调
      selectInfo(){
        let vm = this;
        vm.$emit('selectedFn', vm.areaInfo)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
