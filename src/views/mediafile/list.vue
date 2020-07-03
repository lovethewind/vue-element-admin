<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '+ list[0].id" style="text-align: left">
      <el-input v-model="search_content" placeholder="请输入用户名/文件标题" style="width: 200px;margin:0 10px">搜索</el-input>
      <el-select v-model="search_type" style="width: 120px;margin-right: 20px" placeholder="类型">
        <el-option label="图片" value="image" />
        <el-option label="视频" value="video" />
        <el-option label="音频" value="audio" />
        <el-option label="文本" value="txt" />
        <el-option label="附件" value="other" />
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
      <el-button type="success" icon="el-icon-search" style="margin-right: 100px">搜索</el-button>
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

      <el-table-column align="center" width="120px" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author.user.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="260px" label="文件标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="240px" label="链接">
        <template slot-scope="scope">
          <el-tag :type="scope.row.url === 'true'?'success':'info'">
            <span>{{ scope.row.url }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | statusFilter">
            <span>{{ scope.row.type === 'image'?'图片':scope.row.type === 'video'?'视频':scope.row.type === 'audio'?'音频':scope.row.type === 'txt'?'文本':'附件' }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="大小">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="下载量">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" prop="time" sortable align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/mediafile/edit/'+scope.row.id" title="编辑">
            <el-button type="primary" size="small" icon="el-icon-edit" />
          </router-link>
          <router-link :to="'/mediafile/edit/'+scope.row.id" title="删除">
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
import { fetchList } from '@/api/mediafile'

export default {
  name: 'LikeAndCollectList',
  components: { Pagination, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'image': '',
        'video': 'info',
        'aduio': 'danger',
        'txt': 'warning',
        'other': 'success'
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
