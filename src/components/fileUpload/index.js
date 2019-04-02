import Vue from 'vue'
import Comp from './comp.vue';
let instance;
window.fileUpload = function (configOrFn) {
  if (!instance) {
    instance = new Vue (Comp);
    instance.$mount ();
    Vue.nextTick (function () {
      document.body.appendChild (instance.$el);
      doShow ();
    });
  } else {
    doShow ();
  }

  function doShow () {
    let defaultConfig = {
      title: '上传文件',
      uploadFileMaxNum: 1,
      formats: '',
      confirm: function (files) {},
    };

    if (typeof configOrFn === 'function') {
      defaultConfig.confirm = configOrFn;
    } else {
      Vue.util.extend (defaultConfig, configOrFn);
    }

    instance.config = defaultConfig;
    instance.is_show = true;
  }
};
window.guid = function () {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace (/[xy]/g, function (c) {
    var r = (Math.random () * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString (16);
  });
};
window.convertFileStatus = function (attachIds, success) {
  let url = systemParameter.FILE_SYSTEM_URL + '/api/convert/begin/';
  if (typeof attachIds === 'string') {
    attachIds = [attachIds];
  }
  let ids = [];
  _.forEach (attachIds, function (v) {
    ids.push (_.trim (v));
  });
  $.get (url + ids.join (',')).then (function (rs) {
    if (success) {
      success ();
    }
  });
};
window.updateFileStatus = function (attachIds, success) {
  let url = systemParameter.FILE_SYSTEM_URL + '/file/update/';
  if (typeof attachIds === 'string') {
    attachIds = [attachIds];
  }
  let ids = [];
  _.forEach (attachIds, function (v) {
    ids.push (_.trim (v));
  });
  $.get (url + ids.join (',')).then (function (rs) {
    if (rs.length) {
      MessageBox.alert (rs);
    } else {
      success ();
    }
  });
}; 
window.initFileUploader = function (config) {
  var $wrap = $ ('#uploader'),
    // 图片容器
    $queue = $ ('<ul class="filelist"></ul>').appendTo (
      $wrap.find ('.queueList')
    ),
    // 状态栏，包括进度和控制按钮
    $statusBar = $wrap.find ('.statusBar'),
    // 文件总体选择信息。
    $info = $statusBar.find ('.info'),
    // 上传按钮
    $upload = $wrap.find ('.uploadBtn'),
    // 没选择文件之前的内容。
    $placeHolder = $wrap.find ('.placeholder'),
    $progress = $statusBar.find ('.progress').hide (),
    // 添加的文件数量
    fileCount = 0,
    // 添加的文件总大小
    fileSize = 0,
    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio || 1,
    // 缩略图大小
    thumbnailWidth = 110 * ratio,
    thumbnailHeight = 110 * ratio,
    // 可能有pedding, ready, uploading, confirm, done.
    state = 'pedding',
    // 所有文件的进度信息，key为file id
    percentages = {},
    // 判断浏览器是否支持图片的base64
    isSupportBase64 = (function () {
      var data = new Image ();
      var support = true;
      data.onload = data.onerror = function () {
        if (this.width != 1 || this.height != 1) {
          support = false;
        }
      };
      data.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      return support;
    }) (),
    // 检测是否已经安装flash，检测flash的版本
    flashVersion = (function () {
      var version;

      try {
        version = navigator.plugins['Shockwave Flash'];
        version = version.description;
      } catch (ex) {
        try {
          version = new ActiveXObject (
            'ShockwaveFlash.ShockwaveFlash'
          ).GetVariable ('$version');
        } catch (ex2) {
          version = '0.0';
        }
      }
      version = version.match (/\d+/g);
      return parseFloat (version[0] + '.' + version[1], 10);
    }) (),
    supportTransition = (function () {
      var s = document.createElement ('p').style,
        r =
          'transition' in s ||
          'WebkitTransition' in s ||
          'MozTransition' in s ||
          'msTransition' in s ||
          'OTransition' in s;
      s = null;
      return r;
    }) (),
    // WebUploader实例
    uploader;

  if (!WebUploader.Uploader.support ('flash') && WebUploader.browser.ie) {
    // flash 安装了但是版本过低。
    if (flashVersion) {
      (function (container) {
        window['expressinstallcallback'] = function (state) {
          switch (state) {
            case 'Download.Cancelled':
              alert ('您取消了更新！');
              break;

            case 'Download.Failed':
              alert ('安装失败');
              break;

            default:
              alert ('安装已成功，请刷新！');
              break;
          }
          delete window['expressinstallcallback'];
        };

        var swf = './expressInstall.swf';
        // insert flash object
        var html =
          '<object type="application/' +
          'x-shockwave-flash" data="' +
          swf +
          '" ';

        if (WebUploader.browser.ie) {
          html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
        }

        html +=
          'width="100%" height="100%" style="outline:0">' +
          '<param name="movie" value="' +
          swf +
          '" />' +
          '<param name="wmode" value="transparent" />' +
          '<param name="allowscriptaccess" value="always" />' +
          '</object>';

        container.html (html);
      }) ($wrap);

      // 压根就没有安转。
    } else {
      $wrap.html (
        '<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>'
      );
    }

    return;
  } else if (!WebUploader.Uploader.support ()) {
    alert ('Web Uploader 不支持您的浏览器！');
    return;
  }
  WebUploader.Uploader.register (
    {
      name: 'business-webUpload',
      'before-send': 'beforeSend',
    },
    {
      beforeSend: function (block) {
        //分片验证是否已传过，用于断点续传
        var task = new $.Deferred ();
        $.ajax ({
          type: 'POST',
          url: config.serverBasePath + '/api/upload/chunkexist',
          data: {
            chunkIndex: block.chunk,
            userId: config.userId,
            sessionId: config.sessionId,
            fileName: block.file.name,
          },
          cache: false,
          async: false,
          timeout: 6 * 60 * 60 * 1000, //todo 超时的话，只能认为该分片未上传过
          dataType: 'json',
        }).then (
          function (data, textStatus, jqXHR) {
            if (data.exist) {
              //若存在，返回失败给WebUploader，表明该分块不需要上传
              task.reject ();
            } else {
              task.resolve ();
            }
          },
          function (jqXHR, textStatus, errorThrown) {
            //任何形式的验证失败，都触发重新上传
            task.resolve ();
          }
        );

        return $.when (task);
      },
    }
  );

  // 实例化
  uploader = WebUploader.create ({
    pick: {
      id: '#filePicker',
      label: '点击选择文件',
    },
    formData: {
      userId: config.userId,
      sessionId: config.sessionId,
    },
    swf: '../../../static/webuploader/dist/Uploader.swf',
    chunked: true,
    chunkSize: 1 * 1024 * 1024,
    threads: 1,
    server: config.serverBasePath + '/file/upload',
    // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
    disableGlobalDnd: true,
    //是否支持重复上传
    duplicate: false,
    fileNumLimit: config.uploadFileMaxNum,
    fileSizeLimit: 50 * 20000 * 1024 * 1024, // 20000 M
    fileSingleSizeLimit: config.uploadSingleFileSizeLimit, // 20000 M
    accept: config.fileFormatAccept,
  });
  

  // 添加“添加文件”的按钮，
  uploader.addButton ({
    id: '#filePicker2',
    label: '继续添加',
  });
  uploader.on ('uploadSuccess', function (file, response) {
    addUploadSuccessFiles (response);
  });

  uploader.on ('ready', function () {
    window.uploader = uploader;
  });

  // 当有文件添加进来时执行，负责view的创建
  function addFile (file) {
    var text = '';
    var $li = $ (
      '<li id="' +
        file.id +
        '">' +
        '<p class="title">' +
        file.name +
        '</p>' +
        '<p class="imgWrap"></p>' +
        '<p class="progress"><span></span></p>' +
        '</li>'
    ),
      $btns = $ (
        '<div class="file-panel">' + '<span class="cancel">删除</span>'
      ).appendTo ($li),
      $prgress = $li.find ('p.progress span'),
      $wrap = $li.find ('p.imgWrap'),
      $info = $ ('<p class="error"></p>'),
      showError = function (code) {
        switch (code) {
          case 'exceed_size':
            text = '文件大小超出';
            break;
          case 'Q_EXCEED_NUM_LIMIT':
            text = '超出上传文件数量限制！';
            break;
          case 'Q_TYPE_DENIED':
            text = '不支持此类型文件上传！';
            break;
          case 'interrupt':
            text = '上传暂停';
            break;
          default:
            text = '上传失败，请重试';
            break;
        }

        $info.text (text).appendTo ($li);
      };

    if (file.getStatus () === 'invalid') {
      showError (file.statusText);
    } else {
      // @todo lazyload
      $wrap.text ('预览中');
      uploader.makeThumb (
        file,
        function (error, src) {
          var img;

          if (error) {
            $wrap.text ('不能预览');
            return;
          }

          if (isSupportBase64) {
            img = $ ('<img src="' + src + '">');
            $wrap.empty ().append (img);
          } else {
            $.ajax (config.serverBasePath + '/file/preview', {
              method: 'POST',
              data: src,
              dataType: 'json',
            }).done (function (response) {
              if (response.result) {
                img = $ ('<img src="' + response.result + '">');
                $wrap.empty ().append (img);
              } else {
                $wrap.text ('预览出错');
              }
            });
          }
        },
        thumbnailWidth,
        thumbnailHeight
      );

      percentages[file.id] = [file.size, 0];
      file.rotation = 0;
    }

    file.on ('statuschange', function (cur, prev) {
      if (prev === 'progress') {
        $prgress.hide ().width (0);
      } else if (prev === 'queued') {
        $li.off ('mouseenter mouseleave');
        $btns.remove ();
      }

      // 成功
      if (cur === 'error' || cur === 'invalid') {
        showError (file.statusText);
        percentages[file.id][1] = 1;
      } else if (cur === 'interrupt') {
        showError ('interrupt');
      } else if (cur === 'queued') {
        $info.remove ();
        $prgress.css ('display', 'block');
        percentages[file.id][1] = 0;
      } else if (cur === 'progress') {
        $info.remove ();
        $prgress.css ('display', 'block');
      } else if (cur === 'complete') {
        $prgress.hide ().width (0);
        $li.append ('<span class="success"></span>');
      }

      $li.removeClass ('state-' + prev).addClass ('state-' + cur);
    });

    $li.on ('mouseenter', function () {
      $btns.stop ().animate ({
        height: 30,
      });
    });

    $li.on ('mouseleave', function () {
      $btns.stop ().animate ({
        height: 0,
      });
    });

    $btns.on ('click', 'span', function () {
      var index = $ (this).index (), deg;

      if (index === 0) {
        uploader.removeFile (file);
        return;
      }

      if (supportTransition) {
        deg = 'rotate(' + file.rotation + 'deg)';
        $wrap.css ({
          '-webkit-transform': deg,
          '-mos-transform': deg,
          '-o-transform': deg,
          transform: deg,
        });
      } else {
        $wrap.css (
          'filter',
          'progid:DXImageTransform.Microsoft.BasicImage(rotation=' +
            ~~(file.rotation / 90 % 4 + 4) % 4 +
            ')'
        );
      }
    });

    $li.appendTo ($queue);
  }

  // 负责view的销毁
  function removeFile (file) {
    var $li = $ ('#' + file.id);

    delete percentages[file.id];
    updateTotalProgress ();
    $li.off ().find ('.file-panel').off ().end ().remove ();
  }

  function updateTotalProgress () {
    var loaded = 0, total = 0, spans = $progress.children (), percent;

    $.each (percentages, function (k, v) {
      total += v[0];
      loaded += v[0] * v[1];
    });

    percent = total ? loaded / total : 0;

    spans.eq (0).text (Math.round (percent * 100) + '%');
    spans.eq (1).css ('width', Math.round (percent * 100) + '%');
    updateStatus ();
  }

  function updateStatus () {
    var text = '', stats;

    if (state === 'ready') {
      text =
        '选中' + fileCount + '个文件，共' + WebUploader.formatSize (fileSize) + '。';
    } else if (state === 'confirm') {
      stats = uploader.getStats ();
      if (stats.uploadFailNum) {
        text =
          '已成功上传' +
          stats.successNum +
          '个文件，' +
          stats.uploadFailNum +
          '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件。';
      }
    } else {
      stats = uploader.getStats ();
      text =
        '共' +
        fileCount +
        '个（' +
        WebUploader.formatSize (fileSize) +
        '），已上传' +
        stats.successNum +
        '个';

      if (stats.uploadFailNum) {
        text += '，失败' + stats.uploadFailNum + '个';
      }
    }

    $info.html (text);

    if (fileCount < config.uploadFileMaxNum) {
      $ ('#filePicker2').show ();
    } else {
      $ ('#filePicker2').hide ();
    }

    if (stats && stats.successNum > 0 && stats.successNum === fileCount) {
      $ ('#btnUpload').hide ();
    } else {
      $ ('#btnUpload').show ();
    }
  }

  function setState (val) {
    var file, stats;

    if (val === state) {
      return;
    }

    $upload.removeClass ('state-' + state);
    $upload.addClass ('state-' + val);
    state = val;

    switch (state) {
      case 'pedding':
        $placeHolder.removeClass ('element-invisible');
        $queue.hide ();
        $statusBar.addClass ('element-invisible');
        uploader.refresh ();
        break;

      case 'ready':
        $placeHolder.addClass ('element-invisible');
        $ ('#filePicker2').removeClass ('element-invisible');
        $queue.show ();
        $statusBar.removeClass ('element-invisible');
        uploader.refresh ();
        break;

      case 'uploading':
        $ ('#filePicker2').addClass ('element-invisible');
        $progress.show ();
        $upload.text ('上传中...');
        break;

      case 'paused':
        $progress.show ();
        $upload.text ('继续上传');
        break;

      case 'confirm':
        $progress.hide ();
        $ ('#filePicker2').removeClass ('element-invisible');
        $upload.text ('开始上传');

        stats = uploader.getStats ();
        if (stats.successNum && !stats.uploadFailNum) {
          setState ('finish');
          return;
        }
        break;

      case 'finish':
        stats = uploader.getStats ();
        if (stats.successNum) {
          //alert('上传成功');
        } else {
          // 没有成功的图片，重设
          state = 'done';
          location.reload ();
        }
        break;
    }

    updateStatus ();
  }

  uploader.onUploadProgress = function (file, percentage) {
    var $li = $ ('#' + file.id), $percent = $li.find ('.progress span');

    $percent.css ('width', percentage * 100 + '%');
    percentages[file.id][1] = percentage;
    updateTotalProgress ();
  };

  uploader.onFileQueued = function (file) {
    fileCount++;
    fileSize += file.size;

    if (fileCount === 1) {
      $placeHolder.addClass ('element-invisible');
      $statusBar.show ();
    }

    addFile (file);
    setState ('ready');
    updateTotalProgress ();
  };

  uploader.onFileDequeued = function (file) {
    fileCount--;
    fileSize -= file.size;

    if (!fileCount) {
      setState ('pedding');
    }

    removeFile (file);
    updateTotalProgress ();
  };

  uploader.on ('all', function (type) {
    var stats;
    switch (type) {
      case 'uploadFinished':
        setState ('confirm');
        break;

      case 'startUpload':
        setState ('uploading');
        break;

      case 'stopUpload':
        setState ('paused');
        break;
    }
  });

  uploader.onError = function (code) {
    switch (code) {
      case 'Q_EXCEED_NUM_LIMIT':
        alert ('超出上传文件数量限制！');
        break;
      case 'Q_TYPE_DENIED':
        alert ('不支持此类型文件上传！');
        break;
      case 'F_DUPLICATE':
        alert ('文件重复！');
        break;
      default:
        alert ('Error: ' + code);
        break;
    }
  };

  $upload.on ('click', function () {
    if ($ (this).hasClass ('disabled')) {
      return false;
    }

    if (state === 'ready') {
      uploader.upload ();
    } else if (state === 'paused') {
      uploader.upload ();
    } else if (state === 'uploading') {
      uploader.stop ();
    } else {
      uploader.retry ();
    }
  });

  $info.on ('click', '.retry', function () {
    uploader.retry ();
  });

  $upload.addClass ('state-' + state);
  updateTotalProgress ();
};
