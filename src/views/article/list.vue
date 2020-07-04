<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '" style="text-align: left;height: 100px;">
      <el-input v-model="listQuery.search_content" placeholder="请输入标题/作者/内容搜索" style="width: 250px;margin-right: 20px">搜索</el-input>
      <el-date-picker
        v-model="listQuery.search_date"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        style="margin-right: 20px"
      />
      <el-select v-model="listQuery.search_top" style="width: 120px;margin-right: 20px" placeholder="是否置顶">
        <el-option label="是否置顶" value="" />
        <el-option label="已置顶" value="true" />
        <el-option label="未置顶" value="false" />
      </el-select>
      <el-select v-model="listQuery.search_recommend" style="width: 120px;margin-right: 20px" placeholder="是否推荐">
        <el-option label="是否推荐" value="" />
        <el-option label="已推荐" value="true" />
        <el-option label="未推荐" value="false" />
      </el-select>
      <el-button type="success" icon="el-icon-search" style="margin-right: 30px" @click="getList">搜索</el-button>
      <el-select v-model="listQuery.search_status" style="width: 120px;margin-right: 20px" placeholder="状态">
        <el-option label="状态" value="" />
        <el-option label="已发布" value="publish" />
        <el-option label="草稿" value="draft" />
        <el-option label="审核中" value="check" />
        <el-option label="已删除" value="delete" />
      </el-select>
      <el-select v-model="listQuery.search_comment_disabled" style="width: 120px;margin-right: 20px" placeholder="禁止评论">
        <el-option label="禁止评论" value="" />
        <el-option label="是" value="true" />
        <el-option label="否" value="false" />
      </el-select>
      <el-button type="success" icon="fa fa-chevron-up" style="margin-left: 63px" @click="openListDialog('top')"> 批量置顶</el-button>
      <el-button type="success" icon="fa fa-chevron-up" style="margin-left: 30px" @click="openListDialog('recommend')"> 批量推荐</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 30px" @click="openListDialog('delete')">批量删除</el-button>
    </sticky>
    <el-divider />
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" :default-sort="{prop: 'time', order: 'descending'}" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="selection"
        width="40"
        fixed
        style="text-align: center"
        @selection-change="handleSelectionChange"
      />
      <el-table-column align="center" label="ID" prop="id" sortable width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" width="220px">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author.user.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.category.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" prop="time" sortable align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" prop="view_count" sortable align="center" label="查看/评论">
        <template slot-scope="scope">
          <span>{{ scope.row.view_count }} / {{ scope.row.comment_count }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" prop="like_count" sortable align="center" label="喜欢/收藏">
        <template slot-scope="scope">
          <span>{{ scope.row.like_count }} / {{ scope.row.collect_count }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" prop="top" sortable label="置顶">
        <template slot-scope="{row}">
          <el-tag :type="row.top?'success':'info'">
            {{ row.top?'已置顶':'未置顶' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" prop="recommend" sortable label="推荐">
        <template slot-scope="{row}">
          <el-tag :type="row.recommend?'success':'info'">
            {{ row.recommend?'已推荐':'未推荐' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" prop="status" sortable width="90">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === 'draft'?'草稿': row.status ==='publish'?'已发布':row.status ==='delete'?'已删除':'审核中' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="禁止评论" prop="status" sortable width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.comment_disabled?'danger':'success'">
            {{ row.comment_disabled?'是':'否' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id" title="编辑">
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
      <span>你确定要删除文章 <span style="color: red">{{ delete_content.title }}</span> 吗？</span>
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
      <span>你确定要{{ operateListContent.name }}共<span style="color:red;">{{ operateListContent.length }}</span>篇文章吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogListVisible = false">取 消</el-button>
        <el-button type="primary" @click="operateList">确 定</el-button>
      </span>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, updateArticle, deleteArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky'

export default {
  name: 'ArticleList',
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'publish': 'success',
        'check': '',
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
        search_recommend: '',
        search_top: '',
        search_status: '',
        search_comment_disabled: ''
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
      multipleSelection: []
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
      deleteArticle(id).then(response => {
        if (response.code === 0) {
          this.$message.error('删除失败')
        }
      })
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
        if (val === 'top') {
          this.operateListContent.name = '（取消）置顶'
          this.operateListContent.type = 'top'
        } else if (val === 'recommend') {
          this.operateListContent.name = '（取消）推荐'
          this.operateListContent.type = 'recommend'
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
        if (this.operateListContent.type === 'top') {
          selectData[i].top = !selectData[i].top
          updateArticle(selectData[i]).then(response => {
            if (response.code === 0) {
              this.$message.error('（取消）置顶文章' + selectData[i].title + '失败')
            }
          })
        } else if (this.operateListContent.type === 'recommend') {
          selectData[i].recommend = !selectData[i].recommend
          updateArticle(selectData[i]).then(response => {
            if (response.code === 0) {
              this.$message.error('（取消）推荐文章' + selectData[i].title + '失败')
            }
          })
        } else {
          selectData[i].status === 'delete' ? console.log() : selectData[i].recommend = 'delete'
          deleteArticle(selectData[i].id).then(response => {
            if (response.code === 0) {
              this.$message.error('删除' + selectData[i].title + '失败')
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
</style>
<style>
  .sub-navbar {
  text-align: left;
  padding-left: 20px;
}
</style>
