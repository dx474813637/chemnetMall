import user from '@/store/modules/user.js'
import theme from '@/store/modules/theme.js'
import sinopay from '@/store/modules/sinopay.js' 

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		user,
		theme,
		sinopay, 
	},
	strict: true
})
// #endif

// #ifdef VUE3
import {createStore} from 'vuex'
const store = createStore({
	modules: {
		user,
		theme,
		sinopay,
		chemnet,
	}
})
// #endif

export default store