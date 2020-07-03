<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '+ list[0].id" style="text-align: left;height: 100px;">
      <el-input v-model="search_content" placeholder="请输入用户名/邮箱/手机号" style="width: 200px;margin:0  10px">搜索</el-input>
      <el-select v-model="search_sex" style="width: 120px;margin-right: 20px" placeholder="状态">
        <el-option label="正常" value="1" />
        <el-option label="禁止登录" value="0" />
      </el-select>
      <el-select v-model="search_isstaff" style="width: 120px;margin-right: 20px" placeholder="网站管理员">
        <el-option label="是" value="true" />
        <el-option label="否" value="false" />
      </el-select>
      <el-select v-model="search_date_type" style="width: 120px;margin-right: 20px" placeholder="时间类型">
        <el-option label="登录时间" value="login" />
        <el-option label="注册时间" value="register" />
      </el-select>
      <el-date-picker
        v-model="search_date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="left"
        style="margin-right: 10px"
      />
      <el-button type="success" icon="el-icon-search" style="margin-right: 10px">搜索</el-button>
      <el-button type="info" icon="fa fa-minus-circle"> 批量禁用</el-button>
      <el-button type="danger" icon="el-icon-delete">批量删除</el-button>
    </sticky>
    <el-divider />
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'last_login', order: 'descending'}" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="selection"
        width="40"
        style="text-align: center"
        fixed
        @selection-change="handleSelectionChange"
      />
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户名" width="100px">
        <template slot-scope="{row}">
          <router-link :to="'/user/edit/'+row.id" class="link-type">
            <span>{{ row.username }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="网站管理员">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_staff==='true'?'success':'info'">
            {{ scope.row.is_staff === 'true' ?'是':'否' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="系统管理员">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_staff==='true'?'success':'info'">
            {{ scope.row.is_staff === 'true' ?'是':'否' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="160px" prop="last_login" sortable align="center" label="上次登录时间">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" prop="last_login" sortable align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.join_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" prop="is_staff" sortable label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.status==='1'?'success':'info'">
            {{ row.status==='1'?'正常':'禁止登录' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/user/edit/'+scope.row.id" title="编辑">
            <el-button type="primary" size="small" icon="el-icon-edit" />
          </router-link>
          <router-link :to="'/user/edit/'+scope.row.id" title="删除">
            <el-button type="danger" size="small" icon="el-icon-delete" />
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件
import { getUserList } from '@/api/user'

export default {
  name: 'UserList',
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
      search_sex: '',
      search_isstaff: '',
      search_date_type: '',
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
      getUserList(this.listQuery).then(response => {
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
