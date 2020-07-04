<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <el-input v-model="listQuery.search_content" placeholder="请输入分类名" style="width: 200px;margin-right: 20px">搜索</el-input>
      <el-select v-model="listQuery.search_status" style="width: 120px;margin-right: 20px" placeholder="状态">
        <el-option label="可用" value="true" />
        <el-option label="禁用" value="false" />
      </el-select>
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
      <el-button type="info" icon="fa fa-minus-circle" @click="openListDialog('forbid')"> 批量禁用</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="openListDialog('delete')">批量删除</el-button>
    </sticky>
    <el-divider />
    <el-table ref="multipleTable" v-loading="listLoading" :data="list" :default-sort="{prop: 'last_login', order: 'descending'}" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="selection"
        width="40"
        style="text-align: center"
        fixed
        @selection-change="handleSelectionChange"
      />
      <el-table-column align="center" prop="id" sortable label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类名" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="简介">
        <template slot-scope="scope">
          <span>{{ scope.row.jianjie }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="父级分类">
        <template slot-scope="scope">
          <span>{{ scope.row.parent_id.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==='true'?'success':'info'">
            {{ scope.row.status === 'true' ?'可用':'禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/category/edit/'+scope.row.id" title="编辑">
            <el-button type="primary" size="small" icon="el-icon-edit" />
          </router-link>
          <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="openDeleteDialog(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="警告"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>你确定要删除分类 <span style="color: red">{{ delete_content.name }}</span> 吗？如果存在子分类，则子分类会一并删除</span>
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchList, updateCategory, deleteCategory } from '@/api/category'

export default {
  name: 'CategoryList',
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
        search_status: ''
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
      fetchList(this.listQuery).then(response => {
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
          updateCategory(selectData[i]).then(response => {
            if (response.code === 0) {
              this.$message.error('（取消）禁用分类' + selectData[i].title + '失败')
            }
          })
        } else {
          selectData[i].status === 'delete' ? console.log() : selectData[i].recommend = 'delete'
          deleteCategory(selectData[i].id).then(response => {
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
  } // end method
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
