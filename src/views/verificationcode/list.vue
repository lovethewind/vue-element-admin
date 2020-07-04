<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '" style="text-align: left;">
      <el-input v-model="search_content" placeholder="请输入验证账号" style="width: 200px;margin-right: 20px">搜索</el-input>
      <el-select v-model="search_type" style="width: 120px;margin-right: 20px" placeholder="验证类型">
        <el-option label="注册" value="register" />
        <el-option label="找回密码" value="find-password" />
        <el-option label="更换绑定" value="change-blind" />
      </el-select>
      <el-select v-model="search_method" style="width: 120px;margin-right: 20px" placeholder="验证方式">
        <el-option label="手机号" value="phone" />
        <el-option label="邮箱" value="email" />
      </el-select>
      <el-date-picker
        v-model="search_date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="left"
        style="margin-right: 20px"
      />
      <el-button type="success" icon="el-icon-search" style="margin-right: 10px">搜索</el-button>
      <el-button type="danger" icon="el-icon-delete">批量删除</el-button>
    </sticky>
    <el-divider />
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'time', order: 'descending'}" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="selection"
        width="40"
        style="text-align: center"
        fixed
        @selection-change="handleSelectionChange"
      />
      <el-table-column align="center" label="ID" prpo="id" sortable width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="验证码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="验证类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 'register'?'success': scope.row.type === 'find-password'?'warning':'info'">
            <span>{{ scope.row.type === 'register'?'注册': scope.row.type === 'find-password'?'找回密码':'更换绑定' }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="验证账号">
        <template slot-scope="scope">
          <span>{{ scope.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="验证方式">
        <template slot-scope="scope">
          <el-tag :type="scope.row.method==='phone'?'success':'info'">
            {{ scope.row.method === 'phone' ?'手机':'邮箱' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="160px" prop="time" sortable align="center" label="发送时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/轮播图/edit/'+scope.row.id" title="编辑">
            <el-button type="primary" size="small" icon="el-icon-edit" />
          </router-link>
          <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="openDeleteDialog(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>你确定要删除验证码 <span style="color: red">{{ delete_content.code }}</span> 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteContent(delete_content.id)">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件
import { getVerificationCodeList } from '@/api/verificationcode'

export default {
  name: 'VerificationCodeList',
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'publish': 'success',
        'draft': 'info',
        'delete': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      search_content: '',
      search_date: '',
      search_method: '',
      search_type: '',
      dialogVisible: false,
      delete_content: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      multipleSelection: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // console.log('用户传过来的id')
      getVerificationCodeList(this.listQuery).then(response => {
        console.log(response.data.items)
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openDeleteDialog(val) {
      this.dialogVisible = true
      this.delete_content = val
    },
    deleteContent(id) {
      this.$message.success('删除成功')
      this.dialogVisible = false
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.sub-navbar {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: center;
  padding-right: 20px;
  -webkit-transition: 600ms ease position;
  transition: 600ms ease position;
  background: -webkit-gradient(linear, left top, right top, from(#20b6f9), color-stop(0%, #20b6f9), color-stop(100%, #2178f1), to(#2178f1));
  background: linear-gradient(90deg, #20b6f9 0%, #20b6f9 0%, #2178f1 100%, #2178f1 100%);
  background: powderblue;
}
</style>
