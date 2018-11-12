<!--  -->
<template>
 <div class="progressbar">
   <progress :percent="preant" activeColor="#EA5149"/>
   <p>{{year}}年已经过去了{{day}}天了,这一年你读了多少书呢</p>
 </div>
</template>

<script>
export default {
 data () {
 return {

 };
 },

 components: {},

 computed: {
   year(){
     return new Date().getFullYear()
   },
   day(){
     let start = new Date()
     start.setMonth(0)
     start.setDate(1)
     let offset = new Date().getTime() - start.getTime()
     return parseInt(offset/1000/60/60/24)+1
   },
   preant(){
     return  (this.day*100/this.getDayOfYear()).toFixed(1)
   }
 },

 created() {},

 methods: {
   isLeapYear(){
     let start = new Date().getFullYear()
     if(start/400 === 0){
       return ture
     }else if(start/4 === 0 && start/100 !== 0){
       return ture
     }else{
       return false
     }
   },
   getDayOfYear(){
     return this.isLeapYear()?366:365
   }
 }
}

</script>
<style scoped lang="scss">
.progressbar{
  text-align: center;
  margin-top:10rpx;
  margin-bottom:40rpx;
  width:100%;
  font-size: 30rpx;
  progress{
    margin-bottom: 10rpx;
  }
}
</style>