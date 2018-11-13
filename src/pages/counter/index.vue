<!--  -->
<template>
 <div class="container">
     <div class="userinfo">
      <img :src="userinfo.avatarUrl" alt="">
      <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" class="loginbtn">{{userinfo.nickName}}</button>
      <!-- <p>{{userinfo.nickName}}</p> -->
    </div>
    <YearProgress></YearProgress>
    <button @click='scanBook' class='btn' v-if="userinfo.openId">添加图书</button>
 </div>
</template>

<script>
import qcloud from "wafer2-client-sdk";
import { showSuccess, showModal, post } from "@/utils/index";
import config from "@/config";
import YearProgress from "@/components/YearProgress";
export default {
  data() {
    return {
      userinfo: {
        avatarUrl: "../../../static/img/unlogin.png",
        nickName: "好痒啊,想被点"
      }
    };
  },
  components: {
    YearProgress
  },

  computed: {},

  created() {
    let userinfo = wx.getStorageSync("userinfo");
    if (userinfo) {
      this.userinfo = userinfo;
    }
  },

  methods: {
    async bindGetUserInfo(e) {
      console.log(e.mp.detail.userInfo);
      let appID = "wxe628d5c307cd3a5c";
      let secret = "50e3c04615a61941dce2764769754313";
      let userinfos = e.mp.detail.userInfo;
      await wx.login({
        success: res => {
          if (res.code) {
            let url =
              "https://api.weixin.qq.com/sns/jscode2session?appid=" +
              appID +
              "&secret=" +
              secret +
              "&js_code=" +
              res.code +
              "&grant_type=authorization_code";
            wx.request({
              url,
              data: {},
              method: "GET",
              success: res => {
                userinfos.openId = res.data.openid;
                this.userinfo = userinfos;
                wx.setStorageSync("userinfo", this.userinfo);
                qcloud.setLoginUrl(config.loginUrl);
                console.log(config.loginUrl)
                qcloud.login({
                  success: function(userinfo) {
                    console.log('登陆成功')
                    qcloud.request({
                      url: config.userUrl,
                      login: true,
                      success(userRes) {
                        showSuccess("登录成功");
                      }
                    });
                  }
                });
              }
            });
          } else {
            showModal("登陆失败");
          }
        }
      });
    },
    async addBook(isbn) {
      console.log(isbn);
      let res = await post("/weapp/addBook", {
        isbn,
        openId: this.userinfo.openId
      });
      showModal("添加成功", `${res.title}添加成功`);
    },
    scanBook() {
      wx.scanCode({
        success: res => {
          if (res.result) {
            this.addBook(res.result);
            console.log("图书code");
          }
        }
      });
    },
    //wxe628d5c307cd3a5c
    //50e3c04615a61941dce2764769754313
    //GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    // login() {
    //   console.log("触发了");
    //   let user = wx.getStorageSync("userinfo");
    //   const self = this;
    //   if (!user) {
    //     qcloud.setLoginUrl(config.loginUrl);
    //     qcloud.login({
    //       success: function(userinfo) {
    //         qcloud.request({
    //           url: config.userUrl,
    //           login: true,
    //           success(userRes) {
    //             showSuccess("登录成功");
    //             wx.setStorageSync("userinfo", userRes.data.data);
    //             self.userinfo = userRes.data.data;
    //           }
    //         });
    //       },
    //       fail: function() {
    //         showModal("登陆失败");
    //       }
    //     });
    //   }
    // }
  }
};
</script>
<style scoped lang='scss'>
.container {
  padding: 0 30rpx;
  .btn {
    border-radius: 20rpx;
  }
}
.userinfo {
  margin-top: 100rpx;
  text-align: center;
  .loginbtn {
    background-color: #ea5a49;
    height: 70rpx;
    width: 300rpx;
    border-radius: 25rpx;
    line-height: 70rpx;
    font-size: 30rpx;
  }
  img {
    width: 150rpx;
    height: 150rpx;
    margin: 20rpx;
    border-radius: 50%;
  }
}
</style>
