<template>
  <div ref="editor" class="ue">
    <VEmojiPicker
      :id="'emoji_'+id"
      lang="pt-BR"
      :emojis-by-row="10"
      :show-search="false"
      style="width: 100%;display: none"
      @select="onSelectEmoji"
    />
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      @focus="onEditorFocus($event)"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
    >
      <!-- 自定义toolar -->
      <div :id="id" slot="toolbar" name="toolbar" style="line-height:100%;">
        <!-- Add a bold button -->
        <button class="ql-bold" title="加粗">Bold</button>
        <button class="ql-italic" title="斜体">Italic</button>
        <button class="ql-underline" title="下划线">underline</button>
        <button class="ql-strike" title="删除线">strike</button>
        <button v-if="id!=='comment_toolbar'" class="ql-blockquote" title="引用" />
        <button id="code-block" class="ql-code-block" title="代码块" />
        <select class="ql-color" value="color" title="字体颜色" />
        <select v-if="id!=='comment_toolbar'" class="ql-background" value="background" title="背景颜色" />
        <select v-if="id!=='comment_toolbar'" class="ql-align" value="align" title="对齐" />
        <select v-if="id!=='comment_toolbar'" class="ql-lineHeight" title="行间距">
          <option v-for="(lineHeight,index) in lineHeightList" :key="lineHeight" :value="lineHeight" :selected="index === 3">{{ lineHeight }}</option>
        </select>
        <button v-if="id!=='comment_toolbar'" class="ql-header" value="1" title="标题1" />
        <button v-if="id!=='comment_toolbar'" class="ql-header" value="2" title="标题2" />
        <!--Add list -->
        <button v-if="id!=='comment_toolbar'" class="ql-list" value="ordered" title="有序列表" />
        <button v-if="id!=='comment_toolbar'" class="ql-list" value="bullet" title="无序列表" />
        <button class="ql-script" value="super" title="上标" />
        <button class="ql-script" value="sub" title="下标" />
        <button v-if="id!=='comment_toolbar'" class="ql-indent" value="-1" title="左缩进" />
        <button v-if="id!=='comment_toolbar'" class="ql-indent" value="+1" title="右缩进" />
        <button v-if="id!=='comment_toolbar'" class="ql-direction" value="rtl" title="文本方向" />
        <!-- Add subscript and superscript buttons -->
        <button title="表情" @click="toogleDialogEmoji">
          <i class="fa fa-smile-o" />
        </button>
        <button class="ql-link" title="插入链接" />
        <!--图片按钮点击事件-->
        <el-popover
          v-model="isShowUploadImageModal"
          placement="top"
          width="200"
        >
          <div style="text-align:center;padding:10px;border-radius:5px;">
            <el-upload
              class="upload-demo"
              action
              accept="image/*"
              :show-file-list="false"
              :before-upload="beforeCrapperUpload"
              title="插入图片"
            >
              <el-button>插入裁剪图片</el-button>
            </el-upload>
            <hr>
            <el-upload
              class="upload-demo"
              action
              accept="image/*"
              :show-file-list="false"
              :before-upload="beforeUpload"
              title="插入图片"
            >
              <el-button>插入动态图片</el-button>
            </el-upload>
          </div>
          <button slot="reference" title="插入图片"><i class="fa fa-picture-o" /></button>
        </el-popover>
        <!---->
        <el-popover
          v-model="isShowUploadVideoModal"
          placement="top"
          width="200"
        >
          <div style="text-align:center;padding:10px;border-radius:5px;">
            <el-button @click="isShowInsertNetVideoModal=true">插入网络视频</el-button>
            <hr>
            <el-button @click="isShowVideo=true">上传本地视频</el-button>
          </div>
          <button v-if="id!=='comment_toolbar'" slot="reference" title="插入视频"><i class="fa fa-film" /></button>
        </el-popover>
        <button v-if="id!=='comment_toolbar'" class="ql-formula" title="插入函数" />
        <!-- Add font size dropdown -->
        <select v-if="id!=='comment_toolbar'" class="ql-header" title="段落格式">
          <option selected>段落</option>
          <option value="1">标题1</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
          <option value="4">标题4</option>
          <option value="5">标题5</option>
          <option value="6">标题6</option>
        </select>
        <select v-if="id!=='comment_toolbar'" class="ql-size" title="字体大小">
          <option value="8px">8px</option>
          <option value="10px">10px</option>
          <option value="12px" selected>12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="22px">22px</option>
          <option value="24px">24px</option>
          <option value="26px">26px</option>
        </select>
        <select v-if="id!=='comment_toolbar'" class="ql-font" title="字体">
          <option value="SimSun">宋体</option>
          <option value="SimHei">黑体</option>
          <option value="Microsoft-YaHei">微软雅黑</option>
          <option value="KaiTi">楷体</option>
          <option value="FangSong">仿宋</option>
          <option value="Arial">Arial</option>
          <option value="Times-New-Roman" />
          <option value="sans-serif" />
        </select>
        <button class="undo" title="上一步" @click="undo">
          <i class="el-icon-refresh-left" />
        </button>
        <button class="redo" title="下一步" @click="redo">
          <i class="el-icon-refresh-right" />
        </button>
        <button class="ql-clean" title="清除样式" />
        <!-- You can also add your own -->
      </div>
    </quill-editor>

    <!-- Add other -->
    <el-dialog title="插入网络视频" top="5vh" :visible.sync="isShowInsertNetVideoModal">
      <el-input v-model="netVideoUrl" />
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="insertNetVideo">确定</el-button>
        <el-button type="primary" @click="isShowInsertNetVideoModal = false">取消</el-button>
      </span>
    </el-dialog>

    <div v-if="wordCount" :style="wordCount" class="cfpa-quill-wordCount">
      <div class="cfpa-quill-wordCount-text">当前已经输入<span style="color: red">{{ contentLength }}</span>/10000个字符</div>
    </div>
    <el-dialog v-loading="upload_loading" title="上传视频" top="5vh" :visible.sync="isShowVideo">
      <el-upload
        ref="upload_video"
        class="upload-demo"
        drag
        action
        :limit="1"
        accept="video/*"
        :before-upload="getVideoInfo"
        :on-remove="deleteUploadVideo"
        :http-request="videoUpload"
        style="width:100%;padding:0 0 ;margin:0 auto;color:black"
      >
        <i class="el-icon-upload" />
        <div id="video_tip" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过50M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isUploadSuccess" type="success" @click="insertVideo">确定</el-button>
        <el-button type="primary" @click="isShowVideo = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传图片" top="5vh" :visible.sync="isShowCropper">
      <VueCropper
        ref="cropper"
        :img="option.img"
        :output-size="option.outputSize"
        :output-type="option.outputType"
        :info="option.info"
        :can-scale="option.canScale"
        :auto-crop="option.autoCrop"
        :auto-crop-width="option.autoCropWidth"
        :auto-crop-height="option.autoCropHeight"
        :fixed="option.fixed"
        :fixed-number="option.fixedNumber"
        :center-box="true"
        style="height:350px;margin:10px 0"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="onCubeImg">生成图片</el-button>
        <el-button type="primary" @click="isShowCropper = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Quill, quillEditor } from 'vue-quill-editor'
import VEmojiPicker from 'v-emoji-picker'
import imageResize from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module'
import Delta from 'quill-delta'

import { VueCropper } from 'vue-cropper'

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', imageResize)

// 自定义字体大小
const Size = Quill.import('attributors/style/size')
Size.whitelist = [
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px'
]
Quill.register(Size, true)
// 自定义字体类型
var fonts = [
  'SimSun',
  'SimHei',
  'Microsoft-YaHei',
  'KaiTi',
  'FangSong',
  'Arial',
  'Times-New-Roman',
  'sans-serif'
]
var Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)
// 增加行高功能
const Parchment = Quill.import('parchment')
const config = {
  scope: Parchment.Scope.INLINE,
  whitelist: ['0-5', '0-75', '1', '1-5', '1-75', '2', '2-5', '3']
}
// 实例化 lineHeight 类(自定义的)
class lineHeightAttributor extends Parchment.Attributor.Class {}
// eslint-disable-next-line new-cap
const lineHeightStyle = new lineHeightAttributor(
  'lineHeight',
  'ql-lineHeight',
  config
)
// 注册实例
Quill.register({ 'formats/lineHeight': lineHeightStyle }, true)

const Clipboard = Quill.import('modules/clipboard')

// 重写粘贴板
class CustomClipboard extends Clipboard {
  onPaste(e) {
    // get current page offset before paste
    const top = window.pageYOffset
    const left = window.pageXOffset

    if (e.defaultPrevented || !this.quill.isEnabled()) return
    const range = this.quill.getSelection()
    let delta = new Delta().retain(range.index)
    this.container.style.top =
      (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      ).toString() + 'px'
    this.container.focus()
    setTimeout(() => {
      this.quill.selection.update(Quill.sources.SILENT)
      delta = delta.concat(this.convert()).delete(range.length)
      this.quill.updateContents(delta, Quill.sources.USER)
      this.quill.setSelection(
        delta.length() - range.length,
        Quill.sources.SILENT
      )
      const bounds = this.quill.getBounds(
        delta.length() - range.length,
        Quill.sources.SILENT
      )
      this.quill.scrollingContainer.scrollTop = bounds.top

      // scroll window to previous position after paste
      window.scrollTo({ top, left })
    }, 1)
  }
}
// 注册新的粘贴板
Quill.register('modules/clipboard', CustomClipboard, true)

export default {
  name: 'UE',
  components: {
    quillEditor,
    VEmojiPicker,
    VueCropper
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    id: {
      type: String,
      default: null
    },
    updateContent: {
      type: String,
      default: ''
    }},
  data() {
    return {
      author_id: '',
      content: '',
      emoji: '',
      editorOption: {
        //  富文本编辑器配置
        modules: {
          syntax: true,
          formula: true,
          toolbar: '#' + this.id,
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          history: {
            delay: 1000,
            maxStack: 500,
            userOnly: false
          }
        },
        theme: 'snow',
        placeholder: 'Hi，写点什么吧～'
      }, // end ue
      lineHeightList: ['0-5', '0-75', '1', '1-5', '1-75', '2', '2-5', '3'],
      contentLength: 0,
      wordCount: '',
      isShowUploadVideoModal: false,
      isShowInsertNetVideoModal: false,
      isShowUploadImageModal: false,
      netVideoUrl: '',
      isShowCropper: false,
      isShowVideo: false,
      videoInfo: {
        videoFile: '',
        videoUrl: ''
      },
      isUploadSuccess: false,
      upload_loading: false,
      // 切图器数据
      option: {
        img: '', // 裁剪图片的地址
        file_name: '',
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [4, 4] // 截图框的宽高比例
      },
      code_info: '',
      scrollTop: '',
      video_tip: '' // 上传视频界面的提示
    }
  }, // end data
  mounted() {
    var author = JSON.parse(sessionStorage.getItem('author'))
    author ? (this.author_id = author.id) : console.log()
    this.wordCount = { 'top': '0px' }
    const vm = this
    window.addEventListener('scroll', function() {
      const scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      vm.scrollTop = scroll
    }, true)
  },
  methods: {
    toogleDialogEmoji() {
      var vm = this
      // eslint-disable-next-line no-undef
      layer.open({
        title: '添加表情',
        type: 1,
        offset: ['30%', '60%'],
        shade: [0.001, '#393D49'],
        shadeClose: true,
        content: $('#' + 'emoji_' + this.id), // 这里content是一个id绑定的元素
        end: function() {
          $('#' + 'emoji_' + vm.id).style.display = 'none'
        }
      })
    },
    onSelectEmoji(emoji) {
      const quill = this.$refs.myQuillEditor.quill
      // let quill = this.$refs[this.id].quill;
      console.log(quill)
      const length = quill.selection.savedRange.index
      quill.insertText(length, emoji.data)
      quill.setSelection(length + 2)
    },
    beforeCrapperUpload(file) {
      // var index = file.name.lastIndexOf(".");
      // var ext = file.name.substr(index + 1);
      // console.log("上传的图片格式:",ext)
      const vm = this
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传的图片大小不能超过10M')
        return false
      }
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = function() {
        vm.option.autoCropWidth = img.width
        vm.option.autoCropHeight = img.height
      }
      this.option.file_name = file.name
      this.option.img = URL.createObjectURL(file)
      this.isShowCropper = true
      return false
    },
    // 上传不裁剪图片，可传动图
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传的图片大小不能超过10M')
        return false
      }
      const fileName = file.name.split('.')[0] + '_' + new Date().getTime() + '.' + file.name.split('.')[1]
      var fd = new FormData()
      fd.append('url', file, fileName)
      fd.append('size', file.size)
      fd.append('title', file.name.split('.')[0])
      fd.append('type', 'image')
      fd.append('author_id', this.author_id)
      this.$api.user.fileUpload(fd).then(res => {
        this.upload_loading = true
        // 如果上传成功
        if (res.data.code === 1) {
          // 获取富文本组件实例
          this.$message.success('图片上传成功')
          const quill = this.$refs.myQuillEditor.quill
          // loading动画消失
          this.upload_loading = false
          // 获取光标所在位置
          const length = quill.selection.savedRange.index
          // 插入图片  res.data.fileUrl为服务器返回的图片地址
          console.log(res.data.data.fileName)
          quill.insertEmbed(length, 'image', res.data.data.url)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
      })

      return false
    },
    // 确定裁剪图片
    onCubeImg() {
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        this.isShowCropper = false
        // 先将显示图片地址清空，防止重复显示
        this.option.img = ''
        // 将剪裁后base64的图片转化为file格式
        const fileName = this.option.file_name.split('.')[0] + '_' + new Date().getTime() + '.' + this.option.file_name.split('.')[1]
        const file = this.convertBase64UrlToBlob(data)
        // 将剪裁后的图片执行上传
        var fd = new FormData()
        fd.append('url', file, fileName)
        fd.append('size', file.size)
        fd.append('title', this.option.file_name.split('.')[0])
        fd.append('type', 'image')
        fd.append('author_id', this.author_id)
        this.$message.success('图片正在上传')
        this.upload_loading = true
        this.$api.user.fileUpload(fd).then(res => {
          // 如果上传成功
          if (res.data.code === 1) {
            // 获取富文本组件实例
            this.$message.success('图片上传成功')
            const quill = this.$refs.myQuillEditor.quill
            // loading动画消失
            this.upload_loading = false
            // 获取光标所在位置
            const length = quill.selection.savedRange.index
            // 插入图片  res.data.fileUrl为服务器返回的图片地址
            console.log(res.data.data.fileName)
            quill.insertEmbed(length, 'image', res.data.data.url)
            // 调整光标到最后
            quill.setSelection(length + 1)
          } else {
            this.$message.error('图片插入失败')
          }
        })
      })
    },
    // 将base64的图片转换为file文件
    convertBase64UrlToBlob(urlData, fileName) {
      const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      const ab = new ArrayBuffer(bytes.length)
      const ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/png' })
    },
    // 得到选择的视频信息
    getVideoInfo(file) {
      console.log(file.name)
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.warning('上传的视频大小不能超过50M')
        return false
      }
      this.videoInfo.videoFile = file
    },
    // 上传视频
    videoUpload() {
      this.$message.success('正在上传视频,请稍后...')
      var file = this.videoInfo.videoFile
      this.upload_loading = true
      var fd = new FormData()
      const fileName = file.name.split('.')[0] + '_' + new Date().getTime() + '.' + file.name.split('.')[1]

      fd.append('url', file, fileName)
      fd.append('size', file.size)
      fd.append('title', file.name.split('.')[0])
      fd.append('type', 'video')
      fd.append('author_id', this.author_id)
      this.$api.user.fileUpload(fd)
        .then(res => {
          // 如果上传成功
          console.log(res.data)
          if (res.data.code === 1) {
            this.video_tip = "点击<span style='color: green'>确定</span>，即可插入视频，若要重新选择，请先<span style='color: red'>删除</span>列表中的视频"
            // loading动画消失
            this.upload_loading = false
            this.$message.success('视频上传成功')
            this.isUploadSuccess = true
            this.videoInfo.videoUrl = res.data.data.url
          } else {
            this.$message.error('视频插入失败')
          }
        })
        .catch(err => {
          this.$message.error('服务器出错，请稍后再试～', err)
        })
    },
    // 删除视频
    deleteUploadVideo() {
      this.videoInfo.videoUrl = ''
      this.videoInfo.videoFile = ''
      this.isUploadSuccess = false
      this.video_tip = '将文件拖到此处，或<em>点击上传</em>'
    },
    // //插入网络链接视频
    insertNetVideo() {
      if (this.netVideoUrl.trim()) {
        const quill = this.$refs.myQuillEditor.quill
        // 获取光标所在位置
        const length = quill.selection.savedRange.index
        // 插入视频,this.videoUrl为服务器返回的视频地址
        quill.insertEmbed(length, 'video', this.netVideoUrl)
        // 调整光标到最后
        quill.setSelection(length + 1)
        this.isShowInsertNetVideoModal = false
      } else {
        this.$message.info('请输入网络视频链接')
      }
    },
    // 插入上传的视频
    insertVideo() {
      const quill = this.$refs.myQuillEditor.quill
      // 获取光标所在位置
      const length = quill.selection.savedRange.index
      // 插入视频,this.videoUrl为服务器返回的视频地址
      quill.insertEmbed(length, 'video', this.videoInfo.videoUrl)
      // 调整光标到最后
      quill.setSelection(length + 1)
      this.isShowVideo = false
      this.$refs.upload_video.clearFiles()
      this.video_tip = '将文件拖到此处，或<em>点击上传</em>'
      this.isUploadSuccess = false
    },
    handleChange(value) {
      console.log(this.$refs['cascader'].getCheckedNodes()[0].value)
    },
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {
    }, // 失去焦点事件
    onEditorFocus() {
      $(window).scrollTop(this.scrollTop)
    }, // 获得焦点事件
    onEditorChange(e) {
      if (e.text.trim().length > 10000) {
        this.$message.warning('内容已达到字数上限')
        this.content = e.text.trim().slice(0, 10000)
        this.contentLength = 10000
      } else {
        this.contentLength = e.text.trim().length
      }
      // eslint-disable-next-line no-undef
      this.$emit('editor_article', this.content, this.contentLength)
    }, // 内容改变事件
    saveHtml: function(event) {
      alert(this.content)
    },
    // 撤销操作
    undo() {
      this.$refs.myQuillEditor.quill.history.undo()
    },
    redo() {
      this.$refs.myQuillEditor.quill.history.redo()
    },
    imgClick() {},
    // 清空文本方法，供父组件调用
    clear() {
      this.content = ''
      // this.$refs.myQuillEditor.quill.setContents("");
    },
    // 将父组件的值传给ue
    setDefault(value) {
      this.content = value
    },
    onFocusUE(value) {
      this.$refs.myQuillEditor.quill.focus()
      if (value) {
        this.$refs.myQuillEditor.quill.container.childNodes[0].setAttribute('data-placeholder', value)
      }
    }
  } // end methods
} // end vue

// 让toolbar悬浮
$(window).scroll(function() {
  var tool_bar = $('.quill-editor')
  if (tool_bar.offset()) {
    console.log()
  } else {
    return false
  }
  for (var i = 0; i < tool_bar.length; i++) {
    var offsetTop = $(tool_bar[i]).offset().top
    // eslint-disable-next-line no-unused-vars
    var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    var wh = $(window).height()
    if (($(tool_bar[i].children[0]).innerHeight() + 20) < (offsetTop - scrollTop) < wh) { // 当toolbar进入窗口时
      if (scrollTop > offsetTop && scrollTop <= ($(tool_bar[i]).innerHeight() + offsetTop) - ($(tool_bar[i].children[0]).innerHeight() + 20)) {
        tool_bar[i].children[0].classList.add('toolbar_fixed')
        $(tool_bar[i].children[0]).css('width', $(tool_bar[i]).innerWidth())
        $(tool_bar[i].children[0]).css('left', $(tool_bar[i]).offset().left)
      } else {
        tool_bar[i].children[0].classList.remove('toolbar_fixed')
      }
    } else {
      tool_bar[i].children[0].classList.remove('toolbar_fixed')
    }
  }
})
</script>

<style lang="scss">
  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "超链接:";
  }
  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    content: '保存';
  }
  .ql-snow .ql-tooltip a {
    line-height: 40px;
}
  .ql-snow .ql-tooltip {
    margin-left: 125px;
  }
  .ql-snow .ql-tooltip[data-mode=formula]::before {
    content: "输入公式";
}
.ql-snow .ql-tooltip::before {
    content: "查看URL:";
}
.ql-snow .ql-tooltip a.ql-action::after {
    content: '编辑';
}
.ql-snow .ql-tooltip a.ql-remove::before {
    content: '移除';
}
  // 该类名对应的行高
  .ql-lineHeight {
    width: 80px;
    line-height: 100%;
  }
  .ql-lineHeight::before {
    content: "";
    display: inline-block;
    line-height: 22px;
  }
  .ql-lineHeight .ql-picker-label {
    position: absolute;
  }
  .ql-lineHeight .ql-picker-options {

  }

  .ql-lineHeight-0-5 {
    line-height: 0.5;
  }

  .ql-lineHeight-0-75 {
    line-height: 0.75;
  }
  .ql-lineHeight-1 {
    line-height: 1;
  }

  .ql-lineHeight-1-5 {
    line-height: 1.5;
  }
  .ql-lineHeight-1-75 {
    line-height: 1.75;
  }

  .ql-lineHeight-2 {
    line-height: 2;
  }
  .ql-lineHeight-2-5 {
    line-height: 2.5;
  }
  .ql-lineHeight-3 {
    line-height: 3;
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="0-5"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="0-5"]::before {
    content: "0.5";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="0-75"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="0-75"]::before {
    content: "0.75";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="1"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="1"]::before {
    content: "1";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="1-5"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="1-5"]::before {
    content: "1.5";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="1-75"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="1-75"]::before {
    content: "1.75";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="2"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="2"]::before {
    content: "2";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="2-5"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="2-5"]::before {
    content: "2.5";
  }
  .ql-picker.ql-lineHeight .ql-picker-label[data-value="3"]::before,
  .ql-picker.ql-lineHeight .ql-picker-item[data-value="3"]::before {
    content: "3";
  }

  .cfpa-quill-wordCount {
  background-color: #ffffff;
  position: relative;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  line-height: 20px;
  font-size: 12px;
  z-index: -999;
  .cfpa-quill-wordCount-text{
    text-align: right;
    margin-right: 10px;
    color: #aaa;
  }
}
.el-dialog__body {
  padding: 0px 20px;
}
.el-upload.el-upload--text {
  width: 100%;
}
.el-upload-dragger{
  width: 100%;
  height: 230px;
}
  #EmojiPicker {
    display: inline-flex;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeSpeed;
    flex-direction: column;
    align-items: center;
    background: #f0f0f0;
    border-radius: 4px;
    border: 1px solid #e4e4e4;
    overflow: hidden;
    width: 600px;
    user-select: none;
    @media screen and (max-width: 325px) {
      width: 100%;
    }
  }
  .ql-editor.ql-blank::before {
    color: rgba(0,0,0,0.6);
    content: attr(data-placeholder);
    font-style: normal;
    overflow: auto;
    line-height: 1.5;
    outline: 0;
    width: 100%;
    height: 50px;
    font-size: inherit;
    color: darkgray;
  }

  .toolbar_fixed {
    position: fixed;
    background: white;
    top: 0;
    z-index: 999;
  }
  iframe{
    width: 480px;
    height: 270px;
  }

</style>
