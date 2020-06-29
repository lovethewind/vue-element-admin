<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-width="80px"
      @submit.native.prevent
    >
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          确认修改
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="头像:" style="margin-bottom: 40px;" prop="title">
              <el-image :src="postForm.headimg" style="width: 60px;height: 60px;cursor: pointer;border-radius: 5px" />
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="用户名:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.user.username"
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

                <el-col :span="8">
                  <el-form-item label="性别:" class="postInfo-container-item">
                    <el-radio v-model="postForm.sex" label="false">男</el-radio>
                    <el-radio v-model="postForm.sex" label="true">女</el-radio>
                    <el-radio v-model="postForm.sex" label="security">保密</el-radio>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="年龄:" class="postInfo-container-item">
                    <el-input-number v-model="postForm.age" :min="0" :max="140" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="头衔" class="postInfo-container-item">
              <el-input
                v-model="postForm.touxian"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址:" class="postInfo-container-item">
              <el-input
                v-model="postForm.address"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱:">
              <!--          <CommentDropdown v-model="postForm.comment_disabled" />-->
              <el-input v-model="postForm.user.email" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="content" label="签名:" style="margin-bottom: 30px;">
          <UE id="ueditor" ref="ueditor" update_content="editor_article" @editor_article="editor_article" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/SingleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchAuthor } from '@/api/author'
import { searchUser } from '@/api/remote-search'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import UE from '@/views/article/components/UE'

const defaultForm = {
  id: '',
  sex: '',
  age: '',
  sign: '',
  headimg: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  address: '',
  touxian: '',
  user: {
    id: '',
    username: '',
    status: '',
    join_date: '',
    last_login: '',
    email: '',
    phone: ''
  }
}

export default {
  name: 'AuthorDetail',
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
      options: [
        {
          id: 1,
          name: '根目录'
        },
        {
          id: 2,
          name: '我要学习',
          children: [
            {
              id: 21,
              name: '前端开发'
            },
            {
              id: 22,
              name: '后端开发'
            }
          ]
        },
        {
          id: 3,
          name: '心情杂谈',
          children: [
            {
              id: 31,
              name: '故事分享'
            },
            {
              id: 32,
              name: '讨论咨询'
            }
          ]
        },
        {
          id: 4,
          name: '资源分享',
          children: [
            {
              id: 41,
              name: '音乐'
            },
            {
              id: 42,
              name: '视频'
            },
            {
              id: 43,
              name: '其他'
            }
          ]
        },
        {
          id: 5,
          name: '通知公告',
          disabled: true
        }
      ],
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
      fetchAuthor(id).then(response => {
        this.postForm = response.data
        // just for test
        setTimeout(() => {
          this.$refs.ueditor.setDefault(this.postForm.sign) // 给ue设置文章内容
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
      const title = '编辑作者'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑作者'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '修改作者信息成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
          this.$router.push('/author')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = '草稿'
      this.$router.push('/article')
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
