<style lang="less">
    .comm_upload_dialog {
      width: 640px;
    }
  </style>
  <template>
  
      <div id="wrapper">
        <div id="container">
          <!--头部，相册选择和格式选择-->
          <div id="uploader">
            <div class="queueList">
              <div id="dndArea" class="placeholder">
                <div id="filePicker"></div>
                <p>单次最多可选{{fileConfig.uploadFileMaxNum}}个文件进行上传</p>
              </div>
            </div>
            <div class="statusBar" style="display:none;">
              <div class="progress">
                <span class="text">0%</span>
                <span class="percentage"></span>
              </div>
              <div class="info"></div>
              <div class="btns">
                <div id="filePicker2"></div>
                <div class="uploadBtn" id="btnUpload">开始上传</div>
                <div class="webuploader-pick okBtn" id="btnOK" @click="sendFiles">完成上传</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </template>
  <script>
     window.uploadReturnResult = {
          code:"",
          files:[]
      };
      window.addUploadSuccessFiles=function(data) {
      if (typeof (data) != "undefined" && typeof (data.result) != "undefined" &&
        data.result != null && !fileIdExist(data.result.id)) {
        uploadReturnResult.files.push(data.result); 
      }
  
      if (uploadReturnResult.files.length > 0) {
        $("#btnOK").show();
      } 
    }
  
    window.fileIdExist=function(id) {
      if (uploadReturnResult.files.length == 0) return false;
  
      for (var i = 0; i < uploadReturnResult.files.length; i++) {
        if (uploadReturnResult.files[i].id === id) {
          return true;
        }
      }
      return false;
    }
    export default {
      props: {
        fileConfig: {
          type: Object,
          default () {
            return {}
          }
        },
      },
      data() {
        return {
          is_show: false,
          uploadUrl: null,
        }
      },
      methods: {      
        sendFiles(){
           let vm = this; 
            vm.$emit("handleUpload",uploadReturnResult)
         }
      },
      computed: {},
      watch: {},
      mounted() {
        let vm = this;
        $("#btnOK").hide();
        window.uploadReturnResult = {
          code:"",
          files:[]
        };
        uploadReturnResult.code=vm.fileConfig.sessionId;
        initFileUploader(vm.fileConfig);
      },
    }
  </script>