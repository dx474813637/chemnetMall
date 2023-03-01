<template>
	<view class="w">
		<!-- <view class="search-wrapper u-flex u-p-l-20 u-p-r-20">
			<view class="item u-flex-1 u-p-b-10">
				<u-search 
					placeholder="检索名称" 
					v-model="keyword"
					clearabled
					:showAction="false"
					bgColor="#e8e8e8"
					@search="handleSearch"
				></u-search>
			</view>
			
		</view> -->
		<!-- <view class="tabs-w">
			<u-tabs
				:list="tabs_list"
				:current="tabs_current"
				lineHeight="0"
				:activeStyle="activeTabsStyle"
				:itemStyle="itemTabsStyle"
				@change="handleTabsChange"
			>
				<view
					@click="handleGoto({url: '/pages/my/broker/prod_edit'})"
					slot="right"
					class="u-p-r-20 u-flex"
				>
					<u-icon
						name="plus-circle"
						size="16"
					></u-icon>
					<text class="u-p-l-8 u-font-30">添加商品</text>
				</view>
			</u-tabs>
		</view> -->
		
		<view class="list"> 
				<u-swipe-action >
					<u-swipe-action-item
					  :options="item.options" 
					  v-for="(item, index) in list"
					  :disabled="(wode.login == item.login ) || (wode.mobile == item.login )"
					  autoClose
					  :key="item.id" 
					  :name="index"
					  @click="btnClick"
					>
						<view class="swipe-action " >
							<view class="swipe-action__content u-flex u-flex-between u-flex-items-center u-p-25" @click="changeAcc(item)">
								<view class="item">
									<view class="text-danger u-font-38">{{item.text}}</view> 
								</view>
								<view class="item">
									<view v-if="(wode.login == item.login ) || (wode.mobile == item.login )">
										<i class="custom-icon-finish custom-icon text-primary u-font-40"></i>
									</view>
								</view>
							</view>
						</view>
					  
					</u-swipe-action-item>
				</u-swipe-action> 
				<view class="u-p-10 u-p-l-20 u-p-r-20">
					<view class="bg-white u-radius-10 u-p-25 u-flex u-flex-between u-flex-items-center uni-shadow-base" @click="handleGoto('/pages/index/login/login')">
						<view class="item u-flex">
							<u-icon name="plus-circle" color="#222" size="19"></u-icon>
							<view class="u-p-l-8 text-base">选择其他账号</view>
						</view> 
					</view>
				</view> 
		</view>
	</view>
</template>

<script>
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	// import InquiryCard from '@/pages/my/components/InquiryCard/InquiryCard.vue'
	export default {
		data() {
			return {
				keyword: '',
				tabs_current: 0,
				activeTabsStyle: {
					fontSize: '34rpx',
					fontWeight: 'bold',
					color: '#007aff'
				},
				itemTabsStyle: {
					height: '44px',
					padding: '0 13px'
				},
				tabs_list: [
					{
						name: '全部',
						trade_type: 'bs',
						disabled: false,
					},
					// {
					// 	name: '买盘',
					// 	trade_type: 'b',
					// 	disabled: false,
					// },
					// {
					// 	name: '卖盘',
					// 	trade_type: 's',
					// 	disabled: false,
					// },
				],
				indexList: [],
				curP: 1,
				loadstatus: 'loadmore'
			};
		},
		async onLoad() {
			uni.showLoading()
			await this.getData()
		},
		computed: {
			...mapState({
				typeConfig: state => state.theme.typeConfig,
				wode: state => state.user.wode,
			}),
			list() {
				if(!this.indexList || this.indexList.length == 0) return []
				return this.indexList.map(ele => {
					return {
						...ele,
						text: ele.login, 
						disabled: false,
						options: [
							{
								text: '移除',
								name: 'delet',
								style: {
									backgroundColor: '#ff0000'
								}
							}, 
						]
					}
				})
			}
		},
		components: {
			// InquiryCard
		},
		methods: {
			...mapMutations({
				handleGoto: 'user/handleGoto',
				setMyCpy: 'user/setMyCpy',
			}),
			...mapActions({
				wodeFunc: 'user/wode',
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
			handleSearch(v) {
				this.refreshList()
			},
			// changeTabsStatus(key, value) {
			// 	this.tabs_list = this.tabs_list.map(ele => {
			// 		ele[key] = value;
			// 		return ele
			// 	})
			// },
			// async handleTabsChange(value) {
			// 	this.keyword = ''
			// 	this.tabs_current = value.index
			// 	this.changeTabsStatus('disabled', true)
			// 	this.initParamas();
			// 	uni.showLoading();
			// 	await this.getData()
			// 	this.changeTabsStatus('disabled', false)
			// },
			scrolltolower() {
				// this.getMoreData()
			},
			async getData() {
				// if(this.loadstatus != 'loadmore') return
				// this.loadstatus = 'loading'
				const res = await this.$api.login_manage_list({params:{
					// p: this.curP,
					// terms: this.keyword
					// trade_type: this.tabs_list[this.tabs_current].trade_type
				}})
				if(res.code == 1) {
					// this.indexList = [...this.indexList, ...res.list]
					this.indexList = res.list
					// if( this.indexList.length == res.total || !res.list ||res.list.length == 0) {
					// 	this.loadstatus = 'nomore'
					// }else {
					// 	this.loadstatus = 'loadmore'
					// }
				}
			},
			async getMoreData() {
				if(this.loadstatus != 'loadmore') return
				this.curP ++
				await this.getData()
			},
			// async handleChangeStatus({state, id}) {
			// 	const res = await this.$api.ableProduct({params: {id, state}})
			// 	if(res.code == 1) {
			// 		const index = this.indexList.findIndex(ele => ele.id == id)
			// 		this.indexList[index].state = 1-this.indexList[index].state
					
			// 	}
			// }, 
			async btnClick({index: btnIndex, name: itemIndex}) {
				let item = this.list[itemIndex] 
				if(item.options[btnIndex].name == 'delet') {
					uni.showLoading()
					const res  = await this.$api.login_manage_del({params: {id: item.id}})
					if(res.code == 1) {
						uni.showLoading()
						this.refreshList()
					}
				}
			},
			async changeAcc(data) {
				if((this.wode.login == data.login ) || (this.wode.mobile == data.login )) { 
					return
				}
				uni.showLoading({
					title: '操作中...'
				})
				const res = await this.$api.login_manage_change({params: {id: data.id}})
				if(res.code == 1 ) {
					this.setMyCpy()
					uni.showLoading({
						title: '刷新中...'
					})
					await this.wodeFunc()
					this.handleGoto({url: '/pages/my/user/index', type: 'reLaunch'})
				}
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $page-bg2;
		height: 100vh;
		/deep/ .u-swipe-action-item {
			margin: 10px!important;
			background-color: #f8f8f8!important;
			border-radius: 10px!important;
			box-shadow: 0 1px 8px 1px rgba(165, 165, 165, 0.2)!important;
		}
	} 
</style>
<style lang="scss" scoped>
	.w {
		height: 100%;
	}
	.list {
		height: calc(100% );
		.card {
			overflow: hidden;
		}
	}
</style>
