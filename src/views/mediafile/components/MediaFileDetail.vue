<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-width="100px"
      @submit.native.prevent
    >
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.code">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          提交
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row style="margin-bottom: 20px;">
          <el-col :span="16">
            <el-form-item label="作者:" style="margin-bottom: 20px;">
              <el-input v-model="postForm.author.user.username" style="width: 220px" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-bottom: 20px;">
          <el-col :span="8">
            <el-form-item label="标题:" class="postInfo-container-item">
              <el-input v-model="postForm.title" label="phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="链接:" class="postInfo-container-item">
              <el-input v-model="postForm.url" label="phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="类型:" class="postInfo-container-item">
              <el-select v-model="postForm.type">
                <el-option label="图片" value="image" />
                <el-option label="视频" value="video" />
                <el-option label="音频" value="audio" />
                <el-option label="文本" value="txt" />
                <el-option label="附件" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="文件大小:" class="postInfo-container-item">
              <el-input-number v-model="postForm.size" label="文件大小" /> *<span style="color: red">建议由系统自动判断生成</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="下载量:" class="postInfo-container-item">
              <el-input-number v-model="postForm.count" label="下载量" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-bottom: 20px;">
          <el-col :span="8">
            <el-form-item label="时间:" class="postInfo-container-item">
              <el-date-picker
                v-model="postForm.time"
                type="datetime"
                align="left"
                style="margin-right: 20px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchMediaFile } from '@/api/mediafile'
import UE from '@/views/article/components/UE'

const defaultForm = {
  id: '',
  author: {
    id: '',
    user: {
      id: '',
      username: ''
    }
  },
  title: '',
  url: '',
  type: '',
  count: '',
  size: '',
  time: ''
}

export default {
  name: 'MediaFileDetail',
  // eslint-disable-next-line vue/no-unused-components
  components: { UE, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        // this.$message({
        //   message: rule.field + '为必填项',
        //   type: 'error'
        // })
        callback(new Error(rule.field + '为必填项'))
      } else {
        callback()
      }
    }

    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchMediaFile(id).then(response => {
        console.log(response.data)
        this.postForm = response.data
        // set tagsview title
        this.setTagsViewTitle()
        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑文件'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑文件'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '修改文件信息成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push('/mediafile')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>
<style>
  .ql-editor {
    min-height: 200px;
  }
</style>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 140px;
      font-size: 12px;
      position: static;
      float: right;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
