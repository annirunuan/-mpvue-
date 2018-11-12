<!--  -->
<template>
 <div class="container">
     <div class="userinfo" @click='login'>
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>
    <button @click='scanBook' class='btn' v-if="userinfo.openId">添加图书</button>
 </div>
</template>

<script>
import qcloud from "wafer2-client-sdk";
import { showSuccess,showModal,post } from "@/utils/index";
import config from "@/config";
import YearProgress from "@/components/YearProgress";
export default {
  data() {
    return {
      userinfo: {
          avatarUrl: '../../../static/img/unlogin.png',
          nickName:'请登录'
      }
    }
  },
  components: {
      YearProgress
  },

  computed: {

  },

  created(){
    let userinfo = wx.getStorageSync("userinfo");
    if (userinfo) {
      this.userinfo = userinfo
    }
  },

  methods: {
   async addBook(isbn){
          console.log(isbn)
          let res = await post('/weapp/addBook',{
              isbn,
              openId: this.userinfo.openId
          })
          showModal('添加成功',`${res.title}添加成功`)
      },
    scanBook() {
      wx.scanCode({
        success:(res)=> {
          if(res.result){
            this.addBook(res.result)
          }
        }
      });
    },
    login(){
        let getLog = wx.getStorageSync("userinfo");
        let self = this
    if (!getLog) {
      qcloud.setLoginUrl(config.loginUrl);
      qcloud.login({
        success: function(userinfo) {
          showSuccess("登陆成功");
          console.log("登录成功", userinfo);
          wx.setStorageSync("userinfo", userinfo);
          self.userinfo = wx.getStorageSync("userinfo")
        },
        fail: function(err) {
          console.log("登录失败", err);
        }
      });
    }
    }
  }
};
</script>
<style scoped lang='scss'>
.container {
  padding: 0 30rpx;
  .btn{
      border-radius: 20rpx;
  }
}
.userinfo {
  margin-top: 100rpx;
  text-align: center;
  img {
    width: 150rpx;
    height: 150rpx;
    margin: 20rpx;
    border-radius: 50%;
  }
}
</style>
