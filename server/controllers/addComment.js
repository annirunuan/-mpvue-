const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    const {bookid, comment,location,openId, phone} = ctx.request.body
    console.log(bookid, comment, openId, location, phone)
    try {
        await mysql('comments').insert({openId,bookid, comment, phone,location})
        ctx.state.data = {
            msg: 'success'
        }
    } catch (e) {
        ctx.state = {
            code: -1,
            data: {
                msg: '评论失败:' + e.sqlMessage
            }
        }
    }
}