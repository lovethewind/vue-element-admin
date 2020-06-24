<template>
  <div id="app-header">
    <div class="top_header" id="top_header">
      <div class="title" onclick="window.location.href='/'"><img src="/static/images/weblogo.png"></div>
      <div class="left_menu">
        <ul>
          <li>
            <router-link to="/article"><a>我要学习</a></router-link>
          </li>
          <li><a href="">休闲交流</a></li>
          <li><a href="">资源分享</a></li>
          <li><a href="">心情杂谈</a></li>
          <li v-if="author"><a href="http://localhost:9527/" target="_blank" v-if="author.user.is_staff">后台管理</a></li>
        </ul>
      </div>
      <div class="searchbar">
        <el-input placeholder="开始你的探索之旅吧" v-model="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchInfo"></el-button>
        </el-input>
      </div>
      <div class="r_header">
        <ul>
          <li>
            你好,
            <span name="u_name" v-if="author"><router-link :to="/author/+author.id" style="color: #ff7bbc">{{ author.user.username }}</router-link>  <a
              @click="logout">退出</a></span>
            <span v-else>游客 欢迎<a @click="logout">登录 | 注册</a></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        author: "",
        search:"",
      }
    },
    beforeMount() {
      var author = JSON.parse(sessionStorage.getItem("author"))
      author?this.author = author:console.log();
    },
    methods: {
      searchInfo(){
        var vm = this;
        if (vm.search.trim()){
          layer.msg(vm.search, {icon:1});
        }
      },
      logout(){
        sessionStorage.clear()
        let vm = this
        vm.$router.push('/login')
      }
    }
  }
</script>

<style  src="../../../static/css/header.css"/>
