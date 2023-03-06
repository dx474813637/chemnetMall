<template>
	<view class="w u-p-20">
		<view class="list">
			<view class="u-p-10 u-p-l-20 u-p-r-20"
				v-for="(item, index) in indexList"
				:key="index">
				{{item.id}}
			</view>
			
			<template name="dataStatus">
				<template v-if="indexList.length == 0">
					<u-empty
						mode="data"
						:icon="typeConfig.white.empty"
					>
					</u-empty>
				</template>
				<template v-else>
					<u-loadmore
						:status="loadstatus"
					/>
				</template>
			</template>
		</view> 
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		data() {
			return {
				id: '',
				login: '',
				indexList: [],
				curP: 1,
				loadstatus: 'loadmore',
			}
		},
		async onLoad(options) { 
			if (options.hasOwnProperty('id')) {
				this.id = options.id
			}  
			else if (options.hasOwnProperty('login')) {
				this.login = options.login
			}  
			uni.showLoading()
			await this.getData()
		}, 
		async onReachBottom () {
			this.scrolltolower()
		},
		computed: {
			...mapState({ 
				typeConfig: state => state.theme.typeConfig,  
			}),
			themeConfig() {
				return this.typeConfig.chemnet
			},
			dataConfig() {
				let config 
				if(this.id) {
					config = {
						api: 'dynamiclist',
						params: {
							login: this.login,
							p: this.curP,
						}
					}
				}
				else if(this.login) {
					config = {
						api: 'my_dynamiclist',
						params: {
							login: this.login,
							p: this.curP,
						}
					}
				}
				return config
			}
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto'
			}),
			async refreshList() {
				this.initParamas()
				await this.getData()
			},
			initParamas() {
				this.curP = 1;
				this.indexList = [];
				this.loadstatus = 'loadmore'
			},
			scrolltolower() {
				this.getMoreData()
			},
			async getData() {
				if(this.loadstatus != 'loadmore') return
				this.loadstatus = 'loading'
				const res = await this.$api[this.dataConfig.api]({params:{ 
					...this.dataConfig.params
				}})
				if(res.code == 1) {
					// this.setOnlineControl(res)
					if(res.title) {
						uni.setNavigationBarTitle({
							title: res.title
						})
					} 
					this.indexList = [...this.indexList, ...res.list]
					if( this.indexList.length == res.total || !res.list ||res.list.length == 0) {
						this.loadstatus = 'nomore'
					}else {
						this.loadstatus = 'loadmore'
					}
				}
			},
			async getMoreData() {
				if(this.loadstatus != 'loadmore') return
				this.curP ++
				await this.getData()
			},
		}
	}
</script>

<style>

</style>
