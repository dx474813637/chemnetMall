const http = uni.$u.http
 
 
 // login_card 我的名片
export const login_card = (data) => http.get('login_card', data)
 // edit_card 创建编辑我的名片 `name`, `position`, `company`, `phone`, `tel`, `img`, `email`, `address`
export const edit_card = (data) => http.get('edit_card', data)
 // group_book_list 群列表 p terms
export const group_book_list = (data) => http.get('group_book_list', data)
 // group_book_detail 群详情 id 
 // group_book_detail 群详情返回内容里：
 // card=1 创建了名片 
 // cate 0 退出  1 2 3 4被踢出无法再次加入
 // join=1加入了群 2被退出群了 
 // card_info名片信息 
 // guanli=1是管理人员 能踢人
export const group_book_detail = (data) => http.get('group_book_detail', data)
 // group_book_member_list 群成员列表 id p terms
export const group_book_member_list = (data) => http.get('group_book_member_list', data)
 // join_group_book 加入群 
 // 群id：id 
 // cate=1 有账号有名片加入 2 有账号无名片加入 3无账号加入 
 // 在2情况下，多`name`, `position`, `company`, `phone`,（ `tel`, `email`, `address`这三个不用传，虽然也接受的）
 // 在3的情况下，2的参数再多一个captcha
export const join_group_book = (data) => http.get('join_group_book', data)
 // out_group_book 退出群 参数群id：id
export const out_group_book = (data) => http.get('out_group_book', data)
 
 
// kicking_out_group_book 踢出群 参数 群id：id 群成员列表的id：tid
export const kicking_out_group_book = (data) => http.get('kicking_out_group_book', data)
 
// web_login_card 前台名片页 参数login
export const web_login_card = (data) => http.get('web_login_card', data)
// edit_tiao_book 设置名片页跳转群  参数 群id：id
export const edit_tiao_book = (data) => http.get('edit_tiao_book', data)
// myjoin_group_book 我加入的群
export const myjoin_group_book = (data) => http.get('myjoin_group_book', data)


// upimg 传图片
export const upimg = (data) => http.get('upimg', data)
 
 // follow 关注+取消 参数login  follow=1关注 2取消关注
export const follow = (data) => http.get('follow', data)
// follow_list 关注列表 没参数 不分页
export const follow_list = (data) => http.get('follow_list', data)