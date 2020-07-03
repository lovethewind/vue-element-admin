<template>
  <div v-if="list" class="app-container">
    <sticky :z-index="10" :class-name="'sub-navbar '+ list[0].id" style="text-align: left">
      <el-input v-model="search_content" placeholder="请输入用户名/邮箱/手机号" style="width: 200px;margin-right: 20px">搜索</el-input>
      <el-select v-model="search_type" style="width: 120px;margin-right: 20px" placeholder="是否收藏">
        <el-option label="已收藏" value="collect" />
        <el-option label="未收藏" value="not_collect" />
      </el-select>
      <el-select v-model="search_method" style="width: 120px;margin-right: 20px" placeholder="是否喜欢">
        <el-option label="已喜欢" value="like" />
        <el-option label="未喜欢" value="not_like" />
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

      <el-table-column align="center" width="120px" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author.user.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章">
        <template slot-scope="scope">
          <span>{{ scope.row.article.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="140px" label="是否喜欢">
        <template slot-scope="scope">
          <el-tag :type="scope.row.like_status === 'true'?'success':'info'">
            <span>{{ scope.row.like_status === 'true'?'已喜欢':'未喜欢' }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="140px" label="是否收藏">
        <template slot-scope="scope">
          <el-tag :type="scope.row.collect_status === 'true'?'success':'info'">
            <span>{{ scope.row.collect_status === 'true'?'已收藏':'未收藏' }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="160px" prop="time" sortable align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/likeandcollect/edit/'+scope.row.id" title="编辑">
            <el-button type="primary" size="small" icon="el-icon-edit" />
          </router-link>
          <router-link :to="'/likeandcollect/edit/'+scope.row.id" title="删除">
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
import { fetchList } from '@/api/likeandcollect'

export default {
  name: 'LikeAndCollectList',
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
