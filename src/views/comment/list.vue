<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <el-input v-model="search_content" placeholder="请输入文章标题/作者/评论内容搜索" style="width: 250px;margin-right: 20px">搜索</el-input>
      <el-date-picker
        v-model="search_date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        style="margin-right: 20px"
      />
      <el-select v-model="search_recommend" style="width: 120px;margin-right: 20px" placeholder="是否推荐">
        <el-option label="已推荐" value="1" />
        <el-option label="未推荐" value="0" />
      </el-select>
      <el-button type="success" icon="el-icon-search" style="margin-right: 30px">搜索</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 30px">批量删除</el-button>
    </sticky>
    <el-divider />
    <el-table v-loading="listLoading" :data="list" :default-sort="{prop: 'time', order: 'descending'}" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="selection"
        width="40"
        fixed
        style="text-align: center"
        @selection-change="handleSelectionChange"
      />
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author.user.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" height="100px" label="内容">
        <template slot-scope="scope">
          <span v-html="scope.row.content" />
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="文章">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.article.id" class="link-type">
            <span>{{ scope.row.article.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="200px" height="100px" label="回复主评论">
        <template slot-scope="scope">
          <span v-html="scope.row.parent_id.content" />
        </template>
      </el-table-column>

      <el-table-column width="200px" height="100px" label="回复子评论">
        <template slot-scope="scope">
          <span v-html="scope.row.reply_id.content" />
        </template>
      </el-table-column>

      <el-table-column width="180px" prop="time" sortable align="center" label="回复时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" prop="status" sortable width="90">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === 'checked'?'已审核':row.status === '-'?'需审核':'已删除' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/comment/edit/'+scope.row.id" title="编辑">
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
      <span>你确定要删除评论 <span style="color: red" v-html="delete_content.content" /> 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteContent(delete_content.id)">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/comment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件

export default {
  name: 'CommentList',
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'checked': 'success',
        '-': 'info',
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
      search_recommend: '',
      search_top: '',
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
      fetchList(this.listQuery).then(response => {
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
  /*background: -webkit-gradient(linear, left top, right top, from(#20b6f9), color-stop(0%, #20b6f9), color-stop(100%, #2178f1), to(#2178f1));*/
  /*background: linear-gradient(90deg, #20b6f9 0%, #20b6f9 0%, #2178f1 100%, #2178f1 100%);*/
  background: powderblue;
}
</style>
