<style lang="less" scoped>
.dialog {
  position: fixed;top: 0;right: 0;bottom: 0;left:0;
  .dialog_bg{
    position: absolute;top: 0;right: 0;bottom: 0;left:0;
    background:rgba(0,0,0,0.5);
  }
  .dialog_main{
    background: #fff;
    border:1px solid #ccc;
    position: absolute;top: 50%;left: 50%;
    width: 640px;
    height: 500px;
    margin-left: -320px;
    margin-top: -250px;
    .dialog_tit{
      border-bottom:1px solid #ccc;
      line-height:40px;
      padding:0 15px;
      background:#F7F7F7;
    }
    .close{
      width: 15px;
      height: 15px;
      background: url(~@/imgs/close.png) no-repeat;
      float: right;
      margin-top: 12px;
      cursor: pointer;
    }
  }
}
</style>
<template>
  <div class="dialog" v-if="is_show">
    <div class="dialog_bg"></div>
    <div class="dialog_main">
      <div class="dialog_tit">{{config.title}}<span class="close" @click="close"></span></div>
        <!--<file_upload v-if="fileConfig.userId"-->
        <!--@handleUpload="handleUpload"-->
        <!--:fileConfig="fileConfig"></file_upload>-->
      <file_upload @handleUpload="handleUpload" :fileConfig="fileConfig"></file_upload>
    </div>
  </div>
  <!-- <el-dialog :visible.sync="is_show"
             :title="config.title"
             custom-class="comm_upload_dialog"
             @open="open"
             @close="handleClose">

  </el-dialog> -->
</template>
<script>

    // 只注册一次, 每打开一次弹出框就覆盖此函数
    import file_upload from './file_upload_comp';
    export default {
      components: {
        file_upload,
      },
      data() {
        return {
          randomCode:window.guid(),
          is_show: false,
          uploadUrl: null,
          fileConfig: {
            serverBasePath: '',
            sessionId: '',
            uploadFileMaxNum: '',
            uploadSingleFileSizeLimit: '',
            fileFormatAccept: {
              title: '',
              formats: '',
              mimeTypes: '',
            },
            userId: '',
          },
        };
      },
      props: {
        config: {
          type: Object,
          default() {
            return {
              title: '',
            };
          },
        },
      },
      methods: {
        handleUpload(data) {
          let vm = this;
          if (data.code === vm.randomCode) {
            _.forEach(data.files, function(vv) {
              vv.fullPath = systemParameter.FILE_SYSTEM_URL + '/file/data/' + vv.id;
            });
            vm.config.confirm(data.files);
            vm.is_show = false;

            vm.randomCode= window.guid();
            vm.fileConfig.sessionId=vm.randomCode;
            WebUploader.Uploader.unRegister('business-webUpload');
          }
        },
        handleClose() {
          let vm = this;
            vm.randomCode= window.guid();
            vm.fileConfig.sessionId=vm.randomCode;
            vm.fileConfig = {};
            vm.is_show = false;
            WebUploader.Uploader.unRegister('business-webUpload');
        },
        close(){
          // this.is_show = false
          this.handleClose()
        },
        open() {
          let vm = this;
          vm.fileConfig = {
            serverBasePath: systemParameter.FILE_SYSTEM_URL,
            sessionId: vm.randomCode,
            uploadFileMaxNum: vm.config.uploadFileMaxNum,
            uploadSingleFileSizeLimit: vm.config.size
              ? vm.config.size
              : 20000 * 1024 * 1024,
            fileFormatAccept: {
              title: vm.config.title,
              extensions: vm.config.formats,
              mimeTypes: vm.config.mimeTypes,
            },
            userId: window.userInfo.id,
          };
        },
      },
      computed: {
      },
      watch: {
        is_show:function(val){
          if(val){
            this.open();
          }
        }
      },
      mounted() {
        let vm = this;
        setTimeout(function(){
          // vm.open();
        },300)
      },
    };
  </script>
