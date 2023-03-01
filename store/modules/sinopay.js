
let state = {
		sino: uni.getStorageSync('sino') || {
			sinopay_poster: ''
		},
		sinoFund: [],
		sinoFundLoading: false,
		sinoBillAccount: false,
		sinoBillLoading: false,
		sinoBillAccountList: [],
		sinoBillListLoading: false,
		tishi: {
			list: [],
			other: {}
		},
		sinoAccOpenObj: uni.getStorageSync('sinoAccOpenObj') || {},
	},
	getters = {
		sinoAccOpen(state) { 
			return state.sinoAccOpenObj[state.sino.sinopay_poster] || 0
		}
	},
	mutations = {
		setSinoAccount(state, data) {
			console.log(data)
			state.sino = data
			uni.setStorageSync('sino', data)
		},
		setSinoFundAccount(state, data) {
			state.sinoFund = data
		},
		setSinoFundLoading(state, data) {
			state.sinoFundLoading = data
		},
		setSinoBillLoading(state, data) {
			state.sinoBillLoading = data
		},
		setSinoBillListLoading(state, data) {
			state.sinoBillListLoading = data
		},
		setSinoBillAccount(state, data) {
			state.sinoBillAccount = data
		},
		setSinoBillAccountList(state, data) {
			state.sinoBillAccountList = data
		},
		setTishi(state, data) {
			state.tishi.list = data.list
			state.tishi.other = data.other
		},
		setSinoAccOpen(state, data) {
			state.sinoAccOpenObj = {
				...state.sinoAccOpenObj, 
				[`${state.sino.sinopay_poster}`]: data,
			} 
			uni.setStorageSync('sinoAccOpenObj', state.sinoAccOpenObj)
		},
		clearSino(state, data) {
			state.sinoFund = []
			state.sino = {}
			uni.setStorageSync('sino', {})
		}
	},
	actions = {
		async getSinoAccount({commit, state}, data={}) {
			const res = await this._vm.$api.sino_account();
			if(res.code == 1) {
				commit('setSinoAccount', res.list)
			}
		},
		async getSinoTishi({commit, state}, data={}) {
			const res = await this._vm.$api.sinopay_tishi();
			if(res.code == 1) {
				commit('setTishi', {list: res.list, other: res.other})
			}
		},
		async getSinoFundAccount({commit, state}, data={}) {
			
			commit('setSinoFundLoading', true)
			const res = await this._vm.$api.sino_fund_account();
			commit('setSinoFundLoading', false)
			if(res.code == 1) {
				commit('setSinoFundAccount', res.list)
			}
		},
		async getSinoBillAccount({commit, state}, data={}) {
			 
			commit('setSinoBillLoading', true)
			const res = await this._vm.$api.sino_bill_account_list(); 
			
			commit('setSinoBillLoading', false)
			if(res.code == 1) {
				commit('setSinoBillAccount', res.list.bill_account)
			}
		},
		async getSinoBillAccountList({commit, state}, data={}) {
			 
			commit('setSinoBillListLoading', true)
			const res = await this._vm.$api.sino_bill_account_list_account(); 
			commit('setSinoBillListLoading', false)
			if(res.code == 1) {
				commit('setSinoBillAccountList', res.list.list_accounts)
			}
		},
		async refreshSinoFundAccount({commit, state}, data={}) {
			
			// commit('setSinoFundLoading', true)
			const res = await this._vm.$api.sino_fund_account_refresh_bal({
				params: {
					account_id: data.id
				}
			});
			// commit('setSinoFundLoading', false)
			// if(res.code == 1) {
			// 	commit('setSinoFundAccount', res.list)
			// }
		},
	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}