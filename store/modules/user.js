
// import * as apis from '@/config/api'

let state = {
		configBaseURL: 'https://wx.rawmex.cn/Chemnet/',
		configHeader: {
			'content-type': 'application/x-www-form-urlencoded',
			'appid': 10001,
			'appsecret': '9a661ge+kl5wI7rVe0mtd3KZ2QkjR4oSetjnZ7dMV8YQbWrHTcyui7A',
		},
		addressArea: [],
		menusList: [],
		wode: {},
		login: 0,
		auth: 0,
		role: 1,
		dingyue: {},
		bd: 1,
		sh: 1, //接口接收隐藏一些结构用
		ppiCate: [],
		myCpy: uni.getStorageSync('myCpy') || {},
		myAllCpy: [],
		mduCpy: [],
		myProduct: [],
		moreMenus: {},
		moreMenusNew: [],
		menus_broker: {},
		menus_wd: [],
		newMsg: 0,
		tips: {},
		wode_guide: {},
		maxSize: 1000000,
		page: {
			route: '/pages/index/index',
			options: {}
		},
		share_other: ''
	},
	getters = {
	},
	mutations = {
		setWdMenus(state, data=[]) {
			state.menus_wd = data;
		},
		setShareOther(state, data) {
			// console.log(data)
			// let otherArr = data.split('&')
			// let obj = {}
			// otherArr.forEach(ele => {
			// 	obj[ele.split('=')[0]] = ele.split('=')[1]
			// })
			state.share_other = data;
		},
		setBrokerMenus(state, data=[]) {
			state.menus_broker = data;
		},
		setGuide(state, data={}) {
			state.wode_guide = data;
		},
		setAddressArea(state, data=[]) {
			state.addressArea = data
		},
		setMenusList(state, data=[]) {
			state.menusList = data
		},
		setPPiCate(state, data=[]) {
			state.ppiCate = data
		},
		handleGoto(state, obj) {
			uni.$u.route(obj)
		},
		setLogin(state, data) {
			state.login = data;
		},
		setRole(state, data) {
			state.role = data;
		},
		setAuth(state, data) {
			state.auth = data;
		},
		setDingyue(state, data={}) {
			state.dingyue = data;
		},
		setSh(state, data) {
			state.sh = data;
		},
		setMyCpy(state, data={}) {
			state.myCpy = data;
			uni.setStorageSync('myCpy', data)
		},
		setAllCpy(state, data) {
			state.myAllCpy = data;
		},
		setMduCpy(state, data) {
			state.mduCpy = data;
		},
		setMyProduct(state, data) {
			state.myProduct = data;
		},
		setMoreMenus(state, data) {
			state.moreMenus = data;
		},
		setMoreMenusNew(state, data) {
			state.moreMenusNew = data;
		},
		setNewMsg(state, data) {
			state.newMsg = data;
		},
		setBd(state, data) {
			state.bd = data;
			if(data != 1) {
				uni.redirectTo({
					url: '/pages/my/account/bind_phone'
				})
			}
		},
		setTips(state, data) {
			state.tips = data;
		},
		setWode(state, data) {
			state.wode = data;
		},
		setPage(state, data) { 
			// console.log('store', data)
			state.page = data;
		},
		clearLogout(state, data) {
			state.bd = 1
			state.auth = 0
			state.myCpy = {}
			// state.dingyue = {}
			uni.setStorageSync('myCpy', {}) 
			// uni.setStorageSync('WebSocketInfo', {
			// 	...uni.getStorageSync('WebSocketInfo'),
			// 	login: ''
			// })
			// state.myAllCpy = []
			state.login = 0
			// state.myProduct = []
			// state.newMsg = 0
		},
	},
	actions = {
		// async getCompanyProduct({commit, state}, data={}) {
		// 	const res = await this._vm.$api.getCompanyProduct({params: {login: state.login, p: 1, ...data}});
		// 	if(res.code == 1) {
		// 		commit('setMyProduct', res.list)
		// 	}
		// },
		// async getAllCompany({commit, state}) {
		// 	const res = await this._vm.$api.getAllCompany();
		// 	if(res.code == 1) {
		// 		commit('setAllCpy', res.list)
		// 	}
		// },
		// async getMduCompany({commit, state}) {
		// 	const res = await this._vm.$api.mdu_broker();
		// 	if(res.code == 1) {
		// 		commit('setMduCpy', res.list)
		// 	}
		// },
		async myCompany({commit, state}) {
			const res = await this._vm.$api.myCompany();
			if(res.code == 1) {
				commit('setMyCpy', res.list)
			}
		},
		async wode({commit, state}, data={}) {
			const res = await this._vm.$api.wode({params: data})
			
			commit('setWode', res.list)
			// commit('setGuide', {
			// 		list: res.guideList || [],
			// 		yd: res.yd
			// 	})
			if(res.yd == 1) uni.removeStorageSync('wode_guide')
			commit('setLogin', res.list.login)
			commit('setAuth', res.list.auth)
			commit('setSh', res.list.sh)
			commit('setRole', res.role)
			if(res.list.login) commit('setBd', res.list.bd)
			// commit('setTips', {
			// 	tips_info: res.list.tips_info,
			// 	tips_title: res.list.tips_title,
			// 	tips_url: res.list.tips_url
			// })
			// uni.setStorageSync('WebSocketInfo', {
			// 	...uni.getStorageSync('WebSocketInfo'),
			// 	login: res.list.login
			// })
		},
		async getAddressArea({commit, state}) {
			//获取地区toCode 数据 存入vuex
			if (state.addressArea.length != 0) {
				return
			}
			const res = await this._vm.$api.addressArea()
			// const resList = JSON.parse(res.list)
			// const list = listMethods(resList)
			// console.log(res)
			commit('setAddressArea', res.list)
		
		},
		async getMenusList({commit, state}) {
			
			const res = await this._vm.$api.chemnet_category()
			// console.log(res) 
			let list = res.list.list_category
			list.forEach(ele => {
				ele.list = ele.list_cate
			})  
			commit('setMenusList', list)
			// commit('setMenusList', [
			// 	{id: 'dxdx', name: 'A级测试固定菜单名', children: [{id: 'dxdxb', name: 'B级测试固定菜单名1'}, {id: 'dxdxbb', name: 'B级测试固定菜单名2'}]}, 
			// 	...res.data
			// 	]
			// )
		
		},
		// async getPPiCate({commit, state}) {
			
		// 	const res = await this._vm.$api.getPpiCateList()
		// 	if(res.code == 1) {
		// 		res.list.forEach(ele => {
		// 			ele.list.forEach(item => {
		// 				item.dir = ele.id
		// 			})
		// 		})
		// 		commit('setPPiCate', res.list)
		// 	}
		// },
		async getImageBase64_readFile({commit, state}, tempFilePath) {
			console.log(tempFilePath)
			  return await new Promise(resolve => {
					//获取全局唯一的文件管理器 
					uni.getFileSystemManager().readFile({ //读取本地文件内容
					  filePath: tempFilePath, // 文件路径
					  encoding: 'base64', // 返回格式
					  success: ({
						data
					  }) => {
						// return resolve('data:image/png;base64,' + data);
						return resolve( data);
					  }
					});
			  });
		}, 
		async sendDingyue() {
			// wx.getSetting({
			// 	withSubscriptions: true,
			// 	success: async res => {
			// 		console.log(res)
			// 		const r = await this._vm.$api.get_tmp_id_time({
			// 			params: {
			// 				str: JSON.stringify(res)
			// 			}
			// 		});
			// 	}
			// })
		}
	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}