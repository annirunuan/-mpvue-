<!-- 书籍详情 -->
<template>
  <div>
      <BookInfo :info='info'></BookInfo>
      <commentList :comments="comments"></commentList>
      <div class="comment" v-if="showAdd">
    <textarea v-model='comment'
              class='textarea'
              :maxlength='100'
              placeholder='请输入图书短评'></textarea>
    <div class='location'>
      地理位置：
      <switch color='#EA5A49' :checked='location' @change='getGeo'></switch>
      <span class='text-primary'>{{location}}</span>
    </div>
    <div class='phone'>
      手机型号：
      <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
      <span class='text-primary'>{{phone}}</span>
    </div>
    <button class="btn" @click='addComment'>
      评论
    </button>
  </div>
  <div class='text-footer' v-if="!showAdd">
    未登录或者已经评论过啦
  </div>
  <button open-type='share' class="btn">转发给好友</button>
      </div>
</template>
<script>
import {get,showModal,post} from '@/utils/index'
import BookInfo from '@/components/BookInfo'
import commentList from '@/components/commentList'
export default {
  data(){
    return {
      comments:[],
      comment:'',
      userInfo:{},
      bookid:'',
      info: {},
      location:'',
      phone:''
    }
  },
  components:{
      BookInfo,
      commentList
  },
  computed: {
    showAdd(){
      //判断是否登录
      if(!this.userInfo.openId){
        return false
      }
      //判断是否评论过
      if(this.comments.filter(v=>v.openId==this.userInfo.openId).length){
        return false
      }
      return true
    }
  },
  methods:{
    async addComment(){
      if(!this.comment){
        return showModal('失败','未评论内容')
      }
      let  data = {
        openId : this.userInfo.openId,
        bookid : this.bookid,
        comment : this.comment,
        location : this.location,
        phone : this.phone
      }
      try{
        await post('/weapp/addComment',data)
        this.comment = ''
        console.log(data)
        this.getComments()
        showModal('评论成功','祝你万事如意')
      }catch(e){
        showModal('失败',e.msg)
      }
      
    },
   async getComments(){
      const comments =  await get('/weapp/getComments',{bookid:this.bookid})
      console.log('comments',comments.list)
      this.comments = comments.list
    },
    async getDetail(){
      const info = await get('/weapp/bookdetail',{id:this.bookid})
      wx.setNavigationBarTitle({
          title: info.title
      })
       let tags = info.tags
       let tag = tags.split(',')
       info.tags = tag
      this.info = info
      // console.log(this.info)
    },
    // MUFFwZfzsUIy1DMsR6eLqwIrj4ax4Isl 地理位置密钥
    //http://api.map.baidu.com/geocoder/v2/ 请求地址
    getGeo(e){
      const ak = 'MUFFwZfzsUIy1DMsR6eLqwIrj4ax4Isl'
      let url = 'http://api.map.baidu.com/geocoder/v2/'
      if(e.target.value){
        wx.getLocation({
           success: res=>{
            //  console.log(res)
             wx.request({
               url,
               data:{
                 ak,
                 location:`${res.latitude},${res.longitude}`,
                 output:'json'
               },
               success:sss=>{
                //  console.log(sss)
                 if(sss.data.status == 0){
                   this.location = sss.data.result.addressComponent.city
                 }else{
                    this.location = '您可能来自外太空'
                 }
               }
             })
           }
        })
      }else{
        this.location = ''
      }
    },
    getPhone(e){
      if(e.target.value){
        this.phone = wx.getSystemInfoSync().model
      }else{
        this.phone = ''
      }
    }
  },
  mounted(){
    this.bookid = this.$root.$mp.query.id
    this.getDetail()
    this.userInfo = wx.getStorageSync('userinfo')
    this.getComments()
  }
}
</script>
<style lang="scss">
.comment{
  margin-top:10px;
  .textarea{
    width:730rpx;
    height:200rpx;
    background:#eee;
    padding:10rpx;
  }
  .location{
    margin-top:10px;
    padding:5px 10px;
  }
  .phone{
    margin-top:10px;
    padding:5px 10px;
    
  }
}
</style>