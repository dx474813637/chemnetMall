const http = uni.$u.http

// chemnet_home
export const chemnet_home = (data) => http.get('chemnet_home', data)
// chemnet_category
export const chemnet_category = (data) => http.get('chemnet_category', data)

// chemnet_product_list 行业商品列表 参数category 分类id（不是必须） p页数
export const chemnet_product_list = (data) => http.get('chemnet_product_list', data)
// chemnet_product_detail 化工网商城商品详情 参数id
export const chemnet_product_detail = (data) => http.get('chemnet_product_detail', data)
// chemnet_product_search 商品搜索  参数：terms 关键字 p页数
export const chemnet_product_search = (data) => http.get('chemnet_product_search', data)



// list_unit 询盘重量单位
export const list_unit = (data) => http.get('list_unit', data)
// my_inquiry 询盘列表 参数terms p
export const my_inquiry = (data) => http.get('my_inquiry', data)
// create_inquiry 发布询盘 参数 
// 商品ID product_id 
// 价格包装id attr_id 
// 需求量，正整数quantity 
// 地址id address_id 
// 备注remark
export const create_inquiry = (data) => http.get('create_inquiry', data)

// cancel_inquiry 取消询盘 参数 询盘ID id
export const cancel_inquiry = (data) => http.get('cancel_inquiry', data)
// detail_inquiry 询盘详情 参数 询盘ID id
export const detail_inquiry = (data) => http.get('detail_inquiry', data)

// my_order 交易订单列表 参数terms p
export const my_order = (data) => http.get('my_order', data)
// order_detail 订单详情 参数 订单ID id
export const order_detail = (data) => http.get('order_detail', data)
// refuse_order 拒绝订单 参数 订单ID id
export const refuse_order = (data) => http.get('refuse_order', data)
// define_order 完成订单 参数 订单ID id
export const define_order = (data) => http.get('define_order', data)

// get_user_role 获取小程序用户权限  
// role=1 没登录 2登录的交易商 3登录的broker
// wode 在商品详情接口chemnet_product_detail里,memu接口里也会返回这个role