<template>
  <view class="wrapper">
    <view class="toolbar" @tap="format">
      <view
        :class="formats.bold ? 'ql-active' : ''"
        class="iconfont icon-zitijiacu"
        data-name="bold"
      ></view>
      <view
        :class="formats.italic ? 'ql-active' : ''"
        class="iconfont icon-zitixieti"
        data-name="italic"
      ></view>
      <view
        :class="formats.underline ? 'ql-active' : ''"
        class="iconfont icon-zitixiahuaxian"
        data-name="underline"
      ></view>
      <view
        :class="formats.strike ? 'ql-active' : ''"
        class="iconfont icon-zitishanchuxian"
        data-name="strike"
      ></view>
      <view
        :class="formats.align === 'left' ? 'ql-active' : ''"
        class="iconfont icon-zuoduiqi"
        data-name="align"
        data-value="left"
      ></view>
      <view
        :class="formats.align === 'center' ? 'ql-active' : ''"
        class="iconfont icon-juzhongduiqi"
        data-name="align"
        data-value="center"
      ></view>
      <view
        :class="formats.align === 'right' ? 'ql-active' : ''"
        class="iconfont icon-youduiqi"
        data-name="align"
        data-value="right"
      ></view>
      <view
        :class="formats.align === 'justify' ? 'ql-active' : ''"
        class="iconfont icon-zuoyouduiqi"
        data-name="align"
        data-value="justify"
      ></view>
      <view
        :class="formats.lineHeight ? 'ql-active' : ''"
        class="iconfont icon-line-height"
        data-name="lineHeight"
        data-value="2"
      ></view>
      <view
        :class="formats.letterSpacing ? 'ql-active' : ''"
        class="iconfont icon-Character-Spacing"
        data-name="letterSpacing"
        data-value="2em"
      ></view>
      <view
        :class="formats.marginTop ? 'ql-active' : ''"
        class="iconfont icon-722bianjiqi_duanqianju"
        data-name="marginTop"
        data-value="20px"
      ></view>
      <view
        :class="formats.previewarginBottom ? 'ql-active' : ''"
        class="iconfont icon-723bianjiqi_duanhouju"
        data-name="marginBottom"
        data-value="20px"
      ></view>
      <view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
      <view
        :class="formats.fontFamily ? 'ql-active' : ''"
        class="iconfont icon-font"
        data-name="fontFamily"
        data-value="Pacifico"
      ></view>
      <view
        :class="formats.fontSize === '24px' ? 'ql-active' : ''"
        class="iconfont icon-fontsize"
        data-name="fontSize"
        data-value="24px"
      ></view>

      <view
        :class="formats.color === '#0000ff' ? 'ql-active' : ''"
        class="iconfont icon-text_color"
        data-name="color"
        data-value="#0000ff"
      ></view>
      <view
        :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''"
        class="iconfont icon-fontbgcolor"
        data-name="backgroundColor"
        data-value="#00ff00"
      ></view>

      <view class="iconfont icon-date" @tap="insertDate"></view>
      <view
        class="iconfont icon--checklist"
        data-name="list"
        data-value="check"
      ></view>
      <view
        :class="formats.list === 'ordered' ? 'ql-active' : ''"
        class="iconfont icon-youxupailie"
        data-name="list"
        data-value="ordered"
      ></view>
      <view
        :class="formats.list === 'bullet' ? 'ql-active' : ''"
        class="iconfont icon-wuxupailie"
        data-name="list"
        data-value="bullet"
      ></view>
      <view class="iconfont icon-undo" @tap="undo"></view>
      <view class="iconfont icon-redo" @tap="redo"></view>

      <view
        class="iconfont icon-outdent"
        data-name="indent"
        data-value="-1"
      ></view>
      <view
        class="iconfont icon-indent"
        data-name="indent"
        data-value="+1"
      ></view>
      <view class="iconfont icon-fengexian" @tap="insertDivider"></view>
      <view class="iconfont icon-charutupian" @tap="insertImage"></view>
      <view
        :class="formats.header === 1 ? 'ql-active' : ''"
        class="iconfont icon-format-header-1"
        data-name="header"
        :data-value="1"
      ></view>
      <view
        :class="formats.script === 'sub' ? 'ql-active' : ''"
        class="iconfont icon-zitixiabiao"
        data-name="script"
        data-value="sub"
      ></view>
      <view
        :class="formats.script === 'super' ? 'ql-active' : ''"
        class="iconfont icon-zitishangbiao"
        data-name="script"
        data-value="super"
      ></view>
      <view class="iconfont icon-shanchu" @tap="clear"></view>
      <view
        :class="formats.direction === 'rtl' ? 'ql-active' : ''"
        class="iconfont icon-direction-rtl"
        data-name="direction"
        data-value="rtl"
      ></view>
    </view>

    <view class="editor-wrapper">
      <editor
        :id="ids"
        class="ql-container"
        placeholder="开始输入......"
        showImgSize
        showImgToolbar
        showImgResize
        @statuschange="onStatusChange"
        :read-only="readOnly"
        @ready="onEditorReady"
        @blur="getContant"
        @input="onInput"
      ></editor>
      <view class="hide">
        <textarea type="text" :value="contents"></textarea>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'webEdit',
  props: {
    modelValue: String,
    value: String,
    // placeholder: {
    //   default: '',
    // },
    ids: {
      type: String,
      default: 'editor',
    },
    name: String,
  },
  data() {
    return {
      formats: {},
      //   placeholder: this.placeholder,
      readOnly: false,
      contents: '',
      editorCtx: '',
      hasChange: false,
    }
  },
  watch: {
    modelValue(val) {
      if (!this.hasChange) {
        this.$nextTick(() => {
        //   this.editorCtx.setContents({
        //     html: val,
        //   })
        })
      }
    },
  },
  methods: {
    /**
     * 输入时触发
     * @param {Object} event
     */
    onInput(event) {
      let value = event.detail.html
    },
    getContant(e) {
      let value = e.detail.html
      this.contents = value
      // TODO 兼容 vue2
      this.$emit('input', value)
      // TODO　兼容　vue3
      this.$emit('update:modelValue', value)
    },
    readOnlyChange() {
      this.readOnly = !this.readOnly
    },
    onEditorReady() {
      var ids = '#' + this.ids
      uni
        .createSelectorQuery()
        .select(ids)
        .context((res) => {
          this.editorCtx = res.context
          // this.editorCtx.setContents({
          //   html: this.modelValue
          // })
        })
        .exec()
    },
    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    format(e) {
      let { name, value } = e.target.dataset
      if (!name) return
      this.editorCtx.format(name, value)
    },
    onStatusChange(e) {
      const formats = e.detail
      this.formats = formats
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        },
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log('clear success')
        },
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate,
      })
    },
    insertImage() {
      function cropImg(file) {
        return new Promise((resolve, reject) => {
          let ext
          let filePathProcessed = file.path // 处理结果
          // #ifdef H5
          ext = file.name.split('.').pop()
          resolve({
            path: filePathProcessed,
            ext,
            fileType: file.fileType,
          })
          // #endif
          // #ifndef H5
          uni.getImageInfo({
            src: file.path,
            success(info) {
              ext = info.type.toLowerCase()
              resolve({
                path: filePathProcessed,
                ext,
                fileType: file.fileType,
              })
            },
            fail(err) {
              reject(new Error(err.errMsg || '未能获取图片类型'))
            },
          })
          // #endif
        })
      }
      // 开始上传
      uniCloud
        .chooseAndUploadFile({
          type: 'image',
          count: 1,
          onChooseFile(res) {
            const processAll = []
            for (let i = 0; i < res.tempFiles.length; i++) {
              processAll.push(cropImg(res.tempFiles[i]))
            }
            return Promise.all(processAll).then((fileList) => {
              let result = {
                tempFilePaths: [],
              }
              result.tempFiles = fileList.map((fileItem, index) => {
                result.tempFilePaths.push(fileItem.path)
                return {
                  path: fileItem.path,
                  cloudPath: '' + Date.now() + index + '.' + fileItem.ext, // 云端路径，这里随便生成了一个
                  fileType: fileItem.fileType,
                }
              })
              return result
            })
          },
        })
        .then((res) => {
          console.log('上传的图片', res)
          this.editorCtx.insertImage({
            src: res.tempFiles[0].url,
            alt: '图像',
            success: function () {
              console.log('insert image success')
            },
          })
        })
    },
  },
}
</script>

<style>
@import './editor-icon.css';
.page-body {
  height: calc(100vh - var(--window-top) - var(--status-bar-height));
}
.hide {
  display: none;
}

.wrapper {
  height: 100%;
}

.editor-wrapper {
  /* height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px); */
  background: #fff;
}

.iconfont {
  display: inline-block;
  padding: 8px 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 20px;
}

.toolbar {
  box-sizing: border-box;
  border-bottom: 0;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

.ql-container {
  box-sizing: border-box;
  padding: 12px 15px;
  width: 100%;
  height: 300px !important;
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.5;
  border: 1px solid #ccc;
}

.ql-active {
  color: #06c;
}
.uni-app--showleftwindow .uni-container .uni-forms {
  max-width: 100%;
}
</style>
