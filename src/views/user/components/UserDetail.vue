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
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          提交
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          取消
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="16">
            <el-form-item label="用户名:" style="margin-bottom: 20px;">
              <el-input v-model="postForm.username" style="width: 220px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item style="margin-bottom: 20px;">
              <span style="color: red;font-size: 16px;font-weight: bold">{{ isEdit?'修改密码':'设置初始密码' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="postInfo-container">
            <el-row style="margin-bottom: 20px;">
              <el-col :span="8">
                <el-form-item label="网站管理员:" class="postInfo-container-item">
                  <el-radio v-model="postForm.is_staff" label="true">是</el-radio>
                  <el-radio v-model="postForm.is_staff" label="false">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="超级管理员:" class="postInfo-container-item">
                  <el-radio v-model="postForm.is_super" label="true">是</el-radio>
                  <el-radio v-model="postForm.is_super" label="false">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item v-if="isEdit" label="新密码:" style="margin-bottom: 20px;">
                  <el-input v-model="postForm.new_password" style="width: 220px" />
                </el-form-item>
                <el-form-item v-else label="初始密码:" style="margin-bottom: 20px;">
                  <el-input v-model="postForm.password" style="width: 220px" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 20px;">
              <el-col :span="16">
                <el-form-item label="用户状态:" class="postInfo-container-item">
                  <el-radio v-model="postForm.status" label="1">正常</el-radio>
                  <el-radio v-model="postForm.status" label="0">禁止登录</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item v-if="isEdit" label="确认新密码:" style="margin-bottom: 20px;">
                  <el-input v-model="postForm.rnew_password" style="width: 220px" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>

        <el-row style="margin-bottom: 20px;">
          <el-col :span="8">
            <el-form-item label="注册时间" class="postInfo-container-item">
              <el-date-picker
                v-model="postForm.join_date"
                type="datetime"
                align="left"
                style="margin-right: 20px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上次登录时间:" class="postInfo-container-item">
              <el-date-picker
                v-model="postForm.last_login"
                type="datetime"
                align="left"
                style="margin-right: 20px"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-bottom: 20px;">
          <el-col :span="8">
            <el-form-item label="邮箱:" class="postInfo-container-item">
              <el-input v-model="postForm.email" style="width: 220px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号:" class="postInfo-container-item">
              <el-input v-model="postForm.phone" style="width: 220px;" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/SingleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
// eslint-disable-next-line no-unused-vars
import { validURL } from '@/utils/validate'
import { fetchUser } from '@/api/user'
// eslint-disable-next-line no-unused-vars
import { searchUser } from '@/api/remote-search'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import UE from '@/views/article/components/UE'

const defaultForm = {
  id: '',
  username: '',
  password: '123456',
  is_staff: 'false',
  is_super: 'false',
  status: '1',
  join_date: '',
  last_login: '',
  email: '',
  phone: '',
  new_password: '',
  rnew_password: ''
}

export default {
  name: 'UserDetail',
  // eslint-disable-next-line vue/no-unused-components
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
      fetchUser(id).then(response => {
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
      const title = '编辑用户'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑用户'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '修改用户信息成功',
            type: 'success',
            duration: 2000
          })
          this.loading = false
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push('/user')
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
