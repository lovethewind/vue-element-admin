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
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          草稿
        </el-button>
        <el-button v-loading="loading" type="info" @click="cancelForm">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题:" style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name">
                这里填写标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
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

                <el-col :span="8">
                  <el-form-item label="发布时间:" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.time"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期和时间"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="分类:" prop="category" class="postInfo-container-item">
                    <el-cascader
                      ref="cascader"
                      v-model="postForm.category.id"
                      :options="options"
                      expand-trigger="hover"
                      :props="optionProps"
                      :show-all-levels="false"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="推荐:" class="postInfo-container-item">
              <el-switch
                v-model="postForm.recommend"
                active-text="推荐"
                inactive-text="不推荐"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="置顶:" class="postInfo-container-item">
              <el-switch
                v-model="postForm.top"
                active-text="置顶"
                inactive-text="不置顶"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评论:">
              <el-radio v-model="postForm.comment_disabled" :label="false">允许评论</el-radio>
              <el-radio v-model="postForm.comment_disabled" :label="true">禁止评论</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="content" label="正文:" style="margin-bottom: 30px;">
          <UE id="ueditor" ref="ueditor" update_content="editor_article" @editor_article="editor_article" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle, updateArticle, createArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import UE from '@/views/article/components/UE'

const defaultForm = {
  status: '草稿',
  title: '', // 文章题目
  author: {
    user: {
      username: ''
    }
  },
  content: '', // 文章内容
  time: undefined, // 前台展示时间
  id: undefined,
  comment_disabled: 'false',
  category: '',
  recommend: false,
  top: false
}

export default {
  name: 'ArticleDetail',
  components: { UE, MDinput, Sticky },
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
        callback(new Error(rule.field + '为必填项'))
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
        checkStrictly: 'true',
        multiple: 'true'
      },
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
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
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.time))
      },
      set(val) {
        this.postForm.time = new Date(val)
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
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // just for test
        setTimeout(() => {
          this.$refs.ueditor.setDefault(this.postForm.content) // 给ue设置文章内容
        }, 100)
        this.postForm.title += `   我是标题:${this.postForm.id}`
        this.postForm.content_short += `   我是简介:${this.postForm.id}`
        // set tagsview title
        this.setTagsViewTitle()
        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑文章'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateArticle(this.postForm).then(response => {
              if (response.code === 1) {
                this.$notify({
                  title: '成功',
                  message: '修改文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push('/article')
              } else {
                this.$message.error('修改文章失败，请重新尝试')
              }
            })
          } else {
            createArticle(this.postForm).then(response => {
              if (response.code === 1) {
                this.$notify({
                  title: '成功',
                  message: '添加文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push('/article')
              } else {
                this.$message.error('添加文章失败，请重新尝试')
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      this.postForm.status = 'draft'
      this.submitForm()
    },
    cancelForm() {
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
  .sub-navbar {
  text-align: right;
  padding-right: 20px;
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
