<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-width="140px"
      @submit.native.prevent
    >
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.id">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="8">
            <el-form-item label="作者:" class="postInfo-container-item">
              <el-select
                v-model="postForm.author.user.username"
                :remote-method="getRemoteUserList"
                filterable
                default-first-option
                remote
                placeholder="搜索用户"
              >
                <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="回复文章:" style="margin-bottom: 20px;">
              <el-input v-model="postForm.article.title" style="width: 220px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="回复的主评论:" class="postInfo-container-item">
              <el-select
                v-model="postForm.author.user.username"
                :remote-method="getRemoteUserList"
                filterable
                default-first-option
                remote
                placeholder="搜索该文章的主评论"
              >
                <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="回复的子评论:" class="postInfo-container-item">
              <el-select
                v-model="postForm.author.user.username"
                :remote-method="getRemoteUserList"
                filterable
                default-first-option
                remote
                placeholder="搜索该文章的子评论"
              >
                <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="content" label="评论内容:" style="margin-bottom: 30px;">
              <UE id="ueditor" ref="ueditor" update_content="editor_article" @editor_article="editor_article" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchComment } from '@/api/comment'
import { searchUser } from '@/api/remote-search'
import UE from '@/views/article/components/UE'

const defaultForm = {
  id: '',
  author: {
    user: {
      username: ''
    }
  },
  article: '',
  content: '',
  parent_id: {
    id: '',
    author: '',
    article: '',
    content: ''
  }, // 回复给哪条子评论,若本身就是回复的主评论则为""
  reply_id: {
    id: '',
    author: '',
    article: '',
    content: ''
  }, // 回复给哪条主评论,若本身就是主评论则为""
  time: '',
  status: ''
}

export default {
  name: 'ArticleDetail',
  components: { UE, Sticky },
  // components: { Tinymce, MDinput, Sticky, Warning, CommentDropdown },
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
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      article_content_length: '', // 修改的文章内容的长度（纯文本)
      options: [],
      optionProps: {
        value: 'id',
        label: 'name',
        checkStrictly: 'true'
        // multiple:"true"
      },
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }],
        category: [
          {
            type: 'array',
            required: true,
            message: '请选择一个分类',
            trigger: 'blur'
          }
        ]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
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
    editor_article(editor_article, length) {
      this.postForm.content = editor_article
      this.article_content_length = length
      console.log('UE传来的值:', editor_article)
    },
    fetchData(id) {
      fetchComment(id).then(response => {
        this.postForm = response.data
        // just for test
        setTimeout(() => {
          this.$refs.ueditor.setDefault(this.postForm.content) // 给ue设置文章内容
        }, 100)
        // set tagsview title
        this.setTagsViewTitle()
        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑评论'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑评论'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布评论成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.go(-1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        console.log(response.data)
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
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
