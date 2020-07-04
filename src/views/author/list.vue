<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <el-input v-model="listQuery.search_content" placeholder="请输入用户名/邮箱/手机号" style="width: 200px;margin-right: 20px">搜索</el-input>
      <el-select v-model="listQuery.search_sex" style="width: 80px;margin-right: 20px" placeholder="性别">
        <el-option label="性别" value="" />
        <el-option label="男" value="male" />
        <el-option label="女" value="famale" />
        <el-option label="保密" value="security" />
      </el-select>
      <el-input v-model="listQuery.search_agestart" type="number" placeholder="年龄" label="开始年龄" style="width: 70px;font-size: 8px" /> ~ <el-input v-model="listQuery.search_ageend" placeholder="年龄" type="number" label="结束年龄" style="width: 70px;font-size: 8px;margin-right: 10px" />
      <el-date-picker
        v-model="listQuery.search_date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="left"
        style="margin-right: 20px"
      />
      <el-button type="success" icon="el-icon-search" style="margin-right: 10px" @click="getList">搜索</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="openListDialog('delete')">批量删除</el-button>
    </sticky>
    <el-divider />
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" :default-sort="{prop: 'user.last_login', order: 'descending'}" border fit highlight-current-row style="width: 100%">
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
            <span>{{ row.user.username }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.headimg" style="width: 40px;height: 40px;cursor: pointer;border-radius: 5px" alt="">
        </template>
      </el-table-column>

      <el-table-column width="60px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex === 'male'?'男':scope.row.sex === 'female'?'女':'保密' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" prop="age" sortable label="年龄">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" sortable label="地址">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="140px" label="头衔">
        <template slot-scope="scope">
          <span>{{ scope.row.touxian }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="签名">
        <template slot-scope="scope">
          <span>{{ scope.row.sign.substring(0,10) }}...</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="160px" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.user.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.user.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" prop="user.last_login" sortable align="center" label="上次登录时间">
        <template slot-scope="scope">
          <span>{{ scope.row.user.last_login | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/author/edit/'+scope.row.id" title="编辑">
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
      <span>你确定要删除作者 <span v-if="delete_content" style="color: red">{{ delete_content.user.username }}</span> 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteContent(delete_content.id)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogListVisible"
      width="30%"
    >
      <span>你确定要{{ operateListContent.name }}共<span style="color:red;">{{ operateListContent.length }}</span>个作者的信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogListVisible = false">取 消</el-button>
        <el-button type="primary" @click="operateList">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件
import { getAuthorList, deleteAuthor, updateAuthor } from '@/api/author'
export default {
  name: 'AuthorList',
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
        limit: 10,
        search_content: '',
        search_date: '',
        search_sex: '',
        search_agestart: '',
        search_ageend: ''
      },
      dialogVisible: false,
      delete_content: '',
      dialogListVisible: false,
      operateListContent: {
        name: '',
        length: '',
        type: ''
      },
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
      getAuthorList(this.listQuery).then(response => {
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
    },
    openListDialog(val) {
      const selectData = this.$refs.multipleTable.selection
      if (selectData.length <= 0) {
        this.$message.info('请选中至少一条数据')
      } else {
        this.operateListContent.length = selectData.length
        if (val === 'forbid') {
          this.operateListContent.name = '（取消）禁用'
          this.operateListContent.type = 'forbid'
        } else {
          this.operateListContent.name = '删除'
          this.operateListContent.type = 'delete'
        }
        this.dialogListVisible = true
      }
    },
    operateList() {
      const selectData = this.$refs.multipleTable.selection
      for (let i = 0; i < selectData.length; i++) {
        if (this.operateListContent.type === 'forbid') {
          selectData[i].status = !selectData[i].status
          updateAuthor(selectData[i]).then(response => {
            if (response.code === 0) {
              this.$message.error('（取消）禁用作者' + selectData[i].user.username + '失败')
            }
          })
        } else {
          selectData[i].status === 'delete' ? console.log() : selectData[i].recommend = 'delete'
          deleteAuthor(selectData[i].id).then(response => {
            if (response.code === 0) {
              this.$message.error('删除' + selectData[i].user.username + '失败')
            }
          })
        }
      }
      this.$message.success('操作成功')
      this.dialogListVisible = false
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
  /deep/  input::-webkit-outer-spin-button,
   /deep/  input::-webkit-inner-spin-button{
    -webkit-appearance: none;
    margin: 0;
  }
  /deep/  input[type='number']{
    -moz-appearance: textfield;
  }
</style>
