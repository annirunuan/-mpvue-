<!--  -->
<template>
 <div>
     <swiper :tops='tops'></swiper>
     <Card :key='book.id' v-for='book in books' :book='book'></Card>
     <p class='text-footer' v-if='!more'>
      没有更多数据
    </p>
 </div>
</template>

<script>
import {get} from '@/utils/index'
import Card from '@/components/Card'
import swiper from '@/components/TopSwiper'
export default {
 data () {
 return {
     books:[],
      page:0,
      more:true,
      tops:[]
 };
 },

 components: {
     Card,
     swiper
 },

 computed: {
     
 },

 created() {
      
 },
  async mounted () {
   await this.booklist(true)
   this.getTop()
 },
 onPullDownRefresh(){
     console.log('我下啦了')
     this.booklist(true)
     this.getTop()
 },
 onReachBottom(){
     if(!this.more){
         return false
     }
     this.page = this.page+1,
     this.booklist(false)
 },
 methods: {
     async booklist(init){
         if(init){
        this.page = 0
        this.more = true
      }
         wx.showNavigationBarLoading()
         const books = await get('/weapp/bookList',{'page':this.page})
         if(books.length < 10){
             this.more = false
         }
         if(init){
             this.books = books.list
             wx.stopPullDownRefresh()
         }else{
             this.books = this.books.concat(books.list)
         }
        //  console.log(this.books)
        wx.hideNavigationBarLoading()
     },
     async getTop(){
         const top = await get('/weapp/top')
         this.tops = top.list
        //  console.log(this.tops)
     }
 }
}

</script>
<style scoped>
</style>
