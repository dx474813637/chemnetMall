<template>
	<view class="w" :style="{
		paddingBottom: id ? '60px!important' : 0
	}">
		
		<view class="list u-p-l-10 u-p-r-10">
			<u-list
				height="100%"
				enableBackToTop
				@scrolltolower="scrolltolower"
				:preLoadingScreen="100"
			>
				<u-list-item
					v-for="(item, index) in indexList"
					:key="item.id"
				>
					<view class="groupMsg ">
						<groupMsgCard
							:origin="item" 
							:manager="manager"
							@comment="handleGotoComment"
							@like="handleLike"
						></groupMsgCard>
					</view>
					
				</u-list-item>
				
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
			</u-list>
		</view>
		<template v-if="id">
			<u-safe-bottom></u-safe-bottom>
			<tabBar theme="chemnet" :customStyle="{
					'boxShadow': '0 0 10rpx rgba(0,0,0,.1)'
				}">
				<view class="pan-tabbar u-flex u-flex-items-center u-flex-around " :style="{
						color: themeConfig.tabText,
						backgroundColor: themeConfig.tabBg,
					}"> 
					<view class="item-btn  u-flex u-flex-items-center u-flex-center u-flex-1 u-p-10 u-p-l-20 u-p-r-20">
						<u-button type="primary" @click="handleGoto({url: '/pages/my/user/dynamicEdit', params: {id: id}})">我要发布</u-button>
			
					</view>
				</view>
			
			</tabBar>
			 
		</template>
		<u-toast ref="uToast"></u-toast>
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
				manager: 0,
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
			showToast(params) {
				this.$refs.uToast.show({
					position: 'bottom',
					...params,
				})
			},
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
					this.manager = res.manager
					if( this.curP == res.pages ) {
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
			async handleGotoComment({data}) {
				this.handleGoto({
					url: '/pages/index/dynamic/dynamic',
					params: {
						id: data.id,
						comment: 1
					}
				})
			},
			async handleLike({data}) {
				const res = await this.$api.add_dynamiclist_like({
					params: {
						id: data.id
					}
				})
				if(res.code == 1) {
					this.showToast({
						message: res.msg,
						type: 'success'
					})
					let index = this.indexList.findIndex(ele => ele.id == data.id);
					if(index != -1) this.indexList[index].likenumber += 1
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		height: 100vh;
	}
</style>
<style lang="scss" scoped>
	.w {
		height: 100vh; 
		box-sizing: border-box;
	}
	.list {
		height: calc(100% );
		
	}
	.groupMsg {
		border-bottom: 1rpx solid #eee; 
		padding: 20px 10px;
	}
</style>
