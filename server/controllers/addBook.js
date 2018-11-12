const https = require('https')
const {
  mysql
} = require('../qcloud')
// https://api.douban.com/v2/book/isbn/9787536692930

module.exports = async (ctx) => {
  const {
    isbn,
    openId
  } = ctx.request.body
  console.log('添加图书', isbn, openId)
  if (isbn && openId) {
    const mysqlBook = await mysql('books').select().where('isbn',isbn)
    if(mysqlBook.length){
      ctx.state = {
        code : -1,
        data:{
          msg:'图书已存在'
        }
      }
      return
    }
    let url = 'https://api.douban.com/v2/book/isbn/' + isbn
    console.log(url)
    const bookinfo = await getJSON(url)
    console.log(bookinfo)
    const rate = bookinfo.rating.average
    const {
      title,
      image,
      alt,
      publisher,
      summary,
      price
    } = bookinfo
    const tags = bookinfo.tags.map(v => {
      return `${v.title} ${v.count}`
    }).join(',')
    const author = bookinfo.author.join(',')
    try{
        await mysql('books').insert({
          isbn,openId,rate,title, image, alt, publisher, summary ,price,tags,author
        })
        ctx.state.data = {
          title,
          msg:'success'
        }
      }catch(e){
        console.log(e)
        ctx.state = {
          code:-1,
          data:{
            msg:'新增失败:'+e.sqlMessage
          }
        }
      }
  }
}


function getJSON(url) {
  return new Promise((reslove, reject) => {
    https.get(url, res => {
      let urlData = ''
      res.on('data', data => {
        urlData += data
      })
      res.on('end', data => {
        const bookinfo = JSON.parse(urlData)
        if (bookinfo.title) {
          reslove(bookinfo)
        }
        reject(bookinfo)
      })
    })
  })
}
